import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { PARTY_SLOTS } from '../data/classes';

// Game orchestration hook
import { useGameOrchestrator } from '../hooks/useGameOrchestrator';

// Layout components
import CanvasDungeonView from '../canvas/CanvasDungeonView';
import CombatLog from './CombatLog';
import Sidebar from './Sidebar';
import GameHUD from './GameHUD';
import DungeonHeader from './DungeonHeader';
import ModalManager from './ModalManager';
import DungeonTransition from './DungeonTransition';
import IdleScreen from './IdleScreen';
import PrepScreen from './PrepScreen';
import RightPanel from './RightPanel';
import { ChartIcon } from './icons/ui';

// Floating UI
import WelcomeBackModal from './WelcomeBackModal';
import RunSummary from './RunSummary';
import DeathRecap from './DeathRecap';
import LootNotifications from './LootNotifications';
import ToastContainer from './ui/Toast';
import UniqueDropCelebration from './UniqueDropCelebration';
import RaidRecapScreen from './RaidRecapScreen';
import ChangelogModal from './ChangelogModal';
import { CURRENT_VERSION } from '../data/changelog';

const GameLayout = () => {
  // Store selectors
  const heroes = useGameStore(state => state.heroes);
  const dungeon = useGameStore(state => state.dungeon);
  const startDungeon = useGameStore(state => state.startDungeon);
  const abandonDungeon = useGameStore(state => state.abandonDungeon);
  const calculateOfflineProgress = useGameStore(state => state.calculateOfflineProgress);
  const gameSpeed = useGameStore(state => state.gameSpeed);
  const setGameSpeed = useGameStore(state => state.setGameSpeed);
  const isRunning = useGameStore(state => state.isRunning);
  const toggleRunning = useGameStore(state => state.toggleRunning);
  const resetGame = useGameStore(state => state.resetGame);
  const featureUnlocks = useGameStore(state => state.featureUnlocks);
  const markFeatureSeen = useGameStore(state => state.markFeatureSeen);
  const markAllUniquesRead = useGameStore(state => state.markAllUniquesRead);
  const dungeonSettings = useGameStore(state => state.dungeonSettings);
  const setDungeonSettings = useGameStore(state => state.setDungeonSettings);
  const highestDungeonCleared = useGameStore(state => state.highestDungeonCleared);
  const maxDungeonLevel = useGameStore(state => state.maxDungeonLevel);
  const lastDungeonSuccess = useGameStore(state => state.lastDungeonSuccess);
  const unreadUniques = useGameStore(state => state.unreadUniques || []);
  const raidState = useGameStore(state => state.raidState);
  const prepPhase = useGameStore(state => state.prepPhase);
  const setLastSeenVersion = useGameStore(state => state.setLastSeenVersion);
  // Game orchestration (hooks, combat, dungeon, display)
  const {
    combatEffects,
    memoizedRemoveEffect,
    displayRoomCombat,
    enemyCount,
    phase,
  } = useGameOrchestrator();

  // Local UI state
  const [activeModal, setActiveModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dungeonTransition, setDungeonTransition] = useState(null);
  const [showChangelog, setShowChangelog] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const prevDungeonRef = useRef(dungeon);
  const lastDungeonLevelRef = useRef(dungeon?.level);
  const isInitialMountRef = useRef(true);

  // Offline progress check
  useEffect(() => {
    const progress = calculateOfflineProgress();
    if (progress) setOfflineProgress(progress);
  }, []);

  // Auto-show changelog for returning players after an update
  useEffect(() => {
    const hasHeroes = heroes && heroes.some(Boolean);
    if (!hasHeroes) return;
    if (featureUnlocks?.lastSeenVersion !== CURRENT_VERSION) {
      setShowChangelog(true);
    }
  }, []);

  // Dungeon transition effect
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevDungeonRef.current = dungeon;
      if (dungeon) lastDungeonLevelRef.current = dungeon.level;
      return;
    }

    const prevDungeon = prevDungeonRef.current;

    if (prevDungeon && !dungeon) {
      setDungeonTransition({
        level: prevDungeon.level,
        type: prevDungeon.type || 'normal',
        isComplete: true,
      });
      const timer = setTimeout(() => setDungeonTransition(null), 2000);
      prevDungeonRef.current = dungeon;
      return () => clearTimeout(timer);
    }

    if (!prevDungeon && dungeon) {
      const isRetry = lastDungeonLevelRef.current === dungeon.level;
      setDungeonTransition({
        level: dungeon.level,
        type: dungeon.type || 'normal',

        isRetry,
      });
      const timer = setTimeout(() => setDungeonTransition(null), 1200);
      prevDungeonRef.current = dungeon;
      lastDungeonLevelRef.current = dungeon.level;
      return () => clearTimeout(timer);
    }

    if (prevDungeon && dungeon && prevDungeon.level !== dungeon.level) {
      setDungeonTransition({
        level: dungeon.level,
        type: dungeon.type || 'normal',

        isRetry: false,
      });
      const timer = setTimeout(() => setDungeonTransition(null), 1200);
      prevDungeonRef.current = dungeon;
      lastDungeonLevelRef.current = dungeon.level;
      return () => clearTimeout(timer);
    }

    prevDungeonRef.current = dungeon;
  }, [dungeon]);

  const mazeDungeonState = displayRoomCombat?.dungeon || null;

  const handleStartDungeon = useCallback((level, options = {}) => {
    setActiveModal(null);
    startDungeon(level, options);
  }, [startDungeon]);

  const hasNewHeroSlotAvailable = useMemo(() => {
    const maxSize = useGameStore.getState().maxPartySize;
    for (let i = 0; i < maxSize && i < PARTY_SLOTS.length; i++) {
      const slot = PARTY_SLOTS[i];
      // Slot is available if within maxPartySize (barracks/dungeon-based)
      const isUnlocked = highestDungeonCleared >= slot.dungeonRequired;
      const isEmpty = !heroes[i];
      if (isUnlocked && isEmpty) return true;
    }
    return false;
  }, [heroes, highestDungeonCleared]);

  const upcomingUnlocks = useMemo(() => {
    const allUnlocks = [
      ...(() => {
        const dpsCount = { current: 0 };
        return PARTY_SLOTS.slice(1).filter(s => !s.flex).map((slot) => {
          let name;
          if (slot.role === 'dps') {
            dpsCount.current++;
            name = `DPS Slot ${dpsCount.current}`;
          } else {
            name = `${slot.role.charAt(0).toUpperCase() + slot.role.slice(1)} Slot`;
          }
          return { type: 'hero', name, dungeonRequired: slot.dungeonRequired };
        });
      })(),
      { type: 'feature', name: 'Shop', dungeonRequired: 5 },
      { type: 'feature', name: 'Auto-Run', dungeonRequired: 5 },
      { type: 'raid', name: 'Sunken Temple', dungeonRequired: 12 },
      { type: 'raid', name: 'Cursed Manor', dungeonRequired: 18 },
      { type: 'raid', name: 'Sky Fortress', dungeonRequired: 24 },
      { type: 'raid', name: 'The Abyss', dungeonRequired: 30 },
      { type: 'raid', name: 'Void Throne', dungeonRequired: 35 },
    ];

    const lockedUnlocks = allUnlocks.filter(u => highestDungeonCleared < u.dungeonRequired);
    if (lockedUnlocks.length === 0) return null;

    const nextMilestone = Math.min(...lockedUnlocks.map(u => u.dungeonRequired));
    const unlocksAtMilestone = lockedUnlocks.filter(u => u.dungeonRequired === nextMilestone);

    return { dungeonRequired: nextMilestone, unlocks: unlocksAtMilestone };
  }, [highestDungeonCleared]);

  const closeModal = () => setActiveModal(null);

  const openModal = (modalId) => {
    setActiveModal(modalId);
    if (modalId === 'homestead' && !featureUnlocks?.homesteadSeen) {
      markFeatureSeen('homesteadSeen');
    }
    if (modalId === 'raids') {
      markFeatureSeen('lastSeenRaidsAt');
    }
    if (modalId === 'equipment' && unreadUniques.length > 0) {
      markAllUniquesRead();
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--color-bg)]">
      {/* Header */}
      <GameHUD
        activeModal={activeModal}
        onOpenModal={openModal}
        gameSpeed={gameSpeed}
        setGameSpeed={setGameSpeed}
        isRunning={isRunning}
        toggleRunning={toggleRunning}
        hasDungeon={!!dungeon}
        dungeonSettings={dungeonSettings}
        setDungeonSettings={setDungeonSettings}
        featureUnlocks={featureUnlocks}
        markFeatureSeen={markFeatureSeen}
        onReset={() => setShowResetConfirm(true)}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onOpenChangelog={() => setShowChangelog(true)}
      />

      {/* Main content — flex on small/medium, CSS grid on wide (1440px+) */}
      <div className={`flex-1 flex overflow-hidden game-content-area${rightPanelOpen ? ' right-panel-open' : ''}`}>
        {/* Sidebar - hidden on mobile, shown as drawer */}
        <div className="hidden md:block">
          <Sidebar
            heroes={heroes}
            dungeon={dungeon}
            onOpenSelector={() => setActiveModal('dungeonSelect')}
            onAbandon={abandonDungeon}
          />
        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 animate-slide-in">
              <Sidebar
                heroes={heroes}
                dungeon={dungeon}
                onOpenSelector={() => { setActiveModal('dungeonSelect'); setSidebarOpen(false); }}
                onAbandon={() => { abandonDungeon(); setSidebarOpen(false); }}
              />
            </div>
          </div>
        )}

        {/* Main area */}
        <main className="flex-1 p-4 overflow-hidden flex flex-col min-w-0 relative">
          {dungeon && mazeDungeonState ? (
            <>
              <DungeonHeader
                dungeon={dungeon}
                phase={phase}
                enemyCount={enemyCount}
                displayRoomCombat={displayRoomCombat}
                highestDungeonCleared={highestDungeonCleared}
                raidState={raidState}
                upcomingUnlocks={upcomingUnlocks}
              />
              <div className="flex-1 min-h-0">
                <CanvasDungeonView
                  effects={combatEffects}
                  onEffectComplete={memoizedRemoveEffect}
                />
              </div>
              <div className="mt-3 max-h-24">
                <CombatLog />
              </div>
            </>
          ) : dungeonTransition ? (
            <div className="flex-1" />
          ) : prepPhase ? (
            <PrepScreen onOpenAscension={() => setActiveModal('ascension')} />
          ) : raidState?.active && !displayRoomCombat ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center pixel-panel p-8">
                <h2 className="pixel-title text-2xl mb-2">Entering Raid...</h2>
                <p className="text-[var(--color-text-dim)]">Preparing the dungeon...</p>
              </div>
            </div>
          ) : (
            <IdleScreen
              heroes={heroes}
              onStartDungeon={handleStartDungeon}
              onOpenModal={openModal}
              lastDungeonSuccess={lastDungeonSuccess}
              highestDungeonCleared={highestDungeonCleared}
              maxDungeonLevel={maxDungeonLevel}
              hasNewHeroSlotAvailable={hasNewHeroSlotAvailable}
              upcomingUnlocks={upcomingUnlocks}
            />
          )}

          {/* Right panel toggle button — wide screens only */}
          {!rightPanelOpen && (
            <button
              onClick={() => setRightPanelOpen(true)}
              className="right-panel-toggle absolute top-4 right-0 items-center justify-center w-8 h-16 pixel-panel-dark rounded-l cursor-pointer z-10"
              aria-label="Open details panel"
              title="Show run stats"
              style={{ borderRight: 'none', borderRadius: '4px 0 0 4px' }}
            >
              <ChartIcon size={16} />
            </button>
          )}
        </main>

        {/* Right panel — wide screens only (1440px+), controlled by CSS */}
        {rightPanelOpen && (
          <RightPanel
            dungeon={dungeon}
            onClose={() => setRightPanelOpen(false)}
          />
        )}
      </div>

      {/* Modal overlays */}
      <ModalManager
        activeModal={activeModal}
        onClose={closeModal}
        onStartDungeon={handleStartDungeon}
      />

      {/* Dungeon transition overlay */}
      <DungeonTransition
        transition={dungeonTransition}
        lastDungeonSuccess={lastDungeonSuccess}
        raidState={raidState}
      />

      {/* Floating UI */}
      <WelcomeBackModal progress={offlineProgress} onClose={() => setOfflineProgress(null)} />
      <RunSummary />
      <DeathRecap />
      <LootNotifications />
      <ToastContainer />
      <UniqueDropCelebration />
      <RaidRecapScreen />
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => {
          setShowChangelog(false);
          setLastSeenVersion(CURRENT_VERSION);
        }}
        lastSeenVersion={featureUnlocks?.lastSeenVersion}
      />

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="pixel-panel-gold p-6 max-w-sm mx-4">
            <h3 className="pixel-title text-xl mb-2">Reset Game?</h3>
            <p className="text-[var(--color-text-dim)] mb-4">
              This will delete all progress: heroes, gold, inventory, and stats. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 pixel-btn"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetGame();
                  setShowResetConfirm(false);
                }}
                className="flex-1 pixel-btn pixel-btn-danger"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLayout;
