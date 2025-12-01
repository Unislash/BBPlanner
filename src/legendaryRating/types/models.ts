export type CategoryId =
    "oneHanded" |
    "twoHanded" |
    "ranged" |
    "shield" |
    "armor" |
    "helmet";

export interface Category {
    name: string;
    id: CategoryId;
}

export type Melee1hArchetypeId =
    "axe" |
    "orc_axe" |
    "whip" |
    "cleaver" |
    "khopesh" |
    "orc_cleaver" |
    "dagger" |
    "qatal_dagger" |
    "flail" |
    "flail_three_headed" |
    "warhammer" |
    "mace" |
    "goblin_skewer" |
    "spear" |
    "goblin_falchion" |
    "sword_fencing" |
    "shamshir" |
    "sword";

export type Melee2hArchetypeId =
    "bardiche" |
    "axe_two_handed" |
    "rusty_axe" |
    "longaxe" |
    "cryptcleaver" |
    "warblade" |
    "scimitar_two_handed" |
    "flail_two_handed" |
    "polehammer" |
    "hammer_two_handed" |
    "skull_hammer" |
    "polemace" |
    "mace_two_handed" |
    "spiked_mace" |
    "billhook" |
    "bladed_pike" |
    "jagged_pike" |
    "pike" |
    "swordlance" |
    "warscythe" |
    "spetum" |
    "sword_two_handed" |
    "warbrand";

export type RangedArchetypeId =
    'crossbow' |
    'javelins' |
    'throwing_axes' |
    'handgonne' |
    'bow' |
    'bow_goblin';

export type ShieldArchetypeId =
    "bandit_heater" |
    "metal_heater" |
    "relic_heater" |
    "undead_heater" |
    "winged" |
    "bandit_kite" |
    "dragon_kite" |
    "pavise" |
    "undead_kite" |
    "orc_heavy" |
    "gold_round" |
    "sipar";

export type ArmorArchetypeId =
    "hardened_leather_armor" |
    "plated_fur_armor" |
    "studded_mail_armor" |
    "noble_mail_armor" |
    "skull_and_chain_armor" |
    "black_and_gold_armor" |
    "heraldic_mail_armor" |
    "lindwurm_armor" |
    "golden_scale_armor" |
    "sellsword_armor" |
    "alloy_plate_armor" |
    "golden_lamellar_armor" |
    "leopard_armor" |
    "plated_mail_armor" |
    "coat_of_plates_armor";

export type HelmetArchetypeId =
    "norse_helmet" |
    "wolf_helmet" |
    "steppe_helmet" |
    "skull_helmet" |
    "norse_horned_helmet" |
    "golden_feathered_helmet" |
    "red_and_gold_helmet" |
    "feathered_nasal_helmet" |
    "lindwurm_helmet" |
    "nordic_helmet" |
    "sallet_helmet" |
    "heraldic_bascinet_helmet" |
    "conic_helmet" |
    "gold_and_black_turban_helmet" |
    "bull_helmet";

export type ArchetypeId = Melee1hArchetypeId | Melee2hArchetypeId | RangedArchetypeId | ShieldArchetypeId | ArmorArchetypeId | HelmetArchetypeId;

export interface ArchetypeBase {
    id: ArchetypeId;
    name: string;
    imageName: string;
    alternateImages: string[];
}

export interface MeleeArchetype extends ArchetypeBase {
    fatigueMin: number;
    fatigueMax: number;
    durabilityMin: number;
    durabilityMax: number;
    damageLowMin: number;
    damageLowMax: number;
    damageHighMin: number;
    damageHighMax: number;
    directDamageMin: number;
    directDamageMax: number;
    armorDamageMin: number;
    armorDamageMax: number;
    shieldDamageMin?: number;
    shieldDamageMax?: number;
    hitHeadChanceMin?: number;
    hitHeadChanceMax?: number;
    fatigueSkillCostMin?: number;
    fatigueSkillCostMax?: number;
}

export interface RangedArchetype extends ArchetypeBase {
    fatigueMin: number;
    fatigueMax: number;
    durabilityMin?: number;
    durabilityMax?: number;
    damageLowMin: number;
    damageLowMax: number;
    damageHighMin: number;
    damageHighMax: number;
    directDamageMin: number;
    directDamageMax: number;
    armorDamageMin: number;
    armorDamageMax: number;
    hitHeadChanceMin?: number;
    hitHeadChanceMax?: number;
    fatigueSkillCostMin?: number;
    fatigueSkillCostMax?: number;
    accuracyMin?: number;
    accuracyMax?: number;
    ammoMin?: number;
    ammoMax?: number;
}

export interface ShieldArchetype extends ArchetypeBase {
    fatigueMin: number;
    fatigueMax: number;
    durabilityMin: number;
    durabilityMax: number;
    meleeDefenseMin: number;
    meleeDefenseMax: number;
    rangedDefenseMin: number;
    rangedDefenseMax: number;
    fatigueSkillCostMin?: number;
    fatigueSkillCostMax?: number;
}

export interface ArmorArchetype extends ArchetypeBase {
    fatigueMin: number;
    fatigueMax: number;
    durabilityMin: number;
    durabilityMax: number;
}

export interface HelmetArchetype extends ArchetypeBase {
    fatigueMin: number;
    fatigueMax: number;
    durabilityMin: number;
    durabilityMax: number;
}

export type Archetype =  MeleeArchetype | RangedArchetype | ShieldArchetype | ArmorArchetype | HelmetArchetype;

export type LegendaryStatInputType =
    'durability' |
    'fatigue' |
    'damageLow' |
    'damageHigh' |
    'directDamage' |
    'armorDamage' |
    'shieldDamage' |
    'hitHeadChance' |
    'meleeDefense' |
    'rangedDefense' |
    'fatigueSkillCost' |
    'accuracy' |
    'ammo';


export type LegendaryStatType =
    keyof MeleeArchetype
    | keyof RangedArchetype
    | keyof ShieldArchetype
    | keyof ArmorArchetype
    | keyof HelmetArchetype;