import {perkBinary} from './perkBinary';
import {store} from './createStore';
import {
    setBuildIdList,
    setBuildName,
    setLoadoutItems,
    setPerks,
    setStars,
    setStatNums,
    setStudent,
} from './actions';
import {AppState, LoadoutItems, Stars, StatNums} from './models';
import {getNewLoadoutItems, getNewStars, getNewStatNums, initialState} from './initialState';
import {idsByItem} from './components/Loadout/idsByItem';
import {itemsById} from './components/Loadout/itemsById';

export const padString = (padding: string, strToPad: string, padLeft: boolean = true) => {
    if (typeof strToPad === 'undefined')
        return padding;
    if (padLeft) {
        return (padding + strToPad).slice(-padding.length);
    } else {
        return (strToPad + padding).substring(0, padding.length);
    }
};

export const STR64: Array<string> = ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/').split( '' );

const to64String = ( input: number, current: string = '' ): string => {
    if ( input < 0 && current.length == 0 ){
        input = input * - 1;
    }
    var modify: number = input % 64;
    var remain: number = Math.floor( input / 64 );
    var result: string = STR64[ modify ] + current;
    return ( remain <= 0 ) ? result : to64String( remain, result );
};

const to64Parse =( input: string ): number => {
    let result: number = 0;
    const toProc: Array<string> = input.split( '' );
    for ( let e in toProc ){
        result = ( result * 64 ) + STR64.indexOf( toProc[ e ] );
    }
    return result;
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

export const saveToURL = (state: AppState, shouldCreateHistoryEntry?: boolean): string => {
    const params = new URLSearchParams(window.location.search);

    const compressedPerks = compressPerks(state.activePerkIds);
    const compressedStats = compressStats(state.statNums);
    const compressedStars = compressStars(state.stars);
    const compressedLoadoutItems = compressLoadoutItems(state.loadoutItems);
    const compressedInitialPerks = compressPerks(initialState.activePerkIds);
    const compressedInitialStats = compressStats(initialState.statNums);
    const compressedInitialStars = compressStars(initialState.stars);
    const compressedInitialLoadoutItems = compressLoadoutItems(initialState.loadoutItems);

    // Determine if we should clear any url parameters
    const shouldSaveNameChunk = state.buildName !== initialState.buildName;
    const shouldSavePerkChunk = compressedPerks !== compressedInitialPerks;
    const shouldSaveStatsChunk = compressedStats !== compressedInitialStats;
    const shouldSaveStarsChunk = compressedStars !== compressedInitialStars;
    const shouldSaveLoadoutItemsChunk = compressedLoadoutItems !== compressedInitialLoadoutItems;

    // Clear all url parameters (to keep the order consistent for readability)
    params.delete("name");
    params.delete("perks");
    params.delete("stats");
    params.delete("stars");
    params.delete("gear");

    // Add back any parameters that should be saved
    shouldSaveNameChunk && params.set("name", state.buildName);
    shouldSavePerkChunk && params.set("perks", compressedPerks);
    shouldSaveStatsChunk && params.set("stats", compressedStats);
    shouldSaveStarsChunk && params.set("stars", compressedStars);
    shouldSaveLoadoutItemsChunk && params.set("gear", compressedLoadoutItems);

    // Set history entry
    const newUrl = `${window.location.pathname}?${params}`;
    if (shouldCreateHistoryEntry) {
        window.history.pushState({}, "", newUrl);
    } else {
        window.history.replaceState({}, "", newUrl);
    }

    // Return url to caller
    return newUrl;
};

export const loadFromURL = () => {
    const name = getQueryStringParameter("name");
    if (name) {
        store.dispatch(setBuildName(name, false));
    } else {
        store.dispatch(setBuildName("", false));
    }

    const compressedPerks = getQueryStringParameter("perks");
    if (compressedPerks) {
        const activePerkIds = uncompressPerks(compressedPerks);
        store.dispatch(setPerks(activePerkIds));
        store.dispatch(setStudent(activePerkIds.indexOf("student") !== -1));
    } else {
        store.dispatch(setPerks([]));
        store.dispatch(setStudent(false));
    }

    const compressedStats = getQueryStringParameter("stats");
    if (compressedStats) {
        store.dispatch(setStatNums(uncompressStats(compressedStats)));
    } else {
        store.dispatch(setStatNums(getNewStatNums()));
    }

    const compressedStars = getQueryStringParameter("stars");
    if (compressedStars) {
        store.dispatch(setStars(uncompressStars(compressedStars)));
    } else {
        store.dispatch(setStars(getNewStars()));
    }

    const compressedLoadoutItems = getQueryStringParameter("gear");
    if (compressedLoadoutItems) {
        store.dispatch(setLoadoutItems(uncompressLoadoutItems(compressedLoadoutItems)));
    } else {
        store.dispatch(setLoadoutItems(getNewLoadoutItems()));
    }

    store.dispatch(setBuildIdList(localStorage.getObject("bbplanner") || []));
};