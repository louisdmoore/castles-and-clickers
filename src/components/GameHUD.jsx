import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import NavBar from './NavBar';
import { GoldIcon, BagIcon, MenuIcon, WarningIcon, SettingsIcon } from './icons/ui';
import { CURRENT_VERSION } from '../data/changelog';

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
  const settingsRef = useRef(null);

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
              <div className="absolute top-full right-0 mt-1 pixel-panel p-2 z-50 min-w-[120px]">
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
