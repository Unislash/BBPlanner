import {AppState, AppStateWithURL} from './models';
import {loadFromURL} from './url';

Storage.prototype.setObject = function(key: string, value: Object) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key: string): Object | undefined {
    const value = this.getItem(key);
    return value && JSON.parse(value);
};

/**
 * Updates any existing state in storage.
 * If no existing entry is found in storage, no state will be saved unless `forceSave` is true.
 */
export const updateStorageForCurrentBuild = (appState: AppState, forceSave: boolean = true): boolean => {
    const stateToSave: AppStateWithURL = {
        ...appState,
        url: window.location.search,
    };
    const storage = localStorage.getObject(appState.buildName) as AppStateWithURL | undefined;
    const buildId = appState.buildName;

    if (forceSave) {
        localStorage.setObject(buildId, stateToSave);

        // Add buildId to list if it doesn't already exist
        let savedBuildIds = localStorage.getObject("bbplanner") as Array<string> | undefined || [];
        if (savedBuildIds.indexOf(buildId) === -1) {
            localStorage.setObject("bbplanner", [...savedBuildIds, buildId]);
        }

        return true;
    }

    if (storage) {
        localStorage.setObject(buildId, stateToSave);
        return true;
    }

    return false;
};

export const removeBuildFromStorage = (buildId: string): string[] => {
    let savedBuildIds = localStorage.getObject("bbplanner") as Array<string> | undefined || [];
    const index = savedBuildIds.indexOf(buildId);
    if (index > -1) {
        savedBuildIds.splice(index, 1);
    }
    localStorage.setObject("bbplanner", savedBuildIds);

    return savedBuildIds;
};

export const loadFromStorage = (buildName: string): boolean => {
    const storage = localStorage.getObject(buildName) as AppStateWithURL | undefined;
    if (storage) {
        window.history.pushState({}, "", storage.url);
        loadFromURL();
    }

    return !!storage;
};