export function useStorage(key, defaultValue) {
  const get = () => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? v : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const set = (v) => {
    try {
      localStorage.setItem(key, v);
    } catch (e) {
      // ignore
    }
  };

  return { get, set };
}