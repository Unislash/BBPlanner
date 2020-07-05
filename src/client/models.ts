export type StatType = 'health' | 'fatigue' | 'resolve' | 'initiative' | 'mattack' | 'rattack' | 'mdefense' | 'rdefense';

export interface StatNums {
    [key: string]: number;
}

export interface Stars {
    [key: string]: number;
}

export interface AppState {
    activePerkIds: string[];
    buildName: string;
    isStudent: boolean;
    statNums: StatNums;
    stars: Stars;
}

