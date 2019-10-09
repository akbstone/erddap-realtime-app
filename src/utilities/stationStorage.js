const MEMORY_KEY_PREFIX = '@StationFavoriteStorage_';

/** @class */
class FavoriteStorage {
    /**
     * This is used to set a specific item in storage
     */
    static setItem(key, value) {

        localStorage.setItem(`${MEMORY_KEY_PREFIX}${key}`, value);
        return value;
    }

    /**
     * This is used to get a specific key from storage
     */
    static getItem(key) {
        return localStorage.getItem(`${MEMORY_KEY_PREFIX}${key}`);
    }

    /**
     * This is used to remove an item from storage
     */
    static removeItem(key) {
        localStorage.removeItem(`${MEMORY_KEY_PREFIX}${key}`);
        return key;
    }
}

export default FavoriteStorage;