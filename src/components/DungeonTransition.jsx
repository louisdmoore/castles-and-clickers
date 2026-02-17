import { RAIDS } from '../data/raids';

const DungeonTransition = ({ transition, lastDungeonSuccess, raidState }) => {
  if (!transition) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto relative">
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
            />
            <div
              className="absolute inset-2 rounded-full animate-pulse"
              style={{ background: 'radial-gradient(circle, #6b21a8 0%, #1e1b4b 100%)' }}
            />
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 16 16"
            >
              <rect x="3" y="8" width="10" height="8" fill="#4a4a6a" />
              <rect x="4" y="6" width="8" height="2" fill="#5a5a7a" />
              <rect x="5" y="4" width="6" height="2" fill="#6a6a8a" />
              <rect x="7" y="2" width="2" height="2" fill="#ffd700" />
              <rect x="6" y="10" width="4" height="6" fill="#2a2a4a" />
              <rect x="7" y="11" width="2" height="3" fill="#1a1a2e" />
            </svg>
          </div>
        </div>
        <h2 className="pixel-title text-2xl mb-2 text-white">
          {transition.isComplete
            ? (lastDungeonSuccess ? 'Victory!' : 'Defeat')
            : raidState?.active
            ? 'Entering'
            : transition.isRetry
            ? 'Retrying'
            : 'Travelling to'}
        </h2>
        <p className="text-3xl font-bold text-[var(--color-gold)] mb-4">
          {transition.isComplete
            ? (lastDungeonSuccess ? 'Preparing next adventure...' : 'The party has fallen...')
            : raidState?.active && RAIDS[raidState.raidId]
            ? RAIDS[raidState.raidId].name
            : transition.type === 'tower'
            ? `Tower Floor ${transition.towerFloor || transition.level}`
            : `Dungeon Level ${transition.level}`}
        </p>
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-purple-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DungeonTransition;
