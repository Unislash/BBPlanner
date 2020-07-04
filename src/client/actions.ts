import {AnyAction} from 'redux';

export const TOGGLE_PERK = "TOGGLE_PERK";
export const RESET_PERKS = "RESET_PERKS";
export const SET_PERKS = "SET_PERKS";
export const TOGGLE_STUDENT = "TOGGLE_STUDENT";
export const SET_BUILD_NAME = "SET_BUILD_NAME";

export const togglePerk = (perkId: string): AnyAction => ({
    type: TOGGLE_PERK,
    payload: {perkId},
});

export const toggleStudent = (): AnyAction => ({
    type: TOGGLE_STUDENT,
    payload: {},
});

export const setPerks = (activePerkIds: string[]): AnyAction => ({
    type: SET_PERKS,
    payload: {activePerkIds},
});

export const resetPerks = (): AnyAction => ({
    type: RESET_PERKS,
    payload: {},
});

export const setBuildName = (buildName: string): AnyAction => ({
    type: SET_BUILD_NAME,
    payload: {buildName},
});