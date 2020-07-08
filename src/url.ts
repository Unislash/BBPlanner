import {perkBinary} from './perkBinary';
import {store} from './createStore';
import {setBuildIdList, setBuildName, setPerks, setStars, setStatNums, setStudent} from './actions';
import {AppState, Stars, StatNums} from './models';
import {getNewStars, getNewStatNums} from './reducers';

const padString = (padding: string, strToPad: string, padLeft: boolean = true) => {
    if (typeof strToPad === 'undefined')
        return padding;
    if (padLeft) {
        return (padding + strToPad).slice(-padding.length);
    } else {
        return (strToPad + padding).substring(0, padding.length);
    }
};

const STR64: Array<string> = ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/').split( '' );

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

const getQueryStringParameter = (name: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
};

export const saveToURL = (state: AppState): string => {
    const params = new URLSearchParams(window.location.search);

    params.set("name", state.buildName);
    params.set("perks", compressPerks(state.activePerkIds));
    params.set("stats", compressStats(state.statNums));
    params.set("stars", compressStars(state.stars));

    const newUrl = `${window.location.pathname}?${params}`;
    window.history.replaceState({}, "", newUrl);

    return newUrl;
};

export const loadFromURL = () => {
    const name = getQueryStringParameter("name");
    if (name) {
        store.dispatch(setBuildName(name, false));
    }

    const compressedPerks = getQueryStringParameter("perks");
    if (compressedPerks) {
        const activePerkIds = uncompressPerks(compressedPerks);
        store.dispatch(setPerks(activePerkIds));
        store.dispatch(setStudent(activePerkIds.indexOf("student") !== -1));
    }

    const compressedStats = getQueryStringParameter("stats");
    if (compressedStats) {
        store.dispatch(setStatNums(uncompressStats(compressedStats)));
    }

    const compressedStars = getQueryStringParameter("stars");
    if (compressedStars) {
        store.dispatch(setStars(uncompressStars(compressedStars)));
    }

    store.dispatch(setBuildIdList(localStorage.getObject("bbplanner") || []));
};