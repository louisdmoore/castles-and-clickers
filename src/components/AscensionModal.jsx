import { memo, useCallback, useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import ModalOverlay from './ModalOverlay';
import { StarIcon, CrownIcon, ArrowUpIcon, LockIcon, DoorIcon, PartyIcon } from './icons/ui';
import { ASCENSION_MILESTONES, getNextMilestone, getAscensionDungeonCap } from '../data/ascensionMilestones';

const AscensionModal = ({ isOpen, onClose }) => {
  const ascension = useGameStore(state => state.ascension);
  const performAscension = useGameStore(state => state.performAscension);
  const canAscend = useGameStore(state => state.canAscend);
  const highestDungeonCleared = useGameStore(state => state.highestDungeonCleared);
  const maxDungeonLevel = useGameStore(state => state.maxDungeonLevel);

  const [confirming, setConfirming] = useState(false);

  const eligible = canAscend();
  const currentCount = ascension?.count || 0;
  const nextCount = currentCount + 1;
  const nextMilestone = useMemo(() => getNextMilestone(currentCount), [currentCount]);

  // Compute what will happen on ascension
  const preview = useMemo(() => {
    const newCap = getAscensionDungeonCap(nextCount);
    const statBonus = nextCount * 10;
    const milestone = ASCENSION_MILESTONES[nextCount];
    return { newCap, statBonus, milestone };
  }, [nextCount]);

  const handleAscend = useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    performAscension();
    setConfirming(false);
    onClose();
  }, [confirming, performAscension, onClose]);

  const handleCancel = useCallback(() => {
    setConfirming(false);
  }, []);

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} title="Ascension" size="md">
      <div className="space-y-4">
        {/* Current status */}
        <div className="pixel-panel-dark p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <StarIcon size={20} />
            <span className="pixel-title text-lg" style={{ color: '#f59e0b' }}>
              Ascension {currentCount}
            </span>
          </div>
          {currentCount > 0 && (
            <div className="text-sm text-[var(--color-text-dim)]">
              +{currentCount * 10}% all stats | Dungeon cap: D{maxDungeonLevel}
            </div>
          )}
        </div>

        {/* Eligibility check */}
        {!eligible && (
          <div className="pixel-panel-dark p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-dim)]">
              <LockIcon size={14} />
              <span>Clear D{maxDungeonLevel} to ascend</span>
            </div>
            <div className="text-xs text-[var(--color-text-dark)] mt-1">
              Progress: D{highestDungeonCleared}/{maxDungeonLevel}
            </div>
          </div>
        )}

        {/* Preview of what you gain */}
        {eligible && (
          <>
            <div className="pixel-panel-dark p-3">
              <div className="pixel-label text-xs mb-2 flex items-center gap-1">
                <ArrowUpIcon size={12} />
                What You Gain
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <StarIcon size={14} />
                  <span style={{ color: '#34d399' }}>+{preview.statBonus}% all stats</span>
                  <span className="text-[var(--color-text-dim)]">(permanent)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DoorIcon size={14} />
                  <span>Dungeon cap raised to D{preview.newCap}</span>
                </div>
                {preview.milestone?.unlock && (
                  <div className="flex items-center gap-2 text-sm">
                    {preview.milestone.unlock.id.includes('party_slot') ? (
                      <PartyIcon size={14} />
                    ) : (
                      <CrownIcon size={14} />
                    )}
                    <span style={{ color: '#fbbf24' }}>{preview.milestone.unlock.name}</span>
                    <span className="text-xs text-[var(--color-text-dim)]">
                      {preview.milestone.unlock.description}
                    </span>
                  </div>
                )}
                {preview.milestone?.bonusUnlock && (
                  <div className="flex items-center gap-2 text-sm">
                    <CrownIcon size={14} />
                    <span style={{ color: '#fbbf24' }}>{preview.milestone.bonusUnlock.name}</span>
                    <span className="text-xs text-[var(--color-text-dim)]">
                      {preview.milestone.bonusUnlock.description}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* What resets */}
            <div className="pixel-panel-dark p-3">
              <div className="pixel-label text-xs mb-2" style={{ color: '#ef4444' }}>
                What Resets
              </div>
              <ul className="space-y-1 text-xs text-[var(--color-text-dim)]">
                <li>Dungeon progress returns to D10</li>
                <li>Hero levels reset to 10 (skill points redistributed)</li>
                <li>Gold resets to 10,000</li>
                <li>Inventory cleared (equipped gear kept)</li>
                <li>Consumables and shop cleared</li>
              </ul>
            </div>

            {/* What's preserved */}
            <div className="pixel-panel-dark p-3">
              <div className="pixel-label text-xs mb-2" style={{ color: '#34d399' }}>
                What's Preserved
              </div>
              <ul className="space-y-1 text-xs text-[var(--color-text-dim)]">
                <li>Heroes (classes, names, traits, equipped gear)</li>
                <li>Homestead building levels</li>
                <li>Unique item collection</li>
                <li>Lifetime stats and achievements</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-center pt-2">
              {confirming ? (
                <>
                  <button onClick={handleAscend} className="pixel-btn" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                    Confirm Ascension
                  </button>
                  <button onClick={handleCancel} className="pixel-btn pixel-btn-secondary">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleAscend} className="pixel-btn pixel-btn-primary">
                  Ascend to A{nextCount}
                </button>
              )}
            </div>
          </>
        )}

        {/* Next milestone preview (when not eligible or after showing gains) */}
        {!eligible && nextMilestone && (
          <div className="pixel-panel-dark p-3">
            <div className="pixel-label text-xs mb-2">Next Milestone: Ascension {nextMilestone.level}</div>
            <div className="space-y-1 text-xs text-[var(--color-text-dim)]">
              <div>{nextMilestone.label}</div>
              {nextMilestone.unlock && <div style={{ color: '#fbbf24' }}>{nextMilestone.unlock.name}: {nextMilestone.unlock.description}</div>}
              {nextMilestone.bonusUnlock && <div style={{ color: '#fbbf24' }}>{nextMilestone.bonusUnlock.name}: {nextMilestone.bonusUnlock.description}</div>}
            </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
};

export default memo(AscensionModal);
