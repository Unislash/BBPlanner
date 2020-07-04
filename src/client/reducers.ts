import {RESET_PERKS, SET_BUILD_NAME, SET_PERKS, TOGGLE_PERK, TOGGLE_STUDENT} from './actions';
import {AnyAction} from 'redux';
import {getAvailableNumberOfPerks, maxLevel} from './logic';
import {saveToURL} from './url';

const initialState: AppState = {
    activePerkIds: [],
    buildName: "Untitled Build",
    isStudent: false,
};

export interface AppState {
    activePerkIds: string[];
    buildName: string;
    isStudent: boolean;
}

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
            } else {
                // It doesn't exist, so try to add it
                if (getAvailableNumberOfPerks(state.activePerkIds.length, maxLevel, state.isStudent) >= 1) {
                    newState = {
                        ...state,
                        activePerkIds: [...state.activePerkIds, perkId],
                    };
                } else {
                    // do nothing; there are no available perks left
                }
            }

            // TODO: This should probably be in a thunk, not in a reducer
            saveToURL(newState);
            break;
        }
        case TOGGLE_STUDENT: {
            newState = {
                ...state,
                isStudent: !state.isStudent,
            };
            break;
        }
        case RESET_PERKS: {
            newState = {
                ...state,
                activePerkIds: [],
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
        case SET_BUILD_NAME: {
            const { buildName } = action.payload;
            newState = {
                ...state,
                buildName: buildName,
            };

            // TODO: This should probably be in a thunk, not in a reducer
            document.title = buildName ? buildName : "BB Planner";
            break;
        }
        default:
            break;
    }
    return newState;
};
