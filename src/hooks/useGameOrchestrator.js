import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useCombatEffects } from './useCombatEffects';
import { useDungeon } from './useDungeon';
import { useCombat } from './useCombat';
import { useGameLoop } from './useGameLoop';
import { useThrottledDisplay } from './useThrottledDisplay';
import { PHASES } from '../game/constants';

/**
 * Throttled enemy count hook - polls for monster counts to update enemy progress bar
 */
function useEnemyCount() {
  const [counts, setCounts] = useState({ alive: 0, total: 0 });
  const lastRef = useRef({ alive: 0, total: 0 });

  useEffect(() => {
    const update = () => {
      const roomCombat = useGameStore.getState().roomCombat;
      const monsters = roomCombat?.monsters || [];
      const alive = monsters.filter(m => m?.stats?.hp > 0 && !m.isBoss).length;
      const total = monsters.filter(m => !m.isBoss).length;

      if (alive !== lastRef.current.alive || total !== lastRef.current.total) {
        lastRef.current = { alive, total };
        setCounts({ alive, total });
      }
    };
    // Poll at ~500ms, offset from other intervals
    const id = setInterval(update, 487);
    update();
    return () => clearInterval(id);
  }, []);

  return counts;
}

/**
 * Custom hook that bundles all game loop orchestration.
 * Manages combat effects, dungeon exploration, combat ticks,
 * throttled display state, and enemy count polling.
 */
export const useGameOrchestrator = () => {
  // Combat visual effects
  const { combatEffects, addEffect, removeEffect, clearEffects } = useCombatEffects();

  // Dungeon setup and exploration
  const { setupDungeon, handleExplorationTick } = useDungeon({ addEffect });

  // Combat logic
  const { handleCombatTick, resetLastProcessedTurn } = useCombat({ addEffect });

  // Game loop orchestration
  useGameLoop({
    setupDungeon,
    handleExplorationTick,
    handleCombatTick,
    clearEffects,
    resetLastProcessedTurn,
  });

  // Throttled display state - renders at ~15 FPS instead of every tick
  const displayRoomCombat = useThrottledDisplay();

  // Separate polling for enemy counts (updates more frequently for progress bar)
  const enemyCount = useEnemyCount();

  // Stable callback reference for canvas effect cleanup
  const memoizedRemoveEffect = useCallback((id) => removeEffect(id), [removeEffect]);

  // Derived values
  const phase = displayRoomCombat?.phase || PHASES.IDLE;

  return {
    combatEffects,
    memoizedRemoveEffect,
    displayRoomCombat,
    enemyCount,
    phase,
  };
};
