import {LocalStorageBuildData} from './models';
import {loadFromURL} from './url';
import {buildStore} from './stores/buildStore';

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
export const updateStorageForCurrentBuild = (forceSave: boolean = false): boolean => {
    const stateToSave: LocalStorageBuildData = {
        url: window.location.search,
    };
    const buildId = buildStore.getState().buildName;
    const storage = localStorage.getObject(buildId) as LocalStorageBuildData | undefined;

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

export const saveBuildIdListToStorage = (buildIdList: string[]) => {
    localStorage.setObject("bbplanner", buildIdList);
}

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
    const storage = localStorage.getObject(buildName) as LocalStorageBuildData | undefined;
    if (storage) {
        window.history.pushState({}, "", storage.url);
        loadFromURL();
    }

    return !!storage;
};