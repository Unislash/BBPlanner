export type StatType = 'level' | 'health' | 'fatigue' | 'resolve' | 'initiative' | 'mattack' | 'rattack' | 'mdefense' | 'rdefense';

export interface StatNums {
    [key: string]: number;
}

export interface Stars {
    [key: string]: number;
}

export enum ThemeId {
    vanilla = "vanilla",
    beastsAndExploration = "beastsAndExploration",
    warriorsOfTheNorth = "warriorsOfTheNorth",
    blazingDeserts = "blazingDeserts",
}

export interface AppState {
    activePerkIds: string[];
    buildName: string;
    isStudent: boolean;
    statNums: StatNums;
    stars: Stars;
    buildIdList: string[];
    themeId: ThemeId;
    version: string;
}

export interface AppStateWithURL extends AppState {
    url: string;
}
