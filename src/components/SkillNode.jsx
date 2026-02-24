import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { SKILL_TYPE } from '../data/skillTrees';
import { SkillIcon } from './icons/skills';
import { StarIcon } from './icons/ui';

const SkillNode = ({ skill, tier, isUnlocked, isAvailable, onUnlock, canAfford }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [touchActive, setTouchActive] = useState(false); // tracks if tooltip was shown by touch
  const nodeRef = useRef(null);

  const isActive = skill.type === SKILL_TYPE.ACTIVE;
  const isStarter = skill.starterSkill;

  // Determine node state and styling
  let bgColor, borderColor, textColor, ringColor;
  if (isUnlocked) {
    bgColor = 'bg-yellow-500/20';
    borderColor = 'border-yellow-400';
    textColor = 'text-yellow-400';
    ringColor = 'ring-yellow-400/30';
  } else if (isAvailable && canAfford) {
    bgColor = 'bg-blue-500/20';
    borderColor = 'border-blue-400';
    textColor = 'text-blue-400';
    ringColor = 'ring-blue-400/30';
  } else if (isAvailable && !canAfford) {
    bgColor = 'bg-blue-500/10';
    borderColor = 'border-blue-400/50';
    textColor = 'text-blue-400/50';
    ringColor = '';
  } else {
    bgColor = 'bg-gray-800/50';
    borderColor = 'border-gray-600';
    textColor = 'text-gray-500';
    ringColor = '';
  }

  const sizeClass = tier === 3 ? 'w-[4.5rem] h-[4.5rem]' : 'w-16 h-16';
  const iconSize = tier === 3 ? 36 : 32;

  // Build aria-label describing the skill state
  const statusLabel = isUnlocked ? 'Unlocked' : isAvailable && canAfford ? 'Available' : isAvailable ? 'No skill points' : 'Locked';
  const tierLabel = tier === 3 ? 'Capstone' : `Tier ${tier}`;
  const ariaLabel = `${skill.name} - ${tierLabel} - ${statusLabel}`;

  const animClass = isUnlocked
    ? tier === 3 ? 'skill-capstone-glow' : 'skill-unlocked'
    : isAvailable && canAfford ? 'skill-available-breathe' : '';

  const activeClass = isUnlocked && skill.type === SKILL_TYPE.ACTIVE ? 'skill-active-pulse' : '';

  const handleClick = useCallback(() => {
    // On touch devices: first tap shows tooltip, second tap unlocks
    if (touchActive) {
      // Tooltip is already showing from touch - this is the second tap
      if (isAvailable && !isUnlocked && canAfford) {
        onUnlock(skill.id);
        setJustUnlocked(true);
        setTimeout(() => setJustUnlocked(false), 300);
      }
      setTouchActive(false);
      return;
    }

    // Desktop click (no prior touch) - unlock directly
    if (isAvailable && !isUnlocked && canAfford) {
      onUnlock(skill.id);
      setJustUnlocked(true);
      setTimeout(() => setJustUnlocked(false), 300);
    }
  }, [touchActive, isAvailable, isUnlocked, canAfford, onUnlock, skill.id]);

  // Touch handling: first tap shows tooltip
  const handleTouchEnd = useCallback((e) => {
    if (!showTooltip) {
      // First tap: show tooltip, prevent click
      e.preventDefault();
      setShowTooltip(true);
      setTouchActive(true);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setShowTooltip(false);
        setTouchActive(false);
      }, 4000);
    }
    // If tooltip already shown, let the click handler fire (second tap)
  }, [showTooltip]);

  // Format effect description
  const getEffectDescription = () => {
    if (skill.type === SKILL_TYPE.PASSIVE && skill.passive) {
      return skill.description;
    }
    if (skill.type === SKILL_TYPE.ACTIVE && skill.effect) {
      return `${skill.description} (${skill.cooldown} turn CD)`;
    }
    return skill.description;
  };

  const getTooltipPosition = useCallback(() => {
    if (!nodeRef.current) return { top: 0, left: 0 };
    const rect = nodeRef.current.getBoundingClientRect();
    const tooltipWidth = 224; // w-56 = 14rem = 224px
    const gap = 8;

    // Horizontal: center on node, clamp to viewport
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));

    // Vertical: below for tier 0-1, above for tier 2-3
    let top;
    if (tier >= 2) {
      top = rect.top - gap; // positioned above, bottom-anchored via CSS
    } else {
      top = rect.bottom + gap;
    }

    return { top, left };
  }, [tier]);

  return (
    <div
      ref={nodeRef}
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => { setShowTooltip(false); setTouchActive(false); }}
      style={{ touchAction: 'manipulation' }}
    >
      <button
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => { setShowTooltip(false); setTouchActive(false); }}
        disabled={isUnlocked || !isAvailable || !canAfford}
        aria-label={ariaLabel}
        className={`
          ${sizeClass} rounded-lg border-2 flex flex-col items-center justify-center
          transition-all duration-200 relative
          ${bgColor} ${borderColor}
          ${isAvailable && !isUnlocked && canAfford ? 'hover:scale-110 hover:ring-2 cursor-pointer' : ''}
          ${ringColor}
          ${isUnlocked ? 'ring-2' : ''}
          ${animClass} ${activeClass}
          ${justUnlocked ? 'animate-skill-activation' : ''}
        `}
      >
        <SkillIcon skillId={skill.id} size={iconSize} />
        {isActive && (
          <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-black/50 shadow-sm
            ${isUnlocked ? 'bg-yellow-500 text-black' : isAvailable ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
            A
          </div>
        )}
        {isStarter && isUnlocked && (
          <div className="absolute -bottom-1 -right-1">
            <StarIcon size={12} />
          </div>
        )}
      </button>

      {/* Tooltip — rendered via portal to escape overflow containers */}
      {showTooltip && createPortal(
        (() => {
          const pos = getTooltipPosition();
          return (
            <div
              className="fixed z-[9999] w-56 pointer-events-none"
              style={{
                left: pos.left,
                ...(tier >= 2
                  ? { top: 0, transform: `translateY(${pos.top}px) translateY(-100%)` }
                  : { top: pos.top }),
              }}
            >
              <div className="pixel-panel-dark p-3 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <SkillIcon skillId={skill.id} size={24} />
                  <span className={`font-bold ${textColor}`}>{skill.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {isActive ? 'Active' : 'Passive'}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-2">{getEffectDescription()}</p>

                {isActive && (
                  <div className="text-xs text-gray-400 flex gap-3">
                    <span>Cooldown: {skill.cooldown}</span>
                    <span>Target: {skill.targetType?.replace(/_/g, ' ')}</span>
                  </div>
                )}

                {skill.tier !== undefined && (
                  <div className="text-xs text-gray-500 mt-2 border-t border-gray-700 pt-2">
                    {skill.tier === 3 ? 'Capstone Skill' : `Tier ${skill.tier}`}
                  </div>
                )}

                {/* Status message */}
                <div className={`text-xs mt-2 font-medium ${
                  isUnlocked ? 'text-yellow-400' :
                  isAvailable && canAfford ? 'text-green-400' :
                  isAvailable && !canAfford ? 'text-orange-400' :
                  'text-gray-500'
                }`}>
                  {isUnlocked && 'Unlocked'}
                  {!isUnlocked && isAvailable && canAfford && (touchActive ? 'Tap again to unlock' : 'Click to unlock')}
                  {!isUnlocked && isAvailable && !canAfford && 'No skill points'}
                  {!isUnlocked && !isAvailable && 'Locked - unlock prerequisites'}
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </div>
  );
};

export default SkillNode;
