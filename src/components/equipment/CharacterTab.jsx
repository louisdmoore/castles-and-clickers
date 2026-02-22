import { CLASSES } from '../../data/classes';
import PaperDoll from './PaperDoll';

const ROLE_ACCENT = { tank: '#60a5fa', healer: '#4ade80', dps: '#f87171' };

// 12 particle configs — staggered positions, sizes, speeds
const PARTICLES = [
  { left: '12%', bottom: '5%',  size: 3, duration: 7,  delay: 0,   drift: '8px' },
  { left: '28%', bottom: '15%', size: 2, duration: 9,  delay: 1.2, drift: '-12px' },
  { left: '45%', bottom: '0%',  size: 4, duration: 6,  delay: 0.5, drift: '5px' },
  { left: '62%', bottom: '10%', size: 2, duration: 8,  delay: 2.8, drift: '-8px' },
  { left: '78%', bottom: '20%', size: 3, duration: 7.5,delay: 1.8, drift: '15px' },
  { left: '90%', bottom: '8%',  size: 2, duration: 10, delay: 3.5, drift: '-5px' },
  { left: '8%',  bottom: '25%', size: 3, duration: 6.5,delay: 4.2, drift: '-10px' },
  { left: '35%', bottom: '18%', size: 2, duration: 8.5,delay: 0.8, drift: '12px' },
  { left: '55%', bottom: '30%', size: 3, duration: 5.5,delay: 2.2, drift: '-6px' },
  { left: '72%', bottom: '12%', size: 4, duration: 7,  delay: 3.8, drift: '10px' },
  { left: '20%', bottom: '2%',  size: 2, duration: 9.5,delay: 4.8, drift: '-15px' },
  { left: '85%', bottom: '22%', size: 3, duration: 6,  delay: 1.5, drift: '7px' },
];

const CharacterTab = ({
  hero,
  selectedSlot,
  onSelectSlot,
  onUnequip,
}) => {
  if (!hero) return null;

  const classData = CLASSES[hero.classId];
  const accent = ROLE_ACCENT[classData?.role] || '#9ca3af';

  return (
    <div
      className="character-atmosphere w-[28%] min-w-[240px] flex-shrink-0 rounded-l-lg"
      style={{
        '--atmo-accent-strong': accent + '30',
        '--atmo-accent-mid': accent + '20',
        '--atmo-accent-subtle': accent + '10',
        '--atmo-accent-particle': accent,
      }}
    >
      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="atmo-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            '--particle-duration': `${p.duration}s`,
            '--particle-delay': `${p.delay}s`,
            '--particle-drift': p.drift,
          }}
        />
      ))}

      {/* Content above particles */}
      <div className="relative z-10 flex flex-col items-center gap-4 w-full px-3 py-4 h-full justify-center">
        {/* Hero name / class / level */}
        <div className="text-center">
          <h2
            className="text-white font-bold leading-tight text-2xl"
            style={{
              textShadow: `0 0 20px ${accent}80, 0 0 40px ${accent}40`,
            }}
          >
            {hero.name}
          </h2>
          <div className="text-gray-400 text-xs mt-0.5">
            Lv{hero.level} {classData?.name || hero.classId}
          </div>
        </div>

        {/* Paper doll with equipment slots */}
        <PaperDoll
          hero={hero}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
          onUnequip={onUnequip}
          role={classData?.role}
          compact={false}
        />
      </div>
    </div>
  );
};

export default CharacterTab;
