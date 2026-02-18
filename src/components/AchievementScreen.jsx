import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENT_CATEGORY, getAllAchievements, getVisibleAchievements } from '../data/achievements';
import { getAchievementProgress } from '../store/helpers/achievementChecker';
import { StarIcon, CheckIcon, LockIcon } from './icons/ui';

const CATEGORY_INFO = {
  [ACHIEVEMENT_CATEGORY.COMBAT]: { name: 'Combat', color: '#ef4444' },
  [ACHIEVEMENT_CATEGORY.PROGRESSION]: { name: 'Progression', color: '#3b82f6' },
  [ACHIEVEMENT_CATEGORY.COLLECTION]: { name: 'Collection', color: '#a855f7' },
  [ACHIEVEMENT_CATEGORY.CHALLENGE]: { name: 'Challenge', color: '#f59e0b' },
  [ACHIEVEMENT_CATEGORY.ECONOMY]: { name: 'Economy', color: '#22c55e' },
};

const AchievementRow = ({ achievement, earned, progress }) => (
  <div
    className={`flex items-center gap-3 p-2 rounded border ${
      earned
        ? 'bg-green-900/20 border-green-500/30'
        : 'bg-gray-900/30 border-gray-700/50'
    }`}
  >
    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
      earned ? 'bg-green-900/40' : 'bg-gray-800'
    }`}>
      {earned ? (
        <CheckIcon size={16} className="text-green-400" />
      ) : achievement.hidden ? (
        <LockIcon size={14} className="text-gray-600" />
      ) : (
        <StarIcon size={16} className="text-gray-500" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${earned ? 'text-green-300' : 'text-gray-200'}`}>
          {achievement.hidden && !earned ? '???' : achievement.name}
        </span>
        {achievement.reward?.gold > 0 && (
          <span className={`text-[10px] ${earned ? 'text-yellow-600' : 'text-yellow-500'}`}>
            +{achievement.reward.gold}g
          </span>
        )}
      </div>
      <div className="text-xs text-gray-400">
        {achievement.hidden && !earned ? 'Hidden achievement' : achievement.description}
      </div>
      {!earned && progress > 0 && progress < 1 && (
        <div className="pixel-bar h-1 mt-1">
          <div
            className="pixel-bar-fill"
            style={{ width: `${Math.round(progress * 100)}%`, backgroundColor: '#3b82f6' }}
          />
        </div>
      )}
    </div>
  </div>
);

const AchievementScreen = () => {
  const earnedAchievements = useGameStore(state => state.earnedAchievements || []);

  // Get the full state snapshot for progress calculation
  const state = useGameStore.getState();

  const { categories, totalEarned } = useMemo(() => {
    const visible = getVisibleAchievements(earnedAchievements);
    const earnedSet = new Set(earnedAchievements);

    const cats = {};
    for (const cat of Object.values(ACHIEVEMENT_CATEGORY)) {
      cats[cat] = [];
    }

    for (const a of visible) {
      const isEarned = earnedSet.has(a.id);
      const progress = isEarned ? 1 : getAchievementProgress(a.id, state);
      cats[a.category].push({ achievement: a, earned: isEarned, progress });
    }

    // Sort: earned at bottom, then by progress descending
    for (const cat of Object.keys(cats)) {
      cats[cat].sort((a, b) => {
        if (a.earned !== b.earned) return a.earned ? 1 : -1;
        return b.progress - a.progress;
      });
    }

    return {
      categories: cats,
      totalEarned: earnedAchievements.length,
    };
  }, [earnedAchievements, state]);

  const totalAll = getAllAchievements().length;

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="pixel-panel-dark p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="pixel-subtitle">Achievements</span>
          <span className="text-sm text-green-400 font-bold">
            {totalEarned}/{totalAll}
          </span>
        </div>
        <div className="pixel-bar h-2">
          <div
            className="pixel-bar-fill"
            style={{
              width: `${totalAll > 0 ? (totalEarned / totalAll) * 100 : 0}%`,
              backgroundColor: '#22c55e',
            }}
          />
        </div>
      </div>

      {/* Categories */}
      {Object.entries(CATEGORY_INFO).map(([cat, info]) => {
        const items = categories[cat];
        if (!items || items.length === 0) return null;
        const catEarned = items.filter(i => i.earned).length;

        return (
          <div key={cat}>
            <div className="flex items-center justify-between mb-2">
              <span className="pixel-label font-bold" style={{ color: info.color }}>
                {info.name}
              </span>
              <span className="text-xs text-gray-500">
                {catEarned}/{items.length}
              </span>
            </div>
            <div className="space-y-1">
              {items.map(({ achievement, earned, progress }) => (
                <AchievementRow
                  key={achievement.id}
                  achievement={achievement}
                  earned={earned}
                  progress={progress}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AchievementScreen;
