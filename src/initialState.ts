import {AppState} from './models';

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

export const getNewLoadoutItems = () => ({
    accessories: "",
    weapons: "",
    helmets: "",
    armor: "",
    ammo: "",
    offhandItems: "",
    bags1: "",
    bags2: "",
    bags3: "",
    bags4: "",
});

export const initialState: AppState = {
    activePerkIds: [],
    buildName: '',
    isStudent: false,
    statNums: getNewStatNums(),
    stars: getNewStars(),
    loadoutItems: getNewLoadoutItems(),
    buildIdList: [],
};