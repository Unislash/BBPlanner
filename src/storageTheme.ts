import {ThemeId} from './models';

/**
 * Unfortunately there is some circular dependencies in the reducer/url/storage implementations.
 * Normally that doesn't really matter because things aren't immediately invoked... but because
 * we are using getThemeId() to get the initialState of the store in reducers.ts, that *is*
 * being immediately invoked.
 *
 * This is not only the easiest way to deal with the situation, but it is also the one that keeps
 * the most reasonable file organization imo.
 */

Storage.prototype.setObject = function(key: string, value: Object) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key: string): Object | undefined {
    const value = this.getItem(key);
    return value && JSON.parse(value);
};

export const saveThemeId = (themeId: ThemeId) => {
    localStorage.setObject("themeId", themeId);
}

export const getThemeId = () => {
    const storage = localStorage.getObject("themeId") as ThemeId | undefined;
    return storage || ThemeId.beastsAndExploration;
}