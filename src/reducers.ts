import {
    CREATE_NEW_BUILD,
    SET_BUILD_ID_LIST,
    SET_BUILD_NAME, SET_LOADOUT_ITEMS, SET_LOADOUT_SLOT,
} from './actions';
import {AnyAction} from 'redux';
import {resetURL, saveToURL} from './url';
import {AppState} from './models';
import {updateStorageForCurrentBuild} from './storage';
import {getNewLoadoutItems, initialState} from './initialState';
import {perkStore} from './stores/perkStore';
import {statsStore} from './stores/statsStore';
import {starsStore} from './stores/starsStore';

export const appReducer = (state: AppState = initialState, action: AnyAction): AppState => {
    let newState: AppState = state;
    switch (action.type) {
        case CREATE_NEW_BUILD: {
            newState = {
                ...state,
                // activePerkIds: [],
                buildName: initialState.buildName,
                // isStudent: initialState.isStudent,
                // statNums: getNewStatNums(),
                // stars: getNewStars(),
                loadoutItems: getNewLoadoutItems(),
            };

            // TODO: This should probably be in a thunk, not in a reducer
            resetURL(true);
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
                statNums: statsStore.getState().statNums,
                activePerkIds: perkStore.getState().activePerkIds,
                stars: starsStore.getState().stars,
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
                    statNums: statsStore.getState().statNums,
                    activePerkIds: perkStore.getState().activePerkIds,
                    stars: starsStore.getState().stars,
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
