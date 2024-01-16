import { devtools } from "zustand/middleware";
import { useStore } from "zustand";
import {createStore} from "zustand/vanilla";
import {shallow} from 'zustand/shallow'
import {removeBuildFromStorage, updateStorageForCurrentBuild} from '../storage';
import {saveToURL} from '../url';

export interface BuildStore {
    buildName: string;
    buildIdList: string[];
    actions: {
        setBuildName: (buildName: string, withSave?: boolean) => void;
        setBuildIdList: (buildIdList: string[]) => void;
        removeBuild: (buildId: string) => void;
        saveBuild: () => void;
    }
}

export const initialBuildStore = {
    buildName: '',
    buildIdList: [],
}

export const buildStore = createStore<BuildStore>()(
    devtools(
        (set) => ({
            ...initialBuildStore,
            actions: {
                setBuildName: (buildName: string, withSave?: boolean) => set(state => {
                    const newState = {
                        buildName: buildName,
                    };

                    document.title = buildName ? buildName : "BB Planner";
                    if (withSave) {
                        saveToURL(newState);
                    }

                    return newState
                }),
                setBuildIdList: (buildIdList: string[]) => set({buildIdList}),
                removeBuild: (buildId: string) => set(state => {
                    const newBuildIdList = removeBuildFromStorage(buildId);
                    return {buildIdList: newBuildIdList};
                }),
                saveBuild: () => set(state => {
                    updateStorageForCurrentBuild(true);
                    return {buildIdList: localStorage.getObject("bbplanner") || []};
                }),
            }
        }),

        { name: "BuildStore", trace: true }
    )
);

export const useBuildName = () => useStore(buildStore, state => state.buildName);
export const useBuildIdList = () => useStore(buildStore, state => state.buildIdList, shallow);
export const useBuildActions = () => useStore(buildStore, state => state.actions)