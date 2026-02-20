import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { WarningIcon, CheckIcon, ScrollIcon } from '../icons/ui';

const TOAST_COLORS = {
  error: '#ef4444',
  warning: '#eab308',
  success: '#22c55e',
  info: '#3b82f6',
};

const TOAST_ICONS = {
  error: WarningIcon,
  warning: WarningIcon,
  success: CheckIcon,
  info: ScrollIcon,
};

const Toast = ({ toast, onDismiss }) => {
  const Icon = TOAST_ICONS[toast.type] || ScrollIcon;
  const borderColor = TOAST_COLORS[toast.type] || TOAST_COLORS.info;

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="bg-gray-900/95 backdrop-blur-sm rounded-lg p-2.5 min-w-48 max-w-72
                 border-l-4 shadow-lg animate-slide-in pointer-events-auto cursor-pointer
                 hover:bg-gray-800/95 transition-colors"
      style={{ borderLeftColor: borderColor }}
      onClick={onDismiss}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span className="text-sm">{toast.message}</span>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useGameStore(state => state.toasts);
  const removeToast = useCallback(
    (id) => useGameStore.getState().removeToast(id),
    []
  );

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-12 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
