import { buildStore } from "./planner/stores/buildStore";
import type { LocalStorageBuildData } from "./planner/types/models";
import { loadFromURL } from "./url";

export const setLocalStorageObject = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorageObject = (key: string) => {
    localStorage.removeItem(key);
};

export const getLocalStorageObject = <T = unknown>(key: string): T | undefined => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
};

/**
 * Updates any existing state in storage.
 * If no existing entry is found in storage, no state will be saved unless `forceSave` is true.
 */
export const updateStorageForCurrentBuild = (forceSave = false): boolean => {
    const stateToSave: LocalStorageBuildData = {
        url: window.location.search,
    };
    const buildId = buildStore.getState().buildName;
    const storage = getLocalStorageObject<LocalStorageBuildData>(buildId);

    if (forceSave) {
        setLocalStorageObject(buildId, stateToSave);

        // Add buildId to list if it doesn't already exist
        const savedBuildIds = getLocalStorageObject<string[]>("bbplanner") || [];
        if (savedBuildIds.indexOf(buildId) === -1) {
            setLocalStorageObject("bbplanner", [...savedBuildIds, buildId]);
        }

        return true;
    }

    if (storage) {
        setLocalStorageObject(buildId, stateToSave);
        return true;
    }

    return false;
};

export const saveBuildIdListToStorage = (buildIdList: string[]) => {
    setLocalStorageObject("bbplanner", buildIdList);
};

export const removeBuildFromStorage = (buildId: string): string[] => {
    const savedBuildIds = getLocalStorageObject<string[]>("bbplanner") || [];
    const index = savedBuildIds.indexOf(buildId);
    if (index > -1) {
        savedBuildIds.splice(index, 1);
    }
    setLocalStorageObject("bbplanner", savedBuildIds);

    return savedBuildIds;
};

export const loadFromStorage = (buildName: string): boolean => {
    const storage = getLocalStorageObject<LocalStorageBuildData>(buildName);
    if (storage) {
        window.history.pushState({}, "", storage.url);
        loadFromURL();
    }

    return !!storage;
};
