import {AnyAction} from 'redux';

export const TOGGLE_PERK = "TOGGLE_PERK";
export const RESET_PERKS = "RESET_PERKS";
export const SET_BUILD_NAME = "SET_BUILD_NAME";

export const togglePerk = (perkId: string): AnyAction => ({
    type: TOGGLE_PERK,
    payload: {perkId},
});

export const resetPerks = (): AnyAction => ({
    type: RESET_PERKS,
    payload: {},
});

export const setBuildName = (buildName: string): AnyAction => ({
    type: SET_BUILD_NAME,
    payload: {buildName},
});