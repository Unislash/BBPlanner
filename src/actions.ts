import {AnyAction} from 'redux';
import {LoadoutItems, LoadoutSlotType, Stars, StatNums, StatType} from './models';

export const CREATE_NEW_BUILD = "CREATE_NEW_BUILD";
export const SET_BUILD_NAME = "SET_BUILD_NAME";
export const SET_BUILD_ID_LIST = "SET_BUILD_ID_LIST";
export const SET_LOADOUT_SLOT = "SET_LOADOUT_SLOT";
export const SET_LOADOUT_ITEMS = "SET_LOADOUT_ITEMS";

export const createNewBuild = (): AnyAction => ({
    type: CREATE_NEW_BUILD,
    payload: {},
});

export const setLoadoutSlot = (loadoutSlot: LoadoutSlotType, itemName: string): AnyAction => ({
    type: SET_LOADOUT_SLOT,
    payload: {loadoutSlot, itemName},
});

export const setLoadoutItems = (loadoutItems: LoadoutItems): AnyAction => ({
    type: SET_LOADOUT_ITEMS,
    payload: {loadoutItems},
});

export const setBuildName = (buildName: string, withSave?: boolean): AnyAction => ({
    type: SET_BUILD_NAME,
    payload: {buildName, withSave},
});

export const setBuildIdList = (buildIdList: string[]): AnyAction => ({
    type: SET_BUILD_ID_LIST,
    payload: {buildIdList},
});
