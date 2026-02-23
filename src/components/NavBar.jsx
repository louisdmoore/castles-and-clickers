import { useMemo, useState, useEffect, useRef } from 'react';
import { useGameStore, calculateSkillPoints, calculateUsedSkillPoints } from '../store/gameStore';
import { PartyIcon, HomeIcon, ChestIcon, CrownIcon, SkullIcon, ChartIcon, StarIcon, BookIcon, TrophyIcon } from './icons/ui';
import { PARTY_SLOTS } from '../data/classes';
import { getAllRaids } from '../data/raids';

const CORE_IDS = ['heroes', 'shop', 'homestead', 'raids', 'collection'];

const NavButton = ({ id, Icon, label, badge, isActive, isLocked, unlockAt, onClick }) => {
  return (
    <button
      onClick={() => !isLocked && onClick(id)}
      disabled={isLocked}
      aria-disabled={isLocked || undefined}
      aria-current={isActive ? 'page' : undefined}
      className={`pixel-btn relative flex items-center gap-1 px-1 sm:px-1.5 py-1 ${
        isActive ? 'pixel-btn-primary' : ''
      } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isLocked ? `Unlocks at Dungeon ${unlockAt}` : undefined}
    >
      <Icon size={16} />
      <span className="text-[10px] md:text-xs">{label}</span>
      {badge && (
        <span className={`pixel-badge absolute -top-1.5 -right-1.5 text-[10px] ${
          badge === 'NEW' ? 'animate-pixel-blink' : ''
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
};

const NavBar = ({ activeModal, onOpenModal }) => {
  const heroes = useGameStore(state => state.heroes);
  const gold = useGameStore(state => state.gold);
  const highestDungeonCleared = useGameStore(state => state.highestDungeonCleared);
  const featureUnlocks = useGameStore(state => state.featureUnlocks);
  const unreadUniques = useGameStore(state => state.unreadUniques || []);
  const maxPartySize = useGameStore(state => state.maxPartySize);
  const usedSlotDiscounts = useGameStore(state => state.usedSlotDiscounts);
  const raidState = useGameStore(state => state.raidState);

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  // Close overflow dropdown on outside click
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  // Calculate skill points badge
  const totalAvailableSkillPoints = useMemo(() => {
    return heroes.filter(Boolean).reduce((sum, hero) => {
      const total = calculateSkillPoints(hero.level);
      const used = calculateUsedSkillPoints(hero);
      return sum + (total - used);
    }, 0);
  }, [heroes]);

  // Check if a hero slot is available for recruitment
  const canRecruitHero = useMemo(() => {
    const BASE_RECRUIT_COSTS = { tank: 100, healer: 150, dps: 200 };

    let emptySlotIndex = -1;
    for (let i = 0; i < maxPartySize && i < PARTY_SLOTS.length; i++) {
      if (!heroes[i]) {
        emptySlotIndex = i;
        break;
      }
    }
    if (emptySlotIndex === -1 || emptySlotIndex >= maxPartySize) return false;
    const slot = PARTY_SLOTS[emptySlotIndex];
    if (!slot) return false;

    const discountUsed = usedSlotDiscounts.includes(emptySlotIndex);
    const recruitCost = discountUsed
      ? BASE_RECRUIT_COSTS[slot.role] || 150
      : slot.cost;

    return gold >= recruitCost;
  }, [heroes, maxPartySize, gold, usedSlotDiscounts]);

  // Check if homestead is newly available
  const homesteadNewlyAvailable = highestDungeonCleared >= 3 && !featureUnlocks?.homesteadSeen;

  // Check if there's a newly unlocked raid the player hasn't seen yet
  const lastSeenRaidsAt = featureUnlocks?.lastSeenRaidsAt || 0;
  const hasNewRaidUnlocked = useMemo(() => {
    const allRaids = getAllRaids();
    return allRaids.some(raid =>
      raid.requiredLevel > lastSeenRaidsAt && raid.requiredLevel <= highestDungeonCleared
    );
  }, [lastSeenRaidsAt, highestDungeonCleared]);

  const navButtons = [
    {
      id: 'heroes',
      Icon: PartyIcon,
      label: 'Heroes',
      badge: totalAvailableSkillPoints > 0 ? totalAvailableSkillPoints
           : canRecruitHero ? '!'
           : unreadUniques.length > 0 ? 'NEW'
           : null,
    },
    {
      id: 'shop',
      Icon: ChestIcon,
      label: 'Shop',
      badge: null,
      unlockAt: 5,
    },
    {
      id: 'homestead',
      Icon: HomeIcon,
      label: 'Home',
      badge: homesteadNewlyAvailable ? 'NEW' : null,
      unlockAt: 3,
    },
    {
      id: 'raids',
      Icon: CrownIcon,
      label: 'Raids',
      badge: hasNewRaidUnlocked ? 'NEW' : null,
      unlockAt: 12,
    },
    {
      id: 'collection',
      Icon: StarIcon,
      label: 'Uniques',
      badge: null,
      unlockAt: 12,
    },
    {
      id: 'bestiary',
      Icon: SkullIcon,
      label: 'Bestiary',
      badge: null,
      unlockAt: 3,
    },
    {
      id: 'achievements',
      Icon: TrophyIcon,
      label: 'Achieve',
      badge: null,
      unlockAt: 5,
    },
    {
      id: 'stats',
      Icon: ChartIcon,
      label: 'Stats',
      badge: null,
      unlockAt: 5,
    },
    {
      id: 'encyclopedia',
      Icon: BookIcon,
      label: 'Help',
      badge: null,
    },
  ];

  const coreButtons = navButtons.filter(b => CORE_IDS.includes(b.id));
  const overflowButtons = navButtons.filter(b => !CORE_IDS.includes(b.id));

  // Aggregate badge: show a dot on "More" if any overflow button has a badge
  const overflowHasBadge = overflowButtons.some(b => b.badge);

  const handleOverflowClick = (id) => {
    onOpenModal(id);
    setMoreOpen(false);
  };

  return (
    <nav className="flex items-center gap-1 flex-wrap" aria-label="Main navigation">
      {coreButtons.map(btn => {
        const isLocked = btn.unlockAt && highestDungeonCleared < btn.unlockAt;
        return (
          <NavButton
            key={btn.id}
            id={btn.id}
            Icon={btn.Icon}
            label={btn.label}
            badge={btn.badge}
            isActive={activeModal === btn.id || (btn.id === 'heroes' && activeModal?.startsWith('heroes-'))}
            isLocked={isLocked}
            unlockAt={btn.unlockAt}
            onClick={onOpenModal}
          />
        );
      })}

      {/* More dropdown */}
      <div className="relative" ref={moreRef}>
        <button
          onClick={() => setMoreOpen(prev => !prev)}
          className={`pixel-btn relative flex items-center gap-1 px-1 sm:px-1.5 py-1 ${
            overflowButtons.some(b => activeModal === b.id) ? 'pixel-btn-primary' : ''
          }`}
          aria-expanded={moreOpen}
          aria-label="More navigation options"
        >
          <span className="text-[10px] md:text-xs">More</span>
          <span className="text-[8px]">{moreOpen ? '\u25B2' : '\u25BC'}</span>
          {overflowHasBadge && (
            <span className="pixel-badge absolute -top-1.5 -right-1.5 text-[10px] animate-pixel-blink">
              !
            </span>
          )}
        </button>
        {moreOpen && (
          <div className="absolute top-full right-0 mt-1 pixel-panel p-2 z-50 grid grid-cols-2 gap-1 min-w-[200px]">
            {overflowButtons.map(btn => {
              const isLocked = btn.unlockAt && highestDungeonCleared < btn.unlockAt;
              return (
                <NavButton
                  key={btn.id}
                  id={btn.id}
                  Icon={btn.Icon}
                  label={btn.label}
                  badge={btn.badge}
                  isActive={activeModal === btn.id}
                  isLocked={isLocked}
                  unlockAt={btn.unlockAt}
                  onClick={handleOverflowClick}
                />
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
