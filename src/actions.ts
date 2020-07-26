import {AnyAction} from 'redux';
import {Stars, StatNums, StatType, ThemeId} from './models';

export const TOGGLE_PERK = "TOGGLE_PERK";
export const RESET_PERKS = "RESET_PERKS";
export const SET_PERKS = "SET_PERKS";
export const SET_STUDENT = "SET_STUDENT";
export const SET_STAT = "SET_STAT";
export const RESET_STAT_NUMS = "RESET_STAT_NUMS";
export const SET_STAT_NUMS = "SET_STAT_NUMS";
export const SET_STAR = "SET_STAR";
export const RESET_STARS = "RESET_STARS";
export const SET_STARS = "SET_STARS";
export const SET_BUILD_NAME = "SET_BUILD_NAME";
export const SAVE_BUILD = "SAVE_BUILD";
export const SET_BUILD_ID_LIST = "SET_BUILD_ID_LIST";
export const SET_THEME_ID = "SET_THEME_ID";

export const togglePerk = (perkId: string): AnyAction => ({
    type: TOGGLE_PERK,
    payload: {perkId},
});

export const setStudent = (isStudent: boolean): AnyAction => ({
    type: SET_STUDENT,
    payload: {isStudent},
});

export const setPerks = (activePerkIds: string[]): AnyAction => ({
    type: SET_PERKS,
    payload: {activePerkIds},
});

export const resetPerks = (): AnyAction => ({
    type: RESET_PERKS,
    payload: {},
});

export const setStat = (statType: StatType, num: number): AnyAction => ({
    type: SET_STAT,
    payload: {statType, num},
});

export const setStatNums = (statNums: StatNums): AnyAction => ({
    type: SET_STAT_NUMS,
    payload: {statNums},
});

export const resetStatNums = (): AnyAction => ({
    type: RESET_STAT_NUMS,
    payload: {},
});

export const setStar = (statType: StatType, amount: number): AnyAction => ({
    type: SET_STAR,
    payload: {statType, amount},
});

export const setStars = (stars: Stars): AnyAction => ({
    type: SET_STARS,
    payload: {stars},
});

export const resetStars = (): AnyAction => ({
    type: RESET_STARS,
    payload: {},
});

export const setBuildName = (buildName: string, withSave?: boolean): AnyAction => ({
    type: SET_BUILD_NAME,
    payload: {buildName, withSave},
});

export const setBuildIdList = (buildIdList: string[]): AnyAction => ({
    type: SET_BUILD_ID_LIST,
    payload: {buildIdList},
});

export const setThemeId = (themeId: ThemeId): AnyAction => ({
    type: SET_THEME_ID,
    payload: {themeId},
});