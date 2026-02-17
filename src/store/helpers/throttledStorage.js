// OPTIMIZATION: Throttled localStorage to prevent writes on every state change
// Only saves at most once every 2 seconds, reducing main thread blocking
const throttledStorage = (() => {
  let timeout = null;
  let pendingValue = null;
  let pendingName = null;
  const DELAY = 2000;

  // Save-state tracking
  let saveCallback = null;

  const notifySave = (success) => {
    if (saveCallback) saveCallback({ success, timestamp: Date.now() });
  };

  return {
    getItem: (name) => {
      try {
        return localStorage.getItem(name);
      } catch (e) {
        console.warn('localStorage.getItem failed:', e);
        return null;
      }
    },
    setItem: (name, value) => {
      pendingName = name;
      pendingValue = value;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          if (pendingValue !== null) {
            try {
              localStorage.setItem(pendingName, pendingValue);
              notifySave(true);
            } catch (e) {
              console.warn('localStorage.setItem failed:', e);
              notifySave(false);
            }
          }
        }, DELAY);
      }
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(name);
      } catch (e) {
        console.warn('localStorage.removeItem failed:', e);
      }
    },
    flush: () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      if (pendingValue !== null) {
        try {
          localStorage.setItem(pendingName, pendingValue);
          notifySave(true);
        } catch (e) {
          console.warn('localStorage flush failed:', e);
          notifySave(false);
        }
        pendingValue = null;
        pendingName = null;
      }
    },
    onSave: (cb) => { saveCallback = cb; },
  };
})();

// Flush pending save on tab close / navigation
window.addEventListener('beforeunload', () => throttledStorage.flush());

export default throttledStorage;
