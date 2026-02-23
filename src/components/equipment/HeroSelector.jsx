import HeroIcon from '../icons/HeroIcon';

const HeroSelector = ({ heroes, selectedHeroId, onSelectHero }) => {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {heroes.filter(Boolean).map(hero => (
        <button
          key={hero.id}
          onClick={() => onSelectHero(hero.id)}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded border whitespace-nowrap transition-colors
            ${hero.id === selectedHeroId
              ? 'border-yellow-400 bg-yellow-400/10'
              : 'border-gray-700 bg-gray-900 hover:border-gray-500'
            }`}
        >
          <HeroIcon classId={hero.classId} equipment={hero.equipment} size={24} />
          <div className="text-left">
            <div className="text-xs text-white font-medium leading-tight truncate max-w-[7ch]" title={hero.name}>{hero.name}</div>
            <div className="text-[10px] text-gray-500 leading-tight">Lv{hero.level}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HeroSelector;
