import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const ModalOverlay = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus trap: Tab/Shift+Tab wrap within modal
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  // Auto-focus close button on open, restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Defer focus to after render
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Attach keydown listener
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-[95vw] sm:max-w-md',
    md: 'max-w-[95vw] sm:max-w-2xl',
    lg: 'max-w-[95vw] sm:max-w-4xl',
    xl: 'max-w-[95vw] sm:max-w-6xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - semi-transparent so dungeon is visible */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal - Pixel panel style */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative ${sizeClasses[size]} w-full mx-4 max-h-[85vh] flex flex-col pixel-panel`}
      >
        {/* Header with pixel styling */}
        <div className="flex items-center justify-between px-4 py-3 border-b-3 border-[var(--color-border)]"
             style={{ background: 'linear-gradient(180deg, #3a3a5a 0%, #2a2a4a 100%)' }}>
          <h2 id="modal-title" className="pixel-title">{title}</h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close"
            className="pixel-btn w-8 h-8 flex items-center justify-center text-xl leading-none p-0"
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;
