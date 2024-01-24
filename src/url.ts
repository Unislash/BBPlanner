import { to64Parse, to64String } from "./compressionUtils";
import { perkBinary } from "./perkBinary";
import { idsByItem } from "./planner/components/Loadout/idsByItem";
import { itemsById } from "./planner/components/Loadout/itemsById";
import { buildStore, BuildStore, initialBuildStore } from "./planner/stores/buildStore";
import { getNewLoadoutItems, getNewStars, getNewStatNums } from "./planner/stores/initialState";
import { initialLoadoutStore, loadoutStore, LoadoutStore } from "./planner/stores/loadoutStore";
import { initialPerkStore, perkStore, PerkStore } from "./planner/stores/perkStore";
import { initialStarsStore, starsStore, StarsStore } from "./planner/stores/starsStore";
import { initialStatsStore, statsStore, StatsStore } from "./planner/stores/statsStore";
import { LoadoutItems, Stars, StatNums } from "./planner/types/models";
import { getLocalStorageObject } from "./storage";

export const padString = (padding: string, strToPad: string, padLeft = true) => {
    if (typeof strToPad === "undefined") return padding;
    if (padLeft) {
        return (padding + strToPad).slice(-padding.length);
    } else {
        return (strToPad + padding).substring(0, padding.length);
    }
};

const packBinaryString = (values: string) => {
    // console.log(parseInt(values, 2).toString(36));
    return to64String(parseInt(values, 2));
};

const unpackBinaryString = (packed: string): string => {
    // const unpacked = parseInt(packed, 36).toString(2);
    const unpacked = to64Parse(packed).toString(2);
    return padString("0".repeat(Object.keys(perkBinary).length), unpacked);
};

const compressPerks = (activePerksIds: string[]) => {
    Object.keys(perkBinary).forEach((perkId: string) => {
        perkBinary[perkId] = activePerksIds.includes(perkId) ? 1 : 0;
    });
    const valuesAsString = Object.values(perkBinary).join("");
    return packBinaryString(valuesAsString);
};

const uncompressPerks = (packedString: string) => {
    if (!packedString.length) {
        return [];
    }

    const binaryString = unpackBinaryString(packedString);

    const activePerkIds: string[] = [];
    binaryString.split("").forEach((str: string, index: number) => {
        if (str === "1") {
            activePerkIds.push(Object.keys(perkBinary)[index]);
        }
    });

    return activePerkIds;
};

const compressStats = (statNums: StatNums) => {
    return Object.values(statNums)
        .map((statNum) => padString("000", statNum.toString()))
        .join("");
};

const uncompressStats = (packedString: string) => {
    const newStatNums = getNewStatNums();
    if (!packedString.length) {
        return newStatNums;
    }

    const statsArray = packedString.match(/.{1,3}/g)!.map((str) => parseInt(str, 10));
    Object.keys(newStatNums).forEach((key: string, index: number) => {
        newStatNums[key] = statsArray[index];
    });

    return newStatNums;
};

const compressStars = (stars: Stars) => {
    return Object.values(stars).join("");
};

const uncompressStars = (packedString: string) => {
    const newStars = getNewStars();
    if (!packedString.length) {
        return newStars;
    }

    const starsArray = packedString.match(/.{1}/g)!.map((str) => parseInt(str, 10));
    Object.keys(newStars).forEach((key: string, index: number) => {
        newStars[key] = starsArray[index];
    });

    return newStars;
};

const compressLoadoutItems = (loadoutItems: LoadoutItems) => {
    return Object.values(loadoutItems)
        .map((itemName) => (itemName === "" ? "AA" : idsByItem[itemName]))
        .join("");
};

const uncompressLoadoutItems = (packedString: string) => {
    const newLoadoutItems = getNewLoadoutItems();
    if (!packedString.length) {
        return newLoadoutItems;
    }

    const loadoutItemsArray = packedString.match(/.{2}/g)!.map((itemId) => (itemId === "AA" ? "" : itemsById[itemId]));
    Object.keys(newLoadoutItems).forEach((key: string, index: number) => {
        newLoadoutItems[key] = loadoutItemsArray[index];
    });

    return newLoadoutItems;
};

