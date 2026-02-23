import ModalOverlay from './ModalOverlay';
import HeroProfileModal from './HeroProfileModal';
import HomesteadScreen from './HomesteadScreen';
import ShopScreen from './ShopScreen';
import DungeonMap from './DungeonMap';
import BestiaryScreen from './BestiaryScreen';
import EncyclopediaScreen from './EncyclopediaScreen';
import StatsScreen from './StatsScreen';
import RaidSelectorModal from './RaidSelectorModal';
import UniqueCollectionScreen from './UniqueCollectionScreen';
import AscensionModal from './AscensionModal';
import AchievementScreen from './AchievementScreen';

const isHeroModal = (modal) => modal === 'heroes' || modal === 'heroes-gear' || modal === 'heroes-skills';
const heroModalTab = (modal) => modal === 'heroes-skills' ? 'skills' : 'gear';

const ModalManager = ({ activeModal, onClose, onStartDungeon }) => {
  return (
    <>
      <ModalOverlay isOpen={isHeroModal(activeModal)} onClose={onClose} title="Hero Profile" size="full">
        <HeroProfileModal initialTab={heroModalTab(activeModal)} />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'homestead'} onClose={onClose} title="Homestead">
        <HomesteadScreen />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'shop'} onClose={onClose} title="Shop">
        <ShopScreen />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'bestiary'} onClose={onClose} title="Bestiary" size="lg">
        <BestiaryScreen />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'encyclopedia'} onClose={onClose} title="Encyclopedia" size="xl">
        <EncyclopediaScreen />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'stats'} onClose={onClose} title="Statistics" size="lg">
        <StatsScreen />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'dungeonSelect'} onClose={onClose} title="Dungeon Map" size="lg">
        <DungeonMap onStart={onStartDungeon} onClose={onClose} />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'raids'} onClose={onClose} title="Raids" size="lg">
        <RaidSelectorModal onClose={onClose} />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'collection'} onClose={onClose} title="Unique Collection" size="xl">
        <UniqueCollectionScreen />
      </ModalOverlay>

      <ModalOverlay isOpen={activeModal === 'achievements'} onClose={onClose} title="Achievements" size="lg">
        <AchievementScreen />
      </ModalOverlay>

      <AscensionModal
        isOpen={activeModal === 'ascension'}
        onClose={onClose}
      />
    </>
  );
};

export default ModalManager;
