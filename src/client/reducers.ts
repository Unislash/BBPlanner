import {
    RESET_PERKS, RESET_STARS,
    RESET_STAT_NUMS,
    SET_BUILD_NAME,
    SET_PERKS, SET_STAR, SET_STARS, SET_STAT,
    SET_STAT_NUMS, SET_STUDENT,
    TOGGLE_PERK,
    TOGGLE_STUDENT,
} from './actions';
import {AnyAction} from 'redux';
import {getAvailableNumberOfPerks, maxLevel} from './logic';
import {saveToURL} from './url';
import {AppState} from './models';

export const getNewStatNums = () => ({
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

            // TODO: This should probably be in a thunk, not in a reducer
            saveToURL(newState);
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
        default:
            break;
    }
    return newState;
};
