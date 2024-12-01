/**
 * Chrome storage API wrapper for simplified interactions
 *
 * @example
 *
 * // Create a storage instance
 * const store = new ChromeStore();
 * await store.set('user-preferences', { theme: 'dark', fontSize: 14 });
 * const prefs = await store.get('user-preferences');
 * await store.remove('user-preferences');
 *
 */
class ChromeStore {
  /**
   * Creates a new ChromeStore instance
   */
  constructor() {
    if (!chrome?.storage?.local) {
      throw new Error("Chrome storage API not available");
    }
  }

  /**
   * Gets a value from storage
   * @param {string} key - Key to retrieve
   * @returns {Promise<any>} Stored value
   */
  async get(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  }

  /**
   * Sets a value in storage
   * @param {string} key - Key to set
   * @param {any} value - Value to store
   * @returns {Promise<void>}
   */
  async set(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }

  /**
   * Removes a value from storage
   * @param {string} key - Key to remove
   * @returns {Promise<void>}
   */
  async remove(key) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, resolve);
    });
  }

  /**
   * Clears all stored data
   * @returns {Promise<void>}
   */
  async clear() {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  }
}

export const store = new ChromeStore();
