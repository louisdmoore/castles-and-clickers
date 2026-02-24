import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import NavBar from './NavBar';
import { GoldIcon, BagIcon, MenuIcon, WarningIcon, SettingsIcon } from './icons/ui';
import { CURRENT_VERSION } from '../data/changelog';
import { DIFFICULTY_STOPS, getDifficultyInfo, DIFFICULTY_SPEED_BONUS, DIFFICULTY_ELITE_BONUS } from '../data/difficulty';

const SaveIndicator = () => {
  const saveStatus = useGameStore(state => state.saveStatus);

  if (!saveStatus || saveStatus.success) return null;

  return (
    <span className="text-xs flex items-center gap-1 text-[var(--color-red)]" role="status">
      <WarningIcon size={12} /> Save failed
    </span>
  );
};

// Throttled header stats hook - updates every 500ms
function useThrottledHeaderStats() {
  const [headerStats, setHeaderStats] = useState(() => {
    const state = useGameStore.getState();
    return {
      gold: state.gold || 0,
      totalDungeonsCleared: state.stats?.totalDungeonsCleared || 0,
      totalMonstersKilled: state.stats?.totalMonstersKilled || 0,
      inventoryCount: state.inventory?.length || 0,
      maxInventory: state.maxInventory || 20,
    };
  });

  const lastRef = useRef({ gold: 0, clears: 0, kills: 0, inv: 0 });

  useEffect(() => {
    const update = () => {
      const state = useGameStore.getState();
      const gold = state.gold || 0;
      const clears = state.stats?.totalDungeonsCleared || 0;
      const kills = state.stats?.totalMonstersKilled || 0;
      const inv = state.inventory?.length || 0;
      const last = lastRef.current;

      if (gold !== last.gold || clears !== last.clears || kills !== last.kills || inv !== last.inv) {
        lastRef.current = { gold, clears, kills, inv };
        setHeaderStats({
          gold,
          totalDungeonsCleared: clears,
          totalMonstersKilled: kills,
          inventoryCount: inv,
          maxInventory: state.maxInventory || 20,
        });
      }
    };
    const id = setInterval(update, 523);
    return () => clearInterval(id);
  }, []);

  return headerStats;
}

const NOTIFICATION_LEVELS = [
  { id: 'full', label: 'Full' },
  { id: 'reduced', label: 'Reduced' },
  { id: 'minimal', label: 'Minimal' },
];

