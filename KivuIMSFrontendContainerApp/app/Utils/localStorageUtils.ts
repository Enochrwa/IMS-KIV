import { LOCAL_STORAGE_KEYS, UNKNOWN } from "../Enums/localStorage";

/**
 *
 * @param key key to b saved in localStorage
 * @param value value to be saved in localStorage
 */
export const setLocalStorageElement = (
  key: LOCAL_STORAGE_KEYS,
  value?: string
) => {
  window.localStorage.setItem(key, value || UNKNOWN);
};

/**
 *
 * @param key => key to fetch item from localStorage
 */
export const getLocalStorageElement = (key: LOCAL_STORAGE_KEYS): string => {
  return window.localStorage.getItem(key) || "";
};
