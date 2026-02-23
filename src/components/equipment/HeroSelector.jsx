import { useState, useRef, useEffect, useCallback } from 'react';
import { calculateSkillPoints, calculateUsedSkillPoints } from '../../store/gameStore';
import HeroIcon from '../icons/HeroIcon';
import ClassIcon from '../icons/ClassIcon';

const HeroSelector = ({ heroes, selectedHeroId, onSelectHero, recruitSlot, onRecruit }) => {
  const [showRecruit, setShowRecruit] = useState(false);
  const [popoverLeft, setPopoverLeft] = useState(0);
  const wrapperRef = useRef(null);
  const recruitBtnRef = useRef(null);

  // Close recruit popover on outside click
  useEffect(() => {
    if (!showRecruit) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowRecruit(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showRecruit]);

  const handleToggleRecruit = useCallback(() => {
    setShowRecruit(v => {
      if (!v && recruitBtnRef.current && wrapperRef.current) {
        const btnRect = recruitBtnRef.current.getBoundingClientRect();
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        setPopoverLeft(btnRect.left - wrapperRect.left);
      }
      return !v;
    });
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Scrollable row: hero chips + recruit button inline */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 pt-2 pr-1">
        {heroes.filter(Boolean).map(hero => {
          const availSP = calculateSkillPoints(hero.level) - calculateUsedSkillPoints(hero);
          return (
            <button
              key={hero.id}
              onClick={() => onSelectHero(hero.id)}
              className={`relative flex items-center gap-1.5 px-2 py-1.5 rounded border whitespace-nowrap transition-colors
                ${hero.id === selectedHeroId
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}
            >
              {availSP > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] font-bold
                                w-5 h-5 rounded-full flex items-center justify-center
                                animate-pulse shadow-lg shadow-green-500/50">
                  +{availSP}
                </div>
              )}
              <HeroIcon classId={hero.classId} equipment={hero.equipment} size={24} />
              <div className="text-left">
                <div className="text-xs text-white font-medium leading-tight truncate max-w-[7ch]" title={hero.name}>{hero.name}</div>
                <div className="text-[10px] text-gray-500 leading-tight">Lv{hero.level}</div>
              </div>
            </button>
          );
        })}

        {/* Recruit button — inline with hero chips */}
        {recruitSlot && (
          <button
            ref={recruitBtnRef}
            onClick={handleToggleRecruit}
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded border border-dashed whitespace-nowrap transition-colors
              ${recruitSlot.canAfford
                ? 'border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400'
                : 'border-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            disabled={!recruitSlot.canAfford}
            title={recruitSlot.canAfford ? `Recruit ${recruitSlot.roleName}` : `Need ${recruitSlot.cost}g`}
          >
            <span className="text-lg leading-none">+</span>
            <span className="text-[10px]">{recruitSlot.roleName}</span>
            {recruitSlot.cost > 0 && (
              <span className="text-[10px] text-yellow-400">{recruitSlot.cost}g</span>
            )}
            {recruitSlot.cost === 0 && (
              <span className="text-[10px] text-green-400">FREE</span>
            )}
          </button>
        )}
      </div>

      {/* Class picker popover — positioned under the recruit button */}
      {showRecruit && recruitSlot && (
        <div
          className="absolute top-full mt-1 z-30 pixel-panel p-3 min-w-[200px]"
          style={{ left: `${popoverLeft}px` }}
        >
          <div className="text-xs text-gray-400 mb-2">
            Choose a class:
            {recruitSlot.isDungeon && (
              <span className="text-yellow-400 ml-1">(joins after dungeon)</span>
            )}
          </div>
          <div className={`grid gap-2 ${recruitSlot.classes.length > 3 ? 'grid-cols-5' : 'grid-cols-3'}`}>
            {recruitSlot.classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => {
                  onRecruit(cls.id, recruitSlot.index);
                  setShowRecruit(false);
                }}
                className="flex flex-col items-center gap-1 p-2 rounded bg-gray-900 hover:bg-gray-700 transition-colors"
                title={cls.description}
              >
                <ClassIcon classId={cls.id} size={28} />
                <div className="text-white text-[10px] text-center">{cls.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSelector;
