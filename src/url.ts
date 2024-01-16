import {perkBinary} from './perkBinary';
import {LoadoutItems, Stars, StatNums} from './models';
import {getNewLoadoutItems, getNewStars, getNewStatNums} from './stores/initialState';
import {idsByItem} from './components/Loadout/idsByItem';
import {itemsById} from './components/Loadout/itemsById';
import {to64Parse, to64String} from './compressionUtils';
import {initialPerkStore, perkStore, PerkStore, useActivePerkIds} from './stores/perkStore';
import {initialStatsStore, statsStore, StatsStore, useStatNums} from './stores/statsStore';
import {initialStarsStore, starsStore, StarsStore, useStars} from './stores/starsStore';
import {initialLoadoutStore, loadoutStore, LoadoutStore, useLoadoutItems} from './stores/loadoutStore';
import {buildStore, BuildStore, initialBuildStore, useBuildName} from './stores/buildStore';

export const padString = (padding: string, strToPad: string, padLeft: boolean = true) => {
    if (typeof strToPad === 'undefined')
        return padding;
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
    return padString('0'.repeat(Object.keys(perkBinary).length), unpacked);
};

const compressPerks = (activePerksIds: string[]) => {
    Object.keys(perkBinary).forEach((perkId: string) => {
        (perkBinary as any)[perkId] = activePerksIds.includes(perkId) ? 1 : 0;
    });
    const valuesAsString = Object.values(perkBinary).join("");
    return packBinaryString(valuesAsString);
};

const uncompressPerks = (packedString: string) => {
    if (!packedString.length) {
        return [];
    }

    const binaryString = unpackBinaryString(packedString);

    let activePerkIds: string[] = [];
    binaryString.split('').forEach((str: string, index: number) => {
        if (str === "1") {
            activePerkIds.push(Object.keys(perkBinary)[index]);
        }
    });

    return activePerkIds;
};

const compressStats = (statNums: StatNums) => {
    return Object.values(statNums)
        .map(statNum => padString("000", statNum.toString()))
        .join("");
};

const uncompressStats = (packedString: string) => {
    let newStatNums = getNewStatNums();
    if (!packedString.length) {
        return newStatNums;
    }

    const statsArray = packedString.match(/.{1,3}/g)!.map(str => parseInt(str, 10));
    Object.keys(newStatNums).forEach((key: string, index: number) => {
        (newStatNums as any)[key] = statsArray[index];
    });

    return newStatNums;
};

const compressStars = (stars: Stars) => {
    return Object.values(stars)
        .join("");
};

const uncompressStars = (packedString: string) => {
    let newStars = getNewStars();
    if (!packedString.length) {
        return newStars;
    }

    const starsArray = packedString.match(/.{1}/g)!.map(str => parseInt(str, 10));
    Object.keys(newStars).forEach((key: string, index: number) => {
        (newStars as any)[key] = starsArray[index];
    });

    return newStars;
};

const compressLoadoutItems = (loadoutItems: LoadoutItems) => {
    return Object.values(loadoutItems).map(itemName => itemName === "" ? "AA" : idsByItem[itemName])
        .join("");
};

const uncompressLoadoutItems = (packedString: string) => {
    let newLoadoutItems = getNewLoadoutItems();
    if (!packedString.length) {
        return newLoadoutItems;
    }

    const loadoutItemsArray = packedString.match(/.{2}/g)!.map(itemId => itemId === "AA" ? "" : itemsById[itemId]);
    Object.keys(newLoadoutItems).forEach((key: string, index: number) => {
        (newLoadoutItems as any)[key] = loadoutItemsArray[index];
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

    const newUrl = `${window.location.pathname}?${params}`;
    if (shouldCreateHistoryEntry) {
        window.history.pushState({}, "", newUrl);
    } else {
        window.history.replaceState({}, "", newUrl);
    }

    return newUrl;
}

export interface StateToSaveToUrl extends
    Partial<Pick<PerkStore, 'activePerkIds'>>,
    Partial<Pick<StatsStore, 'statNums'>>,
    Partial<Pick<StarsStore, 'stars'>>,
    Partial<Pick<LoadoutStore, 'loadoutItems'>>,
    Partial<Pick<BuildStore, 'buildName'>>
{}

export const saveToURL = (partialState: StateToSaveToUrl, shouldCreateHistoryEntry?: boolean): string => {
    const params = new URLSearchParams();

    const {buildName} = buildStore.getState();
    const {activePerkIds} = perkStore.getState();
    const {statNums} = statsStore.getState();
    const {stars} = starsStore.getState();
    const {loadoutItems} = loadoutStore.getState();

    // Helper function to determine if a state part has changed, and if so to update the URL parameter
    const updateParam = (paramKey: string, currentValue: any, initialValue: any, compressFn: (val: any) => string) => {
        const compressedValue = compressFn(currentValue);
        const compressedInitialValue = compressFn(initialValue);

        if (compressedValue !== compressedInitialValue) {
            params.set(paramKey, compressedValue);
        }
    };

    // Update URL parameters based on the current and initial state values
    updateParam("name", partialState.buildName || buildName, initialBuildStore.buildName, (name) => name || '');
    updateParam("perks", partialState.activePerkIds || activePerkIds, initialPerkStore.activePerkIds, compressPerks);
    updateParam("stats", partialState.statNums || statNums, initialStatsStore.statNums, compressStats);
    updateParam("stars", partialState.stars || stars, initialStarsStore.stars, compressStars);
    updateParam("gear", partialState.loadoutItems || loadoutItems, initialLoadoutStore.loadoutItems, compressLoadoutItems);

    // Set history entry
    const newUrl = `${window.location.pathname}?${params}`;
    if (shouldCreateHistoryEntry) {
        window.history.pushState({}, "", newUrl);
    } else {
        window.history.replaceState({}, "", newUrl);
    }

    return newUrl;
};

export const loadFromURL = () => {
    const {setStudent, setPerks} = perkStore.getState().actions;
    const {setStatNums} = statsStore.getState().actions;
    const {setStars} = starsStore.getState().actions;
    const {setLoadoutItems} = loadoutStore.getState().actions;
    const {setBuildName, setBuildIdList} = buildStore.getState().actions;

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

    setBuildIdList(localStorage.getObject("bbplanner") || []);
};