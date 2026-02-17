import { getWorldBossForLevel } from '../data/worldBosses';
import { WorldBossIcon } from './icons/worldBosses';
import { CrownIcon, SwordIcon, ShieldIcon, HeartIcon, GoldIcon } from './icons/ui';

const IdleScreen = ({
  heroes,
  onStartDungeon,
  onOpenModal,
  lastDungeonSuccess,
  highestDungeonCleared,
  maxDungeonLevel,
  hasNewHeroSlotAvailable,
  upcomingUnlocks,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center pixel-panel p-8">
        <div className="text-6xl mb-4">
          <svg width="96" height="96" viewBox="0 0 16 16">
            <rect x="3" y="8" width="10" height="8" fill="#4a4a6a"/>
            <rect x="4" y="6" width="8" height="2" fill="#5a5a7a"/>
            <rect x="5" y="4" width="6" height="2" fill="#6a6a8a"/>
            <rect x="7" y="2" width="2" height="2" fill="#ffd700"/>
            <rect x="6" y="10" width="4" height="6" fill="#2a2a4a"/>
            <rect x="7" y="11" width="2" height="3" fill="#8b4513"/>
          </svg>
        </div>
        <h2 className="pixel-title text-2xl mb-2">No Active Dungeon</h2>
        <p className="text-[var(--color-text-dim)] mb-4">
          {heroes.length === 0
            ? 'Recruit some heroes to begin your adventure!'
            : lastDungeonSuccess == null
            ? 'Your heroes are ready for their first adventure!'
            : lastDungeonSuccess === false
            ? 'Your heroes need to regroup and try again!'
            : 'Victory! Ready for the next challenge?'}
        </p>
        {hasNewHeroSlotAvailable && heroes.length > 0 && (
          <button
            onClick={() => onOpenModal('heroes')}
            className="mb-4 px-4 py-2 bg-green-600/20 border border-green-500/50 rounded text-green-400 text-sm animate-pulse hover:bg-green-600/30 transition-colors"
          >
            New Hero Slot Available!
          </button>
        )}
        {!hasNewHeroSlotAvailable && upcomingUnlocks && heroes.length > 0 && (
          <div className="mb-4 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300 text-sm">
            <div className="font-bold mb-1">Clear Dungeon {upcomingUnlocks.dungeonRequired} to unlock:</div>
            <ul className="list-disc list-inside">
              {upcomingUnlocks.unlocks.map((unlock, idx) => (
                <li key={idx}>{unlock.name}</li>
              ))}
            </ul>
          </div>
        )}
        {/* World Boss Preview */}
        {heroes.length > 0 && (() => {
          const nextLevel = lastDungeonSuccess == null ? 1 : highestDungeonCleared + 1;
          const worldBoss = getWorldBossForLevel(nextLevel);
          if (!worldBoss) return null;

          return (
            <div className="mb-4 pixel-panel p-4 border-amber-500/50 bg-amber-900/20 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2 justify-center">
                <CrownIcon size={18} className="text-amber-400" />
                <span className="text-amber-400 font-bold text-sm">WORLD BOSS AWAITS</span>
              </div>
              <div className="flex items-center gap-4">
                <WorldBossIcon bossId={worldBoss.id} size={64} />
                <div className="flex-1 text-left">
                  <div className="text-[10px] text-gray-500 uppercase">World Boss:</div>
                  <div className="text-amber-300 font-bold">{worldBoss.name}</div>
                  <div className="text-xs text-amber-400/70 italic mb-2">"{worldBoss.title}"</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <div className="flex items-center gap-1 text-red-400">
                      <SwordIcon size={12} /> {worldBoss.baseStats.attack}
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <ShieldIcon size={12} /> {worldBoss.baseStats.defense}
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <HeartIcon size={12} /> {worldBoss.baseStats.maxHp}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <GoldIcon size={12} /> {worldBoss.goldReward.min}-{worldBoss.goldReward.max}
                    </div>
                  </div>
                </div>
              </div>
              {worldBoss.guaranteedRarity && (
                <div className="mt-2 text-xs text-center text-purple-400">
                  Guaranteed {worldBoss.guaranteedRarity}+ gear drop
                </div>
              )}
            </div>
          );
        })()}
        {heroes.length === 0 ? (
          <button
            onClick={() => onOpenModal('heroes')}
            className="pixel-btn pixel-btn-primary"
          >
            Recruit Heroes
          </button>
        ) : lastDungeonSuccess == null ? (
          <button
            onClick={() => onStartDungeon(1)}
            className="pixel-btn pixel-btn-primary animate-pulse"
          >
            Start Your First Adventure!
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            {highestDungeonCleared < maxDungeonLevel && (
              <button
                onClick={() => onStartDungeon(highestDungeonCleared + 1)}
                className="pixel-btn pixel-btn-primary"
              >
                {lastDungeonSuccess === false ? 'Retry' : 'Continue to'} Level {highestDungeonCleared + 1}
              </button>
            )}
            <button
              onClick={() => onOpenModal('dungeonSelect')}
              className="pixel-btn pixel-btn-secondary"
            >
              Select Dungeon
            </button>
            {highestDungeonCleared >= 12 && (
              <button
                onClick={() => onOpenModal('raids')}
                className="pixel-btn pixel-btn-secondary flex items-center justify-center gap-2"
              >
                <CrownIcon size={16} className="text-amber-400" />
                <span>Raids</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdleScreen;
