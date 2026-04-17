import {
    getLocalStorageObject,
    removeLocalStorageObject,
    setLocalStorageObject,
    updateStorageForCurrentBuild,
} from "../../storage";
import { saveToURL } from "../../url";
import { buildStore } from "./buildStore";
import { loadoutStore } from "./loadoutStore";
import { perkStore } from "./perkStore";
import { starsStore } from "./starsStore";
import { statsStore } from "./statsStore";
import type { LocalStorageBuildData } from "../types/models";

export interface PlannerSnapshot {
    activePerkIds: string[];
    buildName: string;
    buildIdList: string[];
    isStudent: boolean;
    loadoutItems: Record<string, string>;
    savedBuilds: Record<string, LocalStorageBuildData>;
    stars: Record<string, number>;
    statNums: Record<string, number>;
}

let historySnapshots: PlannerSnapshot[] = [];
let historyIndex = -1;
let isApplyingSnapshot = false;
let isTrackingStarted = false;
let isCommitScheduled = false;

const cloneSnapshot = (snapshot: PlannerSnapshot): PlannerSnapshot => ({
    activePerkIds: [...snapshot.activePerkIds],
    buildName: snapshot.buildName,
    buildIdList: [...snapshot.buildIdList],
    isStudent: snapshot.isStudent,
    loadoutItems: { ...snapshot.loadoutItems },
    savedBuilds: Object.fromEntries(
        Object.entries(snapshot.savedBuilds).map(([buildId, buildData]) => [buildId, { ...buildData }]),
    ),
    stars: { ...snapshot.stars },
    statNums: { ...snapshot.statNums },
});

const getSavedBuildsSnapshot = (buildIdList: string[], buildName: string): Record<string, LocalStorageBuildData> => {
    const trackedBuildIds = new Set(buildIdList);
    const currentBuildStorage = buildName ? getLocalStorageObject<LocalStorageBuildData>(buildName) : undefined;
    if (buildName && currentBuildStorage) {
        trackedBuildIds.add(buildName);
    }

    return [...trackedBuildIds].reduce<Record<string, LocalStorageBuildData>>((savedBuilds, buildId) => {
        const buildData = getLocalStorageObject<LocalStorageBuildData>(buildId);
        if (buildData) {
            savedBuilds[buildId] = { ...buildData };
        }
        return savedBuilds;
    }, {});
};

const getCurrentSnapshot = (): PlannerSnapshot => {
    const { buildIdList, buildName } = buildStore.getState();
    const { activePerkIds, isStudent } = perkStore.getState();
    const { statNums } = statsStore.getState();
    const { stars } = starsStore.getState();
    const { loadoutItems } = loadoutStore.getState();

    return {
        activePerkIds: [...activePerkIds],
        buildName,
        buildIdList: [...buildIdList],
        isStudent,
        loadoutItems: { ...loadoutItems },
        savedBuilds: getSavedBuildsSnapshot(buildIdList, buildName),
        stars: { ...stars },
        statNums: { ...statNums },
    };
};

const areSnapshotsEqual = (left: PlannerSnapshot | undefined, right: PlannerSnapshot | undefined): boolean => {
    return JSON.stringify(left) === JSON.stringify(right);
};

const applySnapshot = (snapshot: PlannerSnapshot) => {
    isApplyingSnapshot = true;

    const currentSnapshot = getCurrentSnapshot();
    const trackedBuildIds = new Set([
        ...Object.keys(currentSnapshot.savedBuilds),
        ...Object.keys(snapshot.savedBuilds),
        ...currentSnapshot.buildIdList,
        ...snapshot.buildIdList,
    ]);

    trackedBuildIds.forEach((buildId) => {
        const savedBuildData = snapshot.savedBuilds[buildId];
        if (savedBuildData) {
            setLocalStorageObject(buildId, savedBuildData);
        } else {
            removeLocalStorageObject(buildId);
        }
    });

    const { setBuildIdList, setBuildName } = buildStore.getState().actions;
    const { setPerks, setStudent } = perkStore.getState().actions;
    const { setStatNums } = statsStore.getState().actions;
    const { setStars } = starsStore.getState().actions;
    const { setLoadoutItems } = loadoutStore.getState().actions;

    setBuildIdList([...snapshot.buildIdList]);
    setPerks([...snapshot.activePerkIds]);
    setStudent(snapshot.isStudent);
    setBuildName(snapshot.buildName, false);
    setStatNums({ ...snapshot.statNums });
    setStars({ ...snapshot.stars });
    setLoadoutItems({ ...snapshot.loadoutItems });

    saveToURL({
        activePerkIds: snapshot.activePerkIds,
        buildName: snapshot.buildName,
        loadoutItems: snapshot.loadoutItems,
        stars: snapshot.stars,
        statNums: snapshot.statNums,
    });
    updateStorageForCurrentBuild();

    isApplyingSnapshot = false;
};

const commitCurrentSnapshot = () => {
    if (isApplyingSnapshot) {
        return;
    }

    const snapshot = getCurrentSnapshot();
    const currentSnapshot = historySnapshots[historyIndex];
    if (areSnapshotsEqual(currentSnapshot, snapshot)) {
        return;
    }

    historySnapshots = historySnapshots.slice(0, historyIndex + 1);
    historySnapshots.push(cloneSnapshot(snapshot));
    historyIndex = historySnapshots.length - 1;
};

const scheduleCommit = () => {
    if (isApplyingSnapshot || isCommitScheduled) {
        return;
    }

    isCommitScheduled = true;
    queueMicrotask(() => {
        isCommitScheduled = false;
        commitCurrentSnapshot();
    });
};

export const initializePlannerHistory = () => {
    historySnapshots = [cloneSnapshot(getCurrentSnapshot())];
    historyIndex = 0;
};

export const syncPlannerHistoryToCurrentState = () => {
    initializePlannerHistory();
};

export const startPlannerHistoryTracking = () => {
    if (isTrackingStarted) {
        return;
    }

    isTrackingStarted = true;

    buildStore.subscribe(scheduleCommit);
    perkStore.subscribe(scheduleCommit);
    statsStore.subscribe(scheduleCommit);
    starsStore.subscribe(scheduleCommit);
    loadoutStore.subscribe(scheduleCommit);
};

export const canUndoPlannerHistory = () => historyIndex > 0;

export const canRedoPlannerHistory = () => historyIndex > -1 && historyIndex < historySnapshots.length - 1;

export const undoPlannerHistory = () => {
    if (!canUndoPlannerHistory()) {
        return false;
    }

    historyIndex -= 1;
    applySnapshot(historySnapshots[historyIndex]);
    return true;
};

export const redoPlannerHistory = () => {
    if (!canRedoPlannerHistory()) {
        return false;
    }

    historyIndex += 1;
    applySnapshot(historySnapshots[historyIndex]);
    return true;
};
