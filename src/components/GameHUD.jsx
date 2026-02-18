import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import NavBar from './NavBar';
import { GoldIcon, TrophyIcon, SkullIcon, BagIcon, MenuIcon, WarningIcon } from './icons/ui';
import { CURRENT_VERSION } from '../data/changelog';

// Relative time display
function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

const SaveIndicator = () => {
  const saveStatus = useGameStore(state => state.saveStatus);
  const [displayText, setDisplayText] = useState('');
  const flashRef = useRef(null);
  const spanRef = useRef(null);
  const lastTimestampRef = useRef(saveStatus?.timestamp);

  // Update relative time display
  useEffect(() => {
    if (!saveStatus?.timestamp) return;

    const update = () => setDisplayText(timeAgo(saveStatus.timestamp));
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [saveStatus?.timestamp]);

  // Flash on new save — use DOM class toggle to avoid setState in effect
  useEffect(() => {
    if (saveStatus?.timestamp && saveStatus.timestamp !== lastTimestampRef.current) {
      lastTimestampRef.current = saveStatus.timestamp;
      const el = spanRef.current;
      if (el) {
        el.classList.remove('save-flash');
        // Force reflow to restart animation
        void el.offsetWidth;
        el.classList.add('save-flash');
      }
      clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => {
        if (spanRef.current) spanRef.current.classList.remove('save-flash');
      }, 1500);
    }
    return () => clearTimeout(flashRef.current);
  }, [saveStatus?.timestamp]);

  if (!saveStatus) return null;

  if (!saveStatus.success) {
    return (
      <span className="text-xs flex items-center gap-1 text-[var(--color-red)]" role="status">
        <WarningIcon size={12} /> Save failed
      </span>
    );
  }

  return (
    <span
      ref={spanRef}
      className="text-xs text-[var(--color-text-dark)]"
      role="status"
    >
      Saved {displayText}
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

  return (
    <header className="pixel-panel-dark" style={{ borderRadius: 0, boxShadow: '0 4px 0 rgba(0,0,0,0.5)' }}>
      {/* Top row: Title, Resources */}
      <div className="px-2 sm:px-4 py-2 flex items-center justify-between border-b border-gray-700/50">
        {/* Left: Hamburger (mobile) + Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="md:hidden pixel-btn p-1.5 flex items-center justify-center"
            title="Toggle Sidebar"
            aria-label="Toggle navigation sidebar"
          >
            <MenuIcon size={20} />
          </button>
          <div>
            <h1 className="pixel-title text-base sm:text-lg">
              Castles & Clickers
            </h1>
            <div className="flex items-center gap-2">
              <span
                className="text-xs text-gray-500 hover:text-[var(--color-gold)] cursor-pointer transition-colors"
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
          </div>
        </div>

        {/* Right: Resources and Stats */}
        <div className="flex items-center flex-wrap gap-1 sm:gap-3 text-xs sm:text-sm">
          <span className="pixel-stat pixel-stat-gold">
            <GoldIcon size={16} /> {Math.floor(headerStats.gold).toLocaleString()}
          </span>
          <span className="pixel-stat pixel-stat-green hidden sm:inline-flex">
            <TrophyIcon size={16} /> {headerStats.totalDungeonsCleared}
          </span>
          <span className="pixel-stat pixel-stat-red hidden sm:inline-flex">
            <SkullIcon size={16} /> {headerStats.totalMonstersKilled}
          </span>
          <span className={`pixel-stat ${headerStats.inventoryCount >= headerStats.maxInventory ? 'pixel-stat-red' : 'pixel-stat-blue'}`}>
            <BagIcon size={16} /> {headerStats.inventoryCount}/{headerStats.maxInventory}
          </span>
        </div>
      </div>

      {/* Bottom row: Navigation and Controls */}
      <div className="px-2 sm:px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
        {/* Navigation */}
        <NavBar activeModal={activeModal} onOpenModal={onOpenModal} />

        {/* Game Controls */}
        <div className="flex items-center gap-2">
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

          {/* Reset */}
          <button
            onClick={onReset}
            className="pixel-btn text-[var(--color-text-dim)] hover:border-[var(--color-red)]"
            title="Reset Game"
          >
            RESET
          </button>
        </div>
      </div>
    </header>
  );
};

export default GameHUD;
