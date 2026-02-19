import { memo, useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';

// OPTIMIZATION: Memoized log entry to prevent re-renders
const LogEntry = memo(({ log }) => {
  if (log.type === 'system') {
    return <span className="text-[var(--color-gold)]">{log.message}</span>;
  }
  if (log.type === 'attack') {
    return (
      <span>
        <span className="text-white">{log.actor?.name || '???'}</span>
        {' '}ATK{' '}
        <span className="text-red-300">{log.target?.name || '???'}</span>
        {' '}<span className="text-[var(--color-red)]">-{log.damage}</span>
      </span>
    );
  }
  if (log.type === 'skill') {
    return (
      <span>
        <span className="text-white">{log.actor?.name || '???'}</span>
        {' '}<span className="text-[#ff8844]">{log.skill?.name || 'SKILL'}</span>
        {' '}<span className="text-red-300">{log.target?.name || '???'}</span>
        {' '}<span className="text-[var(--color-red)]">-{log.damage}</span>
      </span>
    );
  }
  if (log.type === 'heal') {
    return (
      <span>
        <span className="text-white">{log.actor?.name || '???'}</span>
        {' '}<span className="text-[var(--color-green)]">{log.skill?.name || 'HEAL'}</span>
        {' '}<span className="text-green-300">{log.target?.name || '???'}</span>
        {' '}<span className="text-[#88ff88]">+{log.amount}</span>
      </span>
    );
  }
  if (log.type === 'death') {
    return <span className={log.isHero ? 'text-[var(--color-red)]' : 'text-[var(--color-green)]'}>{log.target?.name || '???'} DEFEATED</span>;
  }
  return null;
});

/**
 * Combat log display component
 * OPTIMIZATION: Memoized entries, stable keys, shallow selector
 */
const CombatLog = () => {
  const [expanded, setExpanded] = useState(false);
  // OPTIMIZATION: Only re-render when log length changes, not on every log reference change
  const combatLogLength = useGameStore(state => state.combatLog.length);
  const combatLog = useGameStore(state => state.combatLog);

  // OPTIMIZATION: Memoize the slice to avoid creating new array on every render
  const recentLogs = useMemo(() => combatLog.slice(expanded ? -12 : -6), [combatLog, combatLogLength, expanded]);

  return (
    <div
      className={`pixel-panel-dark p-3 ${expanded ? 'max-h-48' : 'max-h-28'} overflow-y-auto text-sm cursor-pointer transition-all`}
      role="log"
      aria-label="Combat log"
      aria-live="polite"
      onClick={() => setExpanded(e => !e)}
      title={expanded ? 'Click to collapse' : 'Click to expand'}
    >
      {recentLogs.map((log, i) => (
        <div key={`${combatLogLength - recentLogs.length + i}`} className="text-[var(--color-text-dim)]">
          <LogEntry log={log} />
        </div>
      ))}
    </div>
  );
};

export default memo(CombatLog);
