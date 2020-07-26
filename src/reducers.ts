import {
    RESET_PERKS,
    RESET_STARS,
    RESET_STAT_NUMS,
    SET_BUILD_ID_LIST,
    SET_BUILD_NAME,
    SET_PERKS,
    SET_STAR,
    SET_STARS,
    SET_STAT,
    SET_STAT_NUMS,
    SET_STUDENT, SET_THEME_ID,
    TOGGLE_PERK,
} from './actions';
import {AnyAction} from 'redux';
import {getAvailableNumberOfPerks, maxLevel} from './logic';
import {saveToURL} from './url';
import {AppState} from './models';
import {updateStorageForCurrentBuild} from './storage';
import {getThemeId, saveThemeId} from './storageTheme';

export const getNewStatNums = () => ({
    level: 1,
    health: 55,
    fatigue: 100,
    resolve: 40,
    initiative: 100,
    mattack: 55,
    rattack: 40,
    mdefense: 4,
    rdefense: 3,
});

export const getNewStars = () => ({
    health: 0,
    fatigue: 0,
    resolve: 0,
    initiative: 0,
    mattack: 0,
    rattack: 0,
    mdefense: 0,
    rdefense: 0,
});

const initialState: AppState = {
    activePerkIds: [],
    buildName: "Untitled Build",
    isStudent: false,
    statNums: getNewStatNums(),
    stars: getNewStars(),
    buildIdList: [],
    themeId: getThemeId(),
    version: "1.0",
};

export const appReducer = (state: AppState = initialState, action: AnyAction): AppState => {
    let newState: AppState = state;
    switch (action.type) {
        case TOGGLE_PERK: {
            const { perkId } = action.payload;
            if (state.activePerkIds.indexOf(perkId) > -1) {
                // It exists, so remove it
                newState = {
                    ...state,
                    activePerkIds: [...state.activePerkIds].filter(item => item !== perkId),
                };
                if (perkId === "student") {
                    newState.isStudent = false;
                }
            } else {
                // It doesn't exist, so try to add it
                if (perkId === "student" || getAvailableNumberOfPerks(state.activePerkIds.length, maxLevel, state.isStudent) >= 1) {
                    newState = {
                        ...state,
                        activePerkIds: [...state.activePerkIds, perkId],
                    };
                    if (perkId === "student") {
                        newState.isStudent = true;
                    }
                } else {
                    // do nothing; there are no available perks left
                }
            }

            // TODO: This should probably be in a thunk, not in a reducer
            saveToURL(newState);
            updateStorageForCurrentBuild(newState);
            break;
        }
        case SET_STUDENT: {
            const { isStudent } = action.payload;
            newState = {
                ...state,
                isStudent,
            };
            break;
        }
        case SET_PERKS: {
            const { activePerkIds } = action.payload;
            newState = {
                ...state,
                activePerkIds,
            };
            break;
        }
        case RESET_PERKS: {
            newState = {
                ...state,
                activePerkIds: [],
            };

            // Ok so pushing a new history entry only half works... if the user does go back after
            // resetting perks, everything looks right until they move away. For now I'm going to
            // leave this, and I can come back and introduce proper undo capabilities.
            // TODO: This should probably be in a thunk, not in a reducer
            saveToURL(newState, true);
            updateStorageForCurrentBuild(newState);
            break;
        }
        case SET_STAT: {
            const { statType, num } = action.payload;
            const newStatNums = {
                ...state.statNums,
            };
            newStatNums[statType] = num; // modify in-place to retain object attribute order

            newState = {
                ...state,
                statNums: newStatNums,
            };

            // TODO: This should probably be in a thunk, not in a reducer
            saveToURL(newState);
            updateStorageForCurrentBuild(newState);
            break;
        }
        case SET_STAT_NUMS: {
            const { statNums } = action.payload;
            newState = {
                ...state,
                statNums,
            };
            break;
        }
        case RESET_STAT_NUMS: {
            newState = {
                ...state,
                statNums: getNewStatNums(),
            };

            // TODO: This should probably be in a thunk, not in a reducer
            saveToURL(newState);
            updateStorageForCurrentBuild(newState);
            break;
        }
        case SET_STAR: {
            const { statType, amount } = action.payload;
            const newStars = {
                ...state.stars,
            };
            newStars[statType] = amount; // modify in-place to retain object attribute order

            newState = {
                ...state,
                stars: newStars,
            };

            // TODO: This should probably be in a thunk, not in a reducer
            saveToURL(newState);
            updateStorageForCurrentBuild(newState);
            break;
        }
        case SET_STARS: {
            const { stars } = action.payload;
            newState = {
                ...state,
                stars,
            };
            break;
        }
        case RESET_STARS: {
            newState = {
                ...state,
                stars: getNewStars(),
            };

            // TODO: This should probably be in a thunk, not in a reducer
            saveToURL(newState);
            updateStorageForCurrentBuild(newState);
            break;
        }
        case SET_BUILD_NAME: {
            const { buildName, withSave = true } = action.payload;
            newState = {
                ...state,
                buildName: buildName,
            };

            // TODO: This should probably be in a thunk, not in a reducer
            document.title = buildName ? buildName : "BB Planner";
            if (withSave) {
                saveToURL(newState);
            }
            break;
        }
        case SET_BUILD_ID_LIST: {
            const { buildIdList } = action.payload;
            newState = {
                ...state,
                buildIdList,
            };

            break;
        }
        case SET_THEME_ID: {
            const { themeId } = action.payload;
            newState = {
                ...state,
                themeId,
            };

            // TODO: This should probably be in a thunk, not in a reducer
            saveThemeId(themeId);
            break;
        }
        default:
            break;
    }
    return newState;
};
