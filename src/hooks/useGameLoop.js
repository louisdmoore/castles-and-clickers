import { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { findExplorationTarget } from '../game/mazeGenerator';
import { PHASES } from '../game/constants';

/**
 * Hook for game loop orchestration
 */
export const useGameLoop = ({
  setupDungeon,
  handleExplorationTick,
  handleCombatTick,
  clearEffects,
  resetLastProcessedTurn,
}) => {
  // OPTIMIZATION: Only subscribe to boolean/primitive values to avoid re-renders
  const dungeon = useGameStore(state => state.dungeon);
  const isRunning = useGameStore(state => state.isRunning);
  const gameSpeed = useGameStore(state => state.gameSpeed);
  // Only subscribe to WHETHER roomCombat exists, not the object itself
  const hasRoomCombat = useGameStore(state => !!state.roomCombat);
  // Pause game during unique drop celebration
  const hasPendingCelebration = useGameStore(state => !!state.pendingUniqueCelebration);
  // OPTIMIZATION: Get actions imperatively to avoid re-renders
  const addGold = useCallback((amount) => useGameStore.getState().addGold(amount), []);
  const incrementStat = useCallback((stat) => useGameStore.getState().incrementStat(stat), []);
  const addCombatLog = useCallback((log) => useGameStore.getState().addCombatLog(log), []);
  const clearCombatLog = useCallback(() => useGameStore.getState().clearCombatLog(), []);
  const endDungeon = useCallback((success) => useGameStore.getState().endDungeon(success), []);
  const setRoomCombat = useCallback((state) => useGameStore.getState().setRoomCombat(state), []);
  const updateRoomCombat = useCallback((updates) => useGameStore.getState().updateRoomCombat(updates), []);
  const clearRoomCombat = useCallback(() => useGameStore.getState().clearRoomCombat(), []);
  const updateLastSaveTime = useCallback(() => useGameStore.getState().updateLastSaveTime(), []);

  // Main game tick
  const gameTick = useCallback(() => {
    // OPTIMIZATION: Get state imperatively at start of tick
    const state = useGameStore.getState();
    const { roomCombat, dungeon } = state;
    const homesteadBonuses = state.getHomesteadBonuses();

    if (!roomCombat || !dungeon) return;

    const { phase, monsters, heroes: combatHeroes, tick, dungeon: mazeDungeon } = roomCombat;

    // Phase: SETUP - initialize maze dungeon
    if (phase === PHASES.SETUP) {
      clearCombatLog();
      setupDungeon();
      return;
    }

    // Phase: EXPLORING
    if (phase === PHASES.EXPLORING) {
      handleExplorationTick();
      return;
    }

    // Phase: COMBAT
    if (phase === PHASES.COMBAT) {
      // Skip tick if combat is paused (for dramatic phase transitions)
      if (Date.now() < state.combatPauseUntil) {
        return;
      }
      handleCombatTick();
      return;
    }

    // Phase: CLEARING - wait then resume exploring
    if (phase === PHASES.CLEARING) {
      if (tick >= 2) {
        const aliveMonsters = monsters.filter(m => m.stats.hp > 0);
        const aliveHeroes = (combatHeroes || []).filter(h => h.stats.hp > 0);

        // Check if party wiped during clearing (e.g., from DOT)
        if (aliveHeroes.length === 0) {
          updateRoomCombat({ phase: PHASES.DEFEAT, tick: 0 });
          addCombatLog({ type: 'system', message: 'Party Defeated!' });
          return;
        }

        if (aliveMonsters.length === 0) {
          // Track solo room clear for achievements
          if (aliveHeroes.length === 1) {
            incrementStat('soloRoomClears');
          }
          // OPTIMIZATION: Single batched update
          updateRoomCombat({ phase: PHASES.COMPLETE, tick: 0 });
          const goldMultiplier = (1 + (homesteadBonuses.goldFind || 0));
          const bonus = Math.floor(100 * dungeon.level * goldMultiplier);
          addGold(bonus);
          incrementStat('totalDungeonsCleared');
          addCombatLog({ type: 'system', message: `Dungeon Complete! +${bonus} gold!` });
          // Track solo room clear for achievements
          if (aliveHeroes.length === 1) {
            incrementStat('soloRoomClears');
          }
        } else {
          clearEffects();
          resetLastProcessedTurn();

          const newTarget = findExplorationTarget(mazeDungeon, roomCombat.partyPosition, monsters);

          // OPTIMIZATION: Single batched update
          updateRoomCombat({
            phase: PHASES.EXPLORING,
            tick: 0,
            targetPosition: newTarget,
            combatMonsters: [],
            turnOrder: [],
            roomsCleared: (roomCombat.roomsCleared || 0) + 1,
          });
        }
      } else {
        updateRoomCombat({ tick: tick + 1 });
      }
      return;
    }

    // Phase: TRANSITIONING - brief pause
    if (phase === PHASES.TRANSITIONING) {
      if (tick >= 1) {
        clearEffects();
        resetLastProcessedTurn();
        // OPTIMIZATION: Single update instead of two
        updateRoomCombat({ phase: PHASES.EXPLORING, tick: 0 });
      } else {
        updateRoomCombat({ tick: tick + 1 });
      }
      return;
    }

    // Phase: COMPLETE - end dungeon, auto-advance to next level
    if (phase === PHASES.COMPLETE) {
      if (tick >= 3) {
        clearEffects();
        resetLastProcessedTurn();

        // Check dungeon type for completion handling
        if (dungeon.isRaid) {
          const { completeRaid } = useGameStore.getState();
          completeRaid();
          clearRoomCombat();
        } else {
          // Normal dungeon completion — endDungeon sets prepPhase,
          // which shows the prep screen. Auto-advance is handled there.
          endDungeon(true);
          clearRoomCombat();
        }
      } else {
        updateRoomCombat({ tick: tick + 1 });
      }
      return;
    }

    // Phase: DEFEAT - end dungeon, retry same level
    if (phase === PHASES.DEFEAT) {
      if (tick >= 3) {
        clearEffects();
        resetLastProcessedTurn();
        incrementStat('totalDeaths');

        if (dungeon.isRaid) {
          const { abandonRaid } = useGameStore.getState();
          abandonRaid();
          clearRoomCombat();
        } else {
          // Normal dungeon defeat — endDungeon sets prepPhase,
          // which shows the prep screen. Auto-retry is handled there.
          endDungeon(false);
          clearRoomCombat();
        }
      } else {
        updateRoomCombat({ tick: tick + 1 });
      }
      return;
    }
  }, [
    setupDungeon, handleExplorationTick, handleCombatTick,
    clearEffects, resetLastProcessedTurn,
    updateRoomCombat, addCombatLog, clearCombatLog, addGold,
    incrementStat, endDungeon, clearRoomCombat,
  ]);

  // Start dungeon - trigger setup phase
  useEffect(() => {
    if (dungeon && !hasRoomCombat) {
      setRoomCombat({ phase: PHASES.SETUP, tick: 0 });
    }
    if (!dungeon && hasRoomCombat) {
      clearRoomCombat();
    }
  }, [dungeon, hasRoomCombat, setRoomCombat, clearRoomCombat]);

  // OPTIMIZATION: Use ref to avoid recreating interval on gameTick changes
  const gameTickRef = useRef(gameTick);
  useEffect(() => {
    gameTickRef.current = gameTick;
  }, [gameTick]);

  // OPTIMIZATION: Prevent tick pile-up with a lock
  const tickInProgressRef = useRef(false);

  // Game loop - only recreate interval when truly necessary
  useEffect(() => {
    if (!dungeon || !isRunning || !hasRoomCombat || hasPendingCelebration) return;

    const tickRate = 250 / gameSpeed;

    // Use RAF-synced timeout for smoother performance
    let timeoutId = null;
    let lastTickTime = performance.now();

    const scheduleTick = () => {
      const now = performance.now();
      const elapsed = now - lastTickTime;
      const delay = Math.max(0, tickRate - elapsed);

      timeoutId = setTimeout(() => {
        // Skip if previous tick still running (prevents pile-up)
        if (tickInProgressRef.current) {
          lastTickTime = performance.now();
          scheduleTick();
          return;
        }

        tickInProgressRef.current = true;
        lastTickTime = performance.now();

        try {
          gameTickRef.current();
        } finally {
          tickInProgressRef.current = false;
        }

        scheduleTick();
      }, delay);
    };

    scheduleTick();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dungeon, isRunning, gameSpeed, hasRoomCombat, hasPendingCelebration]); // Only recreate on these specific changes

  // Offline progress check is handled in Game.jsx

  // Periodic save
  useEffect(() => {
    const interval = setInterval(updateLastSaveTime, 30000);
    return () => clearInterval(interval);
  }, [updateLastSaveTime]);

  return {
    gameTick,
  };
};
