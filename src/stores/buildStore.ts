import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createStore } from "zustand/vanilla";
import { getLocalStorageObject, removeBuildFromStorage, updateStorageForCurrentBuild } from "../storage";
import { saveToURL } from "../url";

export interface BuildStore {
    actions: {
        removeBuild: (buildId: string) => void;
        saveBuild: () => void;
        setBuildIdList: (buildIdList: string[]) => void;
        setBuildName: (buildName: string, withSave?: boolean) => void;
    };
    buildIdList: string[];
    buildName: string;
}

export const initialBuildStore = {
    buildName: "",
    buildIdList: [],
};

export const buildStore = createStore<BuildStore>()(
    devtools(
        (set) => ({
            ...initialBuildStore,
            actions: {
                setBuildName: (buildName: string, withSave?: boolean) =>
                    set(() => {
                        const newState = {
                            buildName: buildName,
                        };

                        document.title = buildName ? buildName : "BB Planner";
                        if (withSave) {
                            saveToURL(newState);
                        }

                        return newState;
                    }),
                setBuildIdList: (buildIdList: string[]) => set({ buildIdList }),
                removeBuild: (buildId: string) =>
                    set(() => {
                        const newBuildIdList = removeBuildFromStorage(buildId);
                        return { buildIdList: newBuildIdList };
                    }),
                saveBuild: () =>
                    set(() => {
                        updateStorageForCurrentBuild(true);
                        return { buildIdList: getLocalStorageObject<string[]>("bbplanner") || [] };
                    }),
            },
        }),

        { name: "BuildStore", trace: true },
    ),
);

export const useBuildName = () => useStore(buildStore, (state) => state.buildName);
export const useBuildIdList = () => useStore(buildStore, (state) => state.buildIdList, shallow);
export const useBuildActions = () => useStore(buildStore, (state) => state.actions);
