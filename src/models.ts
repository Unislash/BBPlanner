export type StatType = 'level' | 'health' | 'fatigue' | 'resolve' | 'initiative' | 'mattack' | 'rattack' | 'mdefense' | 'rdefense';

export interface StatNums {
    [key: string]: number;
}

export interface Stars {
    [key: string]: number;
}

export type LoadoutSlotType = 'accessories' | 'weapons' | 'helmets' | 'armor' | 'ammo' | 'offhandItems' | 'bags1' | 'bags2' | 'bags3' | 'bags4';

export interface LoadoutItems {
    [key: string]: string;
}

export enum ThemeId {
    vanilla = "vanilla",
    beastsAndExploration = "beastsAndExploration",
    warriorsOfTheNorth = "warriorsOfTheNorth",
    blazingDeserts = "blazingDeserts",
    ofFleshAndFaith = "ofFleshAndFaith",
}

export interface AppState {
    buildName: string;
    loadoutItems: LoadoutItems;
    buildIdList: string[];
}

export interface LocalStorageBuildData {
    url: string;
}

export interface LoadoutItem {
    id: string;
    name: string;
    imageName: string;
}

export interface Helmet extends LoadoutItem {
    description: string;
    conditionMax: string;
    value: string;
    staminaModifier: string;
}

export interface Armor extends LoadoutItem {
    description: string;
    conditionMax: string;
    value: string;
    staminaModifier: string;
}

export interface Accessory extends LoadoutItem {
    description: string;
}

export interface Ammo extends LoadoutItem {
    description: string;
    value: string;
}

export interface Weapon extends LoadoutItem {
    description: string;
    regularDamage: string;
    regularDamageMax: string;
    armorDamageMult: string;
    directDamageMult: string;
    shieldDamage: string;
    chanceToHitHead: string;
    rangeMax: string;
    conditionMax: string;
    handType: string;
    value: string;
    staminaModifier: string;
}

export interface Shield extends LoadoutItem {
    description: string;
    conditionMax: string;
    meleeDefense: string;
    rangedDefense: string;
    value: string;
    staminaModifier: string;
}

export interface Tool extends LoadoutItem {
    description: string;
    value: string;
    staminaModifier: string;
}

export interface Consumable extends LoadoutItem {
    description: string;
}

export type Bag = Consumable | Weapon | Shield | Tool | Ammo;
export type Offhand = Shield | Tool;

export const instanceOfWeapon = (item: any): item is Weapon => {
    return 'regularDamage' in item;
}
export const instanceOfShield = (item: any): item is Shield => {
    return 'conditionMax' in item && !('regularDamage' in item);
}