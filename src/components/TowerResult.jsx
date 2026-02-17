import { memo, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { SwordIcon, StarIcon } from './icons/ui';

const TowerResult = () => {
  const lastTowerResult = useGameStore(state => state.lastTowerResult);
  const dismissTowerResult = useGameStore(state => state.dismissTowerResult);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!lastTowerResult) return;
    const timer = setTimeout(dismissTowerResult, 8000);
    return () => clearTimeout(timer);
  }, [lastTowerResult, dismissTowerResult]);

  if (!lastTowerResult) return null;

  const { floor, seed, isNewBest } = lastTowerResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="pixel-panel p-6 max-w-sm w-full mx-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <SwordIcon size={20} />
          <h2 className="pixel-title text-lg" style={{ color: '#a855f7' }}>Tower of Trials</h2>
        </div>

        <div className="pixel-panel-dark p-4 mb-4">
          <div className="text-[var(--color-text-dim)] text-xs mb-1">You reached</div>
          <div className="pixel-title text-3xl mb-1" style={{ color: '#a855f7' }}>
            Floor {floor}
          </div>
          {isNewBest && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <StarIcon size={12} />
              <span className="pixel-label text-xs" style={{ color: '#fbbf24' }}>New Personal Best!</span>
              <StarIcon size={12} />
            </div>
          )}
        </div>

        <div className="text-[10px] text-[var(--color-text-dim)] mb-4">
          Seed: #{seed}
        </div>

        <button onClick={dismissTowerResult} className="pixel-btn pixel-btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
};

export default memo(TowerResult);
