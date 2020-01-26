import {RESET_PERKS, SET_BUILD_NAME, TOGGLE_PERK} from './actions';
import {AnyAction} from 'redux';

const initialState: AppState = {
    activePerkIds: [],
    buildName: "Untitled Build",
};

export interface AppState {
    activePerkIds: string[];
    buildName: string;
}

export const appReducer = (state: AppState = initialState, action: AnyAction): AppState => {
    switch (action.type) {
        case TOGGLE_PERK: {
            const { perkId } = action.payload;
            if (state.activePerkIds.indexOf(perkId) > -1) {
                // It exists, so remove it
                return {
                    ...state,
                    activePerkIds: [...state.activePerkIds].filter(item => item !== perkId),
                };
            } else {
                // It doesn't exist, so add it
                return {
                    ...state,
                    activePerkIds: [...state.activePerkIds, perkId],
                };
            }
        }
        case RESET_PERKS: {
            return {
                ...state,
                activePerkIds: [],
            };
        }
        case SET_BUILD_NAME: {
            const { buildName } = action.payload;
            return {
                ...state,
                buildName: buildName,
            };
        }
        default:
            return state;
    }
}