const GameHUD = ({
  activeModal,
  onOpenModal,
  gameSpeed,
  setGameSpeed,
  isRunning,
  toggleRunning,
  hasDungeon,
  dungeonSettings,
  setDungeonSettings,
  featureUnlocks,
  markFeatureSeen,
  onReset,
  onToggleSidebar,
  onOpenChangelog,
}) => {
  const headerStats = useThrottledHeaderStats();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const settingsRef = useRef(null);
  const difficultyRef = useRef(null);
  const notificationLevel = useGameStore(state => state.notificationSettings?.level || 'full');
  const setNotificationLevel = useGameStore(state => state.setNotificationLevel);
  const globalDifficulty = useGameStore(state => state.globalDifficulty ?? 1.0);
  const setGlobalDifficulty = useGameStore(state => state.setGlobalDifficulty);

  // Close settings dropdown on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen]);

  // Close difficulty dropdown on outside click
  useEffect(() => {
    if (!difficultyOpen) return;
    const handler = (e) => {
      if (difficultyRef.current && !difficultyRef.current.contains(e.target)) {
        setDifficultyOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [difficultyOpen]);

  const handleReset = useCallback(() => {
    setSettingsOpen(false);
    onReset();
  }, [onReset]);

  return (
    <header className="pixel-panel-dark" style={{ borderRadius: 0, boxShadow: '0 2px 0 rgba(0,0,0,0.5)' }}>
      <div className="px-2 py-1 flex items-center gap-2 flex-wrap">
        {/* Hamburger (mobile) */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden pixel-btn p-1 flex items-center justify-center"
          title="Toggle Sidebar"
          aria-label="Toggle navigation sidebar"
        >
          <MenuIcon size={18} />
        </button>

        {/* Title + Version */}
        <div className="flex items-center gap-1.5">
          <h1 className="pixel-title text-sm whitespace-nowrap">
            Castles & Clickers
          </h1>
          <span
            className="text-[10px] text-gray-500 hover:text-[var(--color-gold)] cursor-pointer transition-colors"
            onClick={onOpenChangelog}
            title="View changelog"
            role="button"
            aria-label="View changelog"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenChangelog(); } }}
          >
            v{CURRENT_VERSION}
          </span>
          <SaveIndicator />
        </div>

        {/* Resources */}
        <div className="flex items-center gap-1 text-xs">
          <span className="pixel-stat pixel-stat-gold">
            <GoldIcon size={14} /> {Math.floor(headerStats.gold).toLocaleString()}
          </span>
          <span className={`pixel-stat ${headerStats.inventoryCount >= headerStats.maxInventory ? 'pixel-stat-red' : 'pixel-stat-blue'}`}>
            <BagIcon size={14} /> {headerStats.inventoryCount}/{headerStats.maxInventory}
          </span>
          {featureUnlocks?.difficultyUnlocked && (
            <div className="relative" ref={difficultyRef}>
              <button
                onClick={() => setDifficultyOpen(prev => !prev)}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-colors"
                style={{
                  color: getDifficultyInfo(globalDifficulty).color,
                  borderColor: getDifficultyInfo(globalDifficulty).color + '60',
                  backgroundColor: getDifficultyInfo(globalDifficulty).color + '15',
                }}
                title={`${getDifficultyInfo(globalDifficulty).label} (${globalDifficulty}x)\nMonster stats: \u00D7${globalDifficulty}\nRewards: \u00D7${globalDifficulty}${DIFFICULTY_SPEED_BONUS[globalDifficulty] ? `\nSpeed bonus: +${Math.round(DIFFICULTY_SPEED_BONUS[globalDifficulty] * 100)}%` : ''}${DIFFICULTY_ELITE_BONUS[globalDifficulty] ? `\nExtra elites: +${DIFFICULTY_ELITE_BONUS[globalDifficulty]}` : ''}`}
                aria-label={`Difficulty: ${getDifficultyInfo(globalDifficulty).label}`}
                aria-expanded={difficultyOpen}
              >
                {getDifficultyInfo(globalDifficulty).label}
              </button>
              {difficultyOpen && (
                <div className="absolute top-full left-0 mt-1 pixel-panel p-2 z-50 min-w-[140px] space-y-0.5">
                  <div className="text-[10px] text-gray-400 mb-1">Global Difficulty</div>
                  {DIFFICULTY_STOPS.map(stop => {
                    const info = getDifficultyInfo(stop);
                    const isActive = stop === globalDifficulty;
                    return (
                      <button
                        key={stop}
                        onClick={() => {
                          setGlobalDifficulty(stop);
                          setDifficultyOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                          isActive
                            ? 'bg-gray-700'
                            : 'hover:bg-gray-800'
                        }`}
                        style={{ color: info.color }}
                      >
                        <span className="font-bold">{info.label}</span>
                        <span className="text-gray-500 ml-1">({stop}x)</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <NavBar activeModal={activeModal} onOpenModal={onOpenModal} />

        {/* Game Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Auto-advance toggle */}
          {featureUnlocks?.autoAdvance && (
            <div className="relative">
              <button
                onClick={() => {
                  setDungeonSettings({ autoAdvance: !dungeonSettings?.autoAdvance });
                  if (!featureUnlocks?.autoAdvanceSeen) {
                    markFeatureSeen('autoAdvanceSeen');
                  }
                }}
                className={`pixel-btn text-xs ${
                  dungeonSettings?.autoAdvance ? 'pixel-btn-success' : ''
                }`}
                title="Auto-advance to next dungeon after completion"
              >
                AUTO {dungeonSettings?.autoAdvance ? 'ON' : 'OFF'}
              </button>
              {!featureUnlocks?.autoAdvanceSeen && (
                <span className="pixel-badge absolute -top-2 -right-2 animate-pixel-blink">
                  NEW
                </span>
              )}
            </div>
          )}

          {/* Speed control */}
          <div className="flex">
            {[1, 2, 3].map(speed => (
              <button
                key={speed}
                onClick={() => setGameSpeed(speed)}
                className={`pixel-speed-btn ${gameSpeed === speed ? 'active' : ''}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Pause/Play */}
          {hasDungeon && (
            <button
              onClick={toggleRunning}
              className={`pixel-btn ${isRunning ? '' : 'pixel-btn-success'}`}
            >
              {isRunning ? 'PAUSE' : 'PLAY'}
            </button>
          )}

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(prev => !prev)}
              className="pixel-btn p-1 flex items-center justify-center"
              title="Settings"
              aria-label="Settings"
              aria-expanded={settingsOpen}
            >
              <SettingsIcon size={16} />
            </button>
            {settingsOpen && (
              <div className="absolute top-full right-0 mt-1 pixel-panel p-2 z-50 min-w-[160px] space-y-2">
                <div>
                  <div className="text-[10px] text-gray-400 mb-1">Notifications</div>
                  <div className="flex gap-0.5">
                    {NOTIFICATION_LEVELS.map(lvl => (
                      <button
                        key={lvl.id}
                        onClick={() => setNotificationLevel(lvl.id)}
                        className={`flex-1 px-1 py-0.5 text-[10px] rounded border transition-colors ${
                          notificationLevel === lvl.id
                            ? 'border-blue-400 bg-blue-900/40 text-blue-300'
                            : 'border-gray-700 text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="pixel-btn text-xs text-[var(--color-red)] hover:border-[var(--color-red)] w-full"
                >
                  Reset Game
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHUD;
