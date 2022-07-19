import {
    CREATE_NEW_BUILD,
    RESET_PERKS,
    RESET_STARS,
    RESET_STAT_NUMS,
    SET_BUILD_ID_LIST,
    SET_BUILD_NAME, SET_LOADOUT_ITEMS, SET_LOADOUT_SLOT,
    SET_PERKS,
    SET_STAR,
    SET_STARS,
    SET_STAT,
    SET_STAT_NUMS,
    SET_STUDENT,
    SET_THEME_ID,
    TOGGLE_PERK,
} from './actions';
import {AnyAction} from 'redux';
import {getAvailableNumberOfPerks, maxLevel} from './logic';
import {resetURL, saveToURL} from './url';
import {AppState} from './models';
import {updateStorageForCurrentBuild} from './storage';
import {saveThemeId} from './storageTheme';
import {getNewLoadoutItems, getNewStars, getNewStatNums, initialState} from './initialState';

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
                isStudent: false,
            };

            // Don't save! To avoid accidental resets, wait for the user to pick their first perk to save
            // saveToURL(newState, true);
            // updateStorageForCurrentBuild(newState);
            break;
        }
        case CREATE_NEW_BUILD: {
            newState = {
                ...state,
                activePerkIds: [],
                buildName: initialState.buildName,
                isStudent: initialState.isStudent,
                statNums: getNewStatNums(),
                stars: getNewStars(),
                loadoutItems: getNewLoadoutItems(),
            };

            // TODO: This should probably be in a thunk, not in a reducer
            resetURL(true);
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
        case SET_LOADOUT_SLOT: {
            const { loadoutSlot, itemName } = action.payload;
            newState = {
                ...state,
                loadoutItems: {
                    ...state.loadoutItems,
                    [loadoutSlot]: itemName,
                },
            };
            saveToURL(newState);
            updateStorageForCurrentBuild(newState);
            break;
        }
        case SET_LOADOUT_ITEMS: {
            const { loadoutItems } = action.payload;
            newState = {
                ...state,
                loadoutItems,
            };
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