const getQueryStringParameter = (name: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
};

export const resetURL = (shouldCreateHistoryEntry?: boolean): string => {
    const params = new URLSearchParams(window.location.search);
    params.delete("name");
    params.delete("perks");
    params.delete("stats");
    params.delete("stars");
    params.delete("gear");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    if (shouldCreateHistoryEntry) {
        window.history.pushState({}, "", newUrl);
    } else {
        window.history.replaceState({}, "", newUrl);
    }

    return newUrl;
};

export interface StateToSaveToUrl
    extends Partial<Pick<PerkStore, "activePerkIds">>,
        Partial<Pick<StatsStore, "statNums">>,
        Partial<Pick<StarsStore, "stars">>,
        Partial<Pick<LoadoutStore, "loadoutItems">>,
        Partial<Pick<BuildStore, "buildName">> {}

export const saveToURL = (partialState: StateToSaveToUrl, shouldCreateHistoryEntry?: boolean): string => {
    const params = new URLSearchParams();

    const { buildName } = buildStore.getState();
    const { activePerkIds } = perkStore.getState();
    const { statNums } = statsStore.getState();
    const { stars } = starsStore.getState();
    const { loadoutItems } = loadoutStore.getState();

    // Helper function to determine if a state part has changed, and if so to update the URL parameter
    const updateParam = (paramKey: string, currentValue: any, initialValue: any, compressFn: (val: any) => string) => {
        const compressedValue = compressFn(currentValue);
        const compressedInitialValue = compressFn(initialValue);

        if (compressedValue !== compressedInitialValue) {
            params.set(paramKey, compressedValue);
        }
    };

    // Update URL parameters based on the current and initial state values
    updateParam("name", partialState.buildName || buildName, initialBuildStore.buildName, (name: string) => name || "");
    updateParam("perks", partialState.activePerkIds || activePerkIds, initialPerkStore.activePerkIds, compressPerks);
    updateParam("stats", partialState.statNums || statNums, initialStatsStore.statNums, compressStats);
    updateParam("stars", partialState.stars || stars, initialStarsStore.stars, compressStars);
    updateParam(
        "gear",
        partialState.loadoutItems || loadoutItems,
        initialLoadoutStore.loadoutItems,
        compressLoadoutItems,
    );

    // Set history entry
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    if (shouldCreateHistoryEntry) {
        window.history.pushState({}, "", newUrl);
    } else {
        window.history.replaceState({}, "", newUrl);
    }

    return newUrl;
};

export const loadFromURL = () => {
    const { setStudent, setPerks } = perkStore.getState().actions;
    const { setStatNums } = statsStore.getState().actions;
    const { setStars } = starsStore.getState().actions;
    const { setLoadoutItems } = loadoutStore.getState().actions;
    const { setBuildName, setBuildIdList } = buildStore.getState().actions;

    const name = getQueryStringParameter("name");
    if (name) {
        setBuildName(name, false);
    } else {
        setBuildName("", false);
    }

    const compressedPerks = getQueryStringParameter("perks");
    if (compressedPerks) {
        const activePerkIds = uncompressPerks(compressedPerks);
        setPerks(activePerkIds);
        setStudent(activePerkIds.indexOf("student") !== -1);
    } else {
        setPerks([]);
        setStudent(false);
    }

    const compressedStats = getQueryStringParameter("stats");
    if (compressedStats) {
        setStatNums(uncompressStats(compressedStats));
    } else {
        setStatNums(getNewStatNums());
    }

    const compressedStars = getQueryStringParameter("stars");
    if (compressedStars) {
        setStars(uncompressStars(compressedStars));
    } else {
        setStars(getNewStars());
    }

    const compressedLoadoutItems = getQueryStringParameter("gear");
    if (compressedLoadoutItems) {
        setLoadoutItems(uncompressLoadoutItems(compressedLoadoutItems));
    } else {
        setLoadoutItems(getNewLoadoutItems());
    }

    setBuildIdList(getLocalStorageObject<string[]>("bbplanner") || []);
};
