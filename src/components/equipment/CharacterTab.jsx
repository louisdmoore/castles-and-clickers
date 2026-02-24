import { CLASSES } from '../../data/classes';
import PaperDoll from './PaperDoll';

const ROLE_ACCENT = { tank: '#60a5fa', healer: '#4ade80', dps: '#f87171' };

const CLASS_TITLE = {
  warrior:     { title: 'Warrior',     epithet: 'Ironclad Vanguard' },
  paladin:     { title: 'Paladin',     epithet: 'Oathbound Sentinel' },
  knight:      { title: 'Knight',      epithet: 'Bulwark of Steel' },
  mage:        { title: 'Mage',        epithet: 'Arcane Conduit' },
  rogue:       { title: 'Rogue',       epithet: 'Phantom Blade' },
  ranger:      { title: 'Ranger',      epithet: 'Deadeye Stalker' },
  necromancer: { title: 'Necromancer', epithet: 'Harbinger of Ruin' },
  cleric:      { title: 'Cleric',      epithet: 'Divine Shepherd' },
  druid:       { title: 'Druid',       epithet: 'Voice of the Wild' },
  shaman:      { title: 'Shaman',      epithet: 'Ancestral Conduit' },
};

const ROLE_LABEL = { tank: 'Tank', healer: 'Healer', dps: 'Damage' };

// 6 particle configs — staggered positions, sizes, speeds
const PARTICLES = [
  { left: '12%', bottom: '5%',  size: 3, duration: 7,  delay: 0,   drift: '8px' },
  { left: '45%', bottom: '0%',  size: 4, duration: 6,  delay: 0.5, drift: '5px' },
  { left: '78%', bottom: '20%', size: 3, duration: 7.5,delay: 1.8, drift: '15px' },
  { left: '8%',  bottom: '25%', size: 3, duration: 6.5,delay: 4.2, drift: '-10px' },
  { left: '55%', bottom: '30%', size: 3, duration: 5.5,delay: 2.2, drift: '-6px' },
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
      className="character-atmosphere w-[22%] min-w-[200px] flex-shrink-0 rounded-l-lg"
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
      <div className="relative z-10 flex flex-col items-center gap-2 w-full px-3 py-3 h-full justify-center">
        {/* Class identity */}
        <div className="text-center">
          {/* Role label above title */}
          <div
            className="text-[10px] uppercase tracking-[4px] font-medium mb-0.5"
            style={{ color: accent + 'aa' }}
          >
            {ROLE_LABEL[classData?.role] || ''}
          </div>

          {/* Class title */}
          <h2
            className="text-white font-bold leading-none text-2xl tracking-wider uppercase"
            style={{
              textShadow: `0 0 20px ${accent}90, 0 0 40px ${accent}50, 0 2px 4px rgba(0,0,0,0.9)`,
            }}
          >
            {CLASS_TITLE[hero.classId]?.title || classData?.name || hero.classId}
          </h2>

          {/* Level */}
          <div className="mt-1">
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: accent, textShadow: `0 0 12px ${accent}70` }}
            >
              Level {hero.level}
            </span>
          </div>
        </div>

        {/* Paper doll with equipment slots */}
        <PaperDoll
          hero={hero}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
          onUnequip={onUnequip}
          role={classData?.role}
          compact
        />
      </div>
    </div>
  );
};

export default CharacterTab;
