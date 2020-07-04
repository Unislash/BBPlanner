import {perkBinary} from './perkBinary';
import {AppState} from './reducers';
import {store} from './createStore';
import {setPerks} from './actions';

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

const unpackBinaryString = (packed: string) => {
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
    [...binaryString].forEach((str: string, index: number) => {
        if (str === "1") {
            activePerkIds.push(Object.keys(perkBinary)[index]);
        }
    });

    return activePerkIds;
};

const compressStats = () => {
    // TODO: Store these in redux instead of local state, and load them here
    const stats = {
        health: 55,
        fatigue: 100,
        resolve: 40,
        initiative: 100,
        mattack: 55,
        rattack: 40,
        mdefense: 4,
        rdefense: 3,
    };

    return Object.values(stats)
        .map(statNum => padString("000", statNum.toString()))
        .join("");
};

const compressStars = () => {
    // TODO: Store these in redux instead of local state, and load them here
    const stars = {
        health: 2,
        fatigue: 2,
        resolve: 2,
        initiative: 0,
        mattack: 0,
        rattack: 0,
        mdefense: 0,
        rdefense: 0,
    };

    return Object.values(stars)
        .join("");
};

const setQueryStringParameter = (name: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(name, value);
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
};
const getQueryStringParameter = (name: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
};

export const saveToURL = (state: AppState) => {
    setQueryStringParameter("perks", compressPerks(state.activePerkIds));
    setQueryStringParameter("stats", compressStats());
    setQueryStringParameter("stars", compressStars());
};

export const loadFromURL = () => {
    const compressedPerks = getQueryStringParameter("perks");
    if (compressedPerks) {
        store.dispatch(setPerks(uncompressPerks(compressedPerks)))
    }
};