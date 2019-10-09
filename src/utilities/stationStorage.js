const MEMORY_KEY_PREFIX = '@StationFavoriteStorage_';

/** @class */
class FavoriteStorage {
    /**
     * This is used to set a specific item in storage
     */
    static setItem(key, value) {

        localStorage.setItem(`${MEMORY_KEY_PREFIX}${key}`, value);
        // localStorage.setItem(MEMORY_KEY_PREFIX,JSON.stringify({[key]: value}));
        return value;
    }

    /**
     * This is used to get a specific key from storage
     */
    static getItem(key) {

        return localStorage.getItem(`${MEMORY_KEY_PREFIX}${key}`);
        // return localStorage.getItem([MEMORY_KEY_PREFIX]) ? JSON.parse(localStorage.getItem([MEMORY_KEY_PREFIX]))[key] : undefined;
    }

    /**
     * This is used to remove an item from storage
     */
    static removeItem(key) {
        localStorage.removeItem(`${MEMORY_KEY_PREFIX}${key}`);

        // if (localStorage.getItem([MEMORY_KEY_PREFIX])) {
        //     let favorites = delete JSON.parse(localStorage.getItem([MEMORY_KEY_PREFIX]))[key];
        //     localStorage.setItem(MEMORY_KEY_PREFIX,JSON.stringify(favorites));
        // } 
        return key;
    }

    /**
     * This is used to clear the storage
     */
    static clear() {
        // favorites = {};
        // return favorites;
    }
}

export default FavoriteStorage;