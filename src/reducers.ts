import {
    CREATE_NEW_BUILD,
    RESET_STARS,
    RESET_STAT_NUMS,
    SET_BUILD_ID_LIST,
    SET_BUILD_NAME, SET_LOADOUT_ITEMS, SET_LOADOUT_SLOT,
    SET_STAR,
    SET_STARS,
    SET_STAT,
    SET_STAT_NUMS,
} from './actions';
import {AnyAction} from 'redux';
import {resetURL, saveToURL} from './url';
import {AppState} from './models';
import {updateStorageForCurrentBuild} from './storage';
import {getNewLoadoutItems, getNewStars, getNewStatNums, initialState} from './initialState';
import {perkStore, useActivePerkIds} from './stores/perkStore';

export const appReducer = (state: AppState = initialState, action: AnyAction): AppState => {
    let newState: AppState = state;
    switch (action.type) {
        case CREATE_NEW_BUILD: {
            newState = {
                ...state,
                // activePerkIds: [],
                buildName: initialState.buildName,
                // isStudent: initialState.isStudent,
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
            saveToURL({
                ...newState,
                activePerkIds: perkStore.getState().activePerkIds,
            });
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
            saveToURL({
                ...newState,
                activePerkIds: perkStore.getState().activePerkIds,
            });
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
            saveToURL({
                ...newState,
                activePerkIds: perkStore.getState().activePerkIds,
            });
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
            saveToURL({
                ...newState,
                activePerkIds: perkStore.getState().activePerkIds,
            });
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
            saveToURL({
                ...newState,
                activePerkIds: perkStore.getState().activePerkIds,
            });
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
                saveToURL({
                    ...newState,
                    activePerkIds: perkStore.getState().activePerkIds,
                });
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
        default:
            break;
    }
    return newState;
};
