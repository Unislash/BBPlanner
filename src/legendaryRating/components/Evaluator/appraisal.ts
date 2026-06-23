import { armorArchetypes, helmetArchetypes } from "../../data/archetypes";
import type { Archetype, ArchetypeId, CategoryId, LegendaryStatInputType, LegendaryStatType } from "../../types/models";

interface AppraisalFieldDefinition {
    inputKey: LegendaryStatInputType;
    maxKey: LegendaryStatType;
    minKey: LegendaryStatType;
}

export interface AppraisalRowDefinition {
    id: string;
    primary: AppraisalFieldDefinition;
    secondary?: AppraisalFieldDefinition;
}

export interface RatingResult {
    details: string[];
    label: string;
    percentile: number;
    ratedRowCount: number;
}

interface StatPreference {
    reason: string;
    specificity: "generic" | "specific";
    tier: PreferenceTier;
}

interface DetailEntry {
    impact: number;
    text: string;
}

interface RowSummary {
    impact: number;
    percentile: number;
    preference: StatPreference;
    rowId: RowId;
    text: string;
}

type PreferenceTier = "premium" | "strong" | "useful" | "minor" | "wasted" | "harmful";
type RowId = (typeof appraisalRowDefinitions)[number]["id"];
type ArmorRole = "nimble" | "battleforged" | "nimbleforged";

interface ArmorStandardBenchmark {
    durability: number;
    fatigue: number;
    name: string;
}

export const appraisalRowDefinitions: AppraisalRowDefinition[] = [
    {
        id: "durability",
        primary: { inputKey: "durability", minKey: "durabilityMin", maxKey: "durabilityMax" },
    },
    {
        id: "damage",
        primary: { inputKey: "minimumDamage", minKey: "minimumDamageMin", maxKey: "minimumDamageMax" },
        secondary: { inputKey: "maximumDamage", minKey: "maximumDamageMin", maxKey: "maximumDamageMax" },
    },
    {
        id: "directDamage",
        primary: { inputKey: "directDamage", minKey: "directDamageMin", maxKey: "directDamageMax" },
    },
    {
        id: "armorDamage",
        primary: { inputKey: "armorDamage", minKey: "armorDamageMin", maxKey: "armorDamageMax" },
    },
    {
        id: "shieldDamage",
        primary: { inputKey: "shieldDamage", minKey: "shieldDamageMin", maxKey: "shieldDamageMax" },
    },
    {
        id: "hitHeadChance",
        primary: { inputKey: "hitHeadChance", minKey: "hitHeadChanceMin", maxKey: "hitHeadChanceMax" },
    },
    {
        id: "meleeDefense",
        primary: { inputKey: "meleeDefense", minKey: "meleeDefenseMin", maxKey: "meleeDefenseMax" },
    },
    {
        id: "rangedDefense",
        primary: { inputKey: "rangedDefense", minKey: "rangedDefenseMin", maxKey: "rangedDefenseMax" },
    },
    {
        id: "fatigue",
        primary: { inputKey: "fatigue", minKey: "fatigueMin", maxKey: "fatigueMax" },
    },
    {
        id: "fatigueSkillCost",
        primary: { inputKey: "fatigueSkillCost", minKey: "fatigueSkillCostMin", maxKey: "fatigueSkillCostMax" },
    },
    {
        id: "accuracy",
        primary: { inputKey: "accuracy", minKey: "accuracyMin", maxKey: "accuracyMax" },
    },
    {
        id: "ammo",
        primary: { inputKey: "ammo", minKey: "ammoMin", maxKey: "ammoMax" },
    },
];

const ratingTiers = [
    { minimum: 95, label: "Godly" },
    { minimum: 85, label: "Excellent" },
    { minimum: 70, label: "Strong" },
    { minimum: 55, label: "Good" },
    { minimum: 40, label: "Average" },
    { minimum: 20, label: "Weak" },
    { minimum: 0, label: "Poor" },
];

const archetypeCeilings: Partial<Record<ArchetypeId, number>> = {
    goblin_skewer: 68,
    goblin_falchion: 68,
    bow_goblin: 68,
    spetum: 62,
    spear: 88,
    orc_heavy: 48,
};

const rowLabelById: Record<RowId, string> = {
    accuracy: "accuracy",
    ammo: "extra ammo",
    armorDamage: "armor damage",
    damage: "damage",
    directDamage: "ignore armor",
    durability: "durability",
    fatigue: "fatigue reduction",
    fatigueSkillCost: "skill-fatigue reduction",
    hitHeadChance: "head-hit chance",
    meleeDefense: "melee defense",
    rangedDefense: "ranged defense",
    shieldDamage: "shield damage",
};

const preferenceUtilityByTier: Record<PreferenceTier, { base: number; scale: number }> = {
    premium: { base: 0.45, scale: 0.55 },
    strong: { base: 0.3, scale: 0.42 },
    useful: { base: 0.14, scale: 0.28 },
    minor: { base: 0.05, scale: 0.13 },
    wasted: { base: -0.02, scale: -0.08 },
    harmful: { base: -0.06, scale: -0.12 },
};

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

export const getPercentile = (value: number, min: number, max: number) => {
    if (min === max) {
        return 100;
    }

    return clamp(((value - min) / (max - min)) * 100, 0, 100);
};

export const getRangeValue = (archetype: Archetype, key: LegendaryStatType) => {
    const value = (archetype as unknown as Record<string, unknown>)[key];
    return typeof value === "number" ? value : undefined;
};

export const getDefaultLegendaryStats = (archetype: Archetype) => {
    return appraisalRowDefinitions.reduce<Partial<Record<LegendaryStatInputType, number>>>(
        (accumulator, definition) => {
            const primaryMin = getRangeValue(archetype, definition.primary.minKey);
            if (primaryMin === undefined) {
                return accumulator;
            }

            accumulator[definition.primary.inputKey] =
                definition.primary.inputKey === "fatigueSkillCost" ? 0 : primaryMin;

            if (definition.secondary) {
                const secondaryMin = getRangeValue(archetype, definition.secondary.minKey);
                if (secondaryMin !== undefined) {
                    accumulator[definition.secondary.inputKey] = secondaryMin;
                }
            }

            return accumulator;
        },
        {},
    );
};

const premium = (reason: string, specificity: "generic" | "specific" = "generic"): StatPreference => ({
    tier: "premium",
    reason,
    specificity,
});
const strong = (reason: string, specificity: "generic" | "specific" = "generic"): StatPreference => ({
    tier: "strong",
    reason,
    specificity,
});
const useful = (reason: string, specificity: "generic" | "specific" = "generic"): StatPreference => ({
    tier: "useful",
    reason,
    specificity,
});
const minor = (reason: string, specificity: "generic" | "specific" = "generic"): StatPreference => ({
    tier: "minor",
    reason,
    specificity,
});
const wasted = (reason: string, specificity: "generic" | "specific" = "generic"): StatPreference => ({
    tier: "wasted",
    reason,
    specificity,
});
const harmful = (reason: string, specificity: "generic" | "specific" = "generic"): StatPreference => ({
    tier: "harmful",
    reason,
    specificity,
});

const getCurrentStatValue = (
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    inputKey: LegendaryStatInputType,
) => {
    return legendaryStats[inputKey] ?? defaultLegendaryStats[inputKey];
};

export const isAppraisalRowModified = (
    definition: AppraisalRowDefinition,
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    const primaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.primary.inputKey);
    const defaultPrimaryValue = defaultLegendaryStats[definition.primary.inputKey];

    if (primaryValue !== defaultPrimaryValue) {
        return true;
    }

    const primaryMin = getRangeValue(archetype, definition.primary.minKey);
    const primaryMax = getRangeValue(archetype, definition.primary.maxKey);
    const primaryHasTwoValueRange =
        primaryMin !== undefined && primaryMax !== undefined && Math.abs(primaryMax - primaryMin) === 1;

    if (!definition.secondary) {
        return primaryHasTwoValueRange;
    }

    const secondaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.secondary.inputKey);
    const defaultSecondaryValue = defaultLegendaryStats[definition.secondary.inputKey];

    if (secondaryValue !== defaultSecondaryValue) {
        return true;
    }

    const secondaryMin = getRangeValue(archetype, definition.secondary.minKey);
    const secondaryMax = getRangeValue(archetype, definition.secondary.maxKey);
    const secondaryHasTwoValueRange =
        secondaryMin !== undefined && secondaryMax !== undefined && Math.abs(secondaryMax - secondaryMin) === 1;

    return primaryHasTwoValueRange && secondaryHasTwoValueRange;
};

const isValueWithinRange = (value: number, min: number, max: number) => {
    const lowerBound = Math.min(min, max);
    const upperBound = Math.max(min, max);
    return value >= lowerBound && value <= upperBound;
};

export const isAppraisalRowValid = (
    definition: AppraisalRowDefinition,
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    const primaryMin = getRangeValue(archetype, definition.primary.minKey);
    const primaryMax = getRangeValue(archetype, definition.primary.maxKey);
    const primaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.primary.inputKey);

    if (primaryMin === undefined || primaryMax === undefined || primaryValue === undefined) {
        return false;
    }

    if (!isValueWithinRange(primaryValue, primaryMin, primaryMax)) {
        return false;
    }

    if (!definition.secondary) {
        return true;
    }

    const secondaryMin = getRangeValue(archetype, definition.secondary.minKey);
    const secondaryMax = getRangeValue(archetype, definition.secondary.maxKey);
    const secondaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.secondary.inputKey);

    if (secondaryMin === undefined || secondaryMax === undefined || secondaryValue === undefined) {
        return false;
    }

    return isValueWithinRange(secondaryValue, secondaryMin, secondaryMax);
};

const getRowPercentile = (
    definition: AppraisalRowDefinition,
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    if (!isAppraisalRowValid(definition, archetype, legendaryStats, defaultLegendaryStats)) {
        return undefined;
    }

    const primaryMin = getRangeValue(archetype, definition.primary.minKey);
    const primaryMax = getRangeValue(archetype, definition.primary.maxKey);
    const primaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.primary.inputKey);

    if (primaryMin === undefined || primaryMax === undefined || primaryValue === undefined) {
        return undefined;
    }

    const rowPercentiles = [getPercentile(primaryValue, primaryMin, primaryMax)];

    if (definition.secondary) {
        const secondaryMin = getRangeValue(archetype, definition.secondary.minKey);
        const secondaryMax = getRangeValue(archetype, definition.secondary.maxKey);
        const secondaryValue = getCurrentStatValue(
            legendaryStats,
            defaultLegendaryStats,
            definition.secondary.inputKey,
        );

        if (secondaryMin !== undefined && secondaryMax !== undefined && secondaryValue !== undefined) {
            rowPercentiles.push(getPercentile(secondaryValue, secondaryMin, secondaryMax));
        }
    }

    return rowPercentiles.reduce((sum, value) => sum + value, 0) / rowPercentiles.length;
};

const getValidModifiedRows = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    return appraisalRowDefinitions
        .filter((definition) => getRangeValue(archetype, definition.primary.minKey) !== undefined)
        .filter((definition) => isAppraisalRowModified(definition, archetype, legendaryStats, defaultLegendaryStats))
        .filter((definition) => isAppraisalRowValid(definition, archetype, legendaryStats, defaultLegendaryStats));
};

const hasModifiedRow = (
    rowId: RowId,
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    return getValidModifiedRows(archetype, legendaryStats, defaultLegendaryStats).some((definition) => definition.id === rowId);
};

const isArchetypeId = (archetype: Archetype, ids: ArchetypeId[]) => {
    return ids.includes(archetype.id);
};

type ShieldRole = "melee_bis" | "melee_good" | "ranged" | "useless";

const getShieldRole = (archetype: Archetype): ShieldRole => {
    if (isArchetypeId(archetype, ["metal_heater", "gold_round"])) {
        return "melee_bis"; // best in slot
    }

    if (isArchetypeId(archetype, ["bandit_heater", "relic_heater", "undead_heater", "winged", "sipar"])) {
        return "melee_good";
    }

    if (isArchetypeId(archetype, ["bandit_kite", "dragon_kite", "pavise", "undead_kite"])) {
        return "ranged";
    }

    return "useless";
};

const getWeaponDurabilityPreference = () => minor("Durability is better than nothing, but it's never going to decide whether a named weapon is worth using.");
const getWeaponFatiguePreference = () => minor("Flat fatigue reduction can be convenient, but it is less valuable than offensive stats.");
const getWeaponHeadshotPenalty = () => wasted("Extra head hit-chance splits damage between head and body armor, so it's often not desired outside of heavy-hitting weapons.");
const getWeaponShieldDamagePenalty = () => wasted("Shield damage can come into play in some situations, but is not really what you're hoping for in a named item.");
const getWeaponArmorDamagePreference = () => useful("Armor damage is a fairly valuable roll, but damage and ignore armor are more desired.");

const getOneHandedPreferences = (
    archetype: Archetype,
    _legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    _defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
): Partial<Record<RowId, StatPreference>> => {
    const standard = {
        armorDamage: getWeaponArmorDamagePreference(),
        damage: premium("Damage is the best roll on nearly all weapons."),
        directDamage: premium("Ignore armor is one of the best rolls on most one-handed weapons."),
        durability: getWeaponDurabilityPreference(),
        fatigue: getWeaponFatiguePreference(),
        fatigueSkillCost: useful("Skill-fatigue reduction is slightly more valuable on one-handed weapons, since you often make multiple attacks per turn with them."),
        hitHeadChance: getWeaponHeadshotPenalty(),
        shieldDamage: getWeaponShieldDamagePenalty(),
    } satisfies Partial<Record<RowId, StatPreference>>;

    if (archetype.id === "dagger") {
        return {
            ...standard,
            armorDamage: wasted("Daggers are mostly used to Puncture, and never to actually do armor damage.", "specific"),
            directDamage: harmful("Puncture already fully ignores armor, so getting more ignore armor is nearly useless.", "specific"),
            fatigue: harmful("Daggers are already very light, so flat fatigue reduction is not useful.", "specific"),
            fatigueSkillCost: premium("Repeated Puncture attacks make skill-fatigue reduction desirable on daggers.", "specific"),
        };
    }

    if (archetype.id === "qatal_dagger") {
        return {
            ...standard,
            armorDamage: wasted("Even though qatals end up doing far more armor damage than other daggers, Armor damage is still not an optimal roll for them.", "specific"),
            directDamage: premium("Ignore armor is one of the best rolls on a qatal.", "specific"),
            fatigue: harmful("Flat fatigue reduction barely matters on a weapon this light.", "specific"),
            fatigueSkillCost: strong(
                "Skill-fatigue reduction is strong on a qatal due to its high attack frequency, but damage and ignore armor are even better.",
                "specific",
            ),
        };
    }

    if (isArchetypeId(archetype, ["axe", "orc_axe"])) {
        return {
            ...standard,
            armorDamage: useful("Armor damage is fine on axes, but it is still still not as good as raw damage and ignore armor.", "specific"),
            shieldDamage: wasted("Shield damage is rarely worth a named roll, even on axes.", "specific"),
        };
    }

    if (archetype.id === "whip") {
        return {
            ...standard,
            armorDamage: wasted("Whips do nearly no armor damage, so Armor Damage is a wasted roll.", "specific"),
            directDamage: useful("Ignore armor is useful on a whip to get hp damage and thus bleed, but it's not quite as desired on a whip as compared to standard weapons.", "specific"),
            fatigueSkillCost: premium("Whips value skill-fatigue reduction highly because they use a lot of fatigue, especially the Disarm skill.", "specific"),
        };
    }

    if (archetype.id === "orc_cleaver") {
        return {
            ...standard,
            fatigueSkillCost: strong("Orc cleavers use a ton of fatigue, so skill-fatigue reduction is useful on them.", "specific"),
        };
    }

    if (isArchetypeId(archetype, ["flail", "flail_three_headed"])) {
        return {
            ...standard,
            fatigueSkillCost: strong("Flails use more fatigue on skills than most one-handers, so this skill-fatigue reduction is very useful.", "specific"),
        };
    }

    if (archetype.id === "warhammer") {
        return {
            ...standard,
            armorDamage: strong("Warhammers are often used to destroy armor, so more Armor damage is more useful on it than on most weapons.", "specific"),
        };
    }

    if (archetype.id === "sword_fencing") {
        return {
            ...standard,
            fatigueSkillCost: strong("Skill-fatigue reduction matters more on fencing swords because fatigue lowers Lunge damage.", "specific"),
        };
    }

    return standard;
};

const getTwoHandedPreferences = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
): Partial<Record<RowId, StatPreference>> => {
    const hasDamageSupport =
        hasModifiedRow("damage", archetype, legendaryStats, defaultLegendaryStats) ||
        hasModifiedRow("directDamage", archetype, legendaryStats, defaultLegendaryStats);

    const standard = {
        armorDamage: getWeaponArmorDamagePreference(),
        damage: premium("Damage is the best roll on nearly all weapons."),
        directDamage: premium("Ignore armor is one of the best rolls on most two-handed weapons."),
        durability: getWeaponDurabilityPreference(),
        fatigue: wasted("Flat fatigue reduction is not unwelcome on heavy two-handed weapons, but generally not what you're hoping for."),
        fatigueSkillCost: useful("Skill-fatigue reduction can be useful if you have a small amount of fatigue, but it is not as valuable as damage rolls."),
        hitHeadChance: getWeaponHeadshotPenalty(),
        shieldDamage: getWeaponShieldDamagePenalty(),
    } satisfies Partial<Record<RowId, StatPreference>>;

    if (isArchetypeId(archetype, ["bardiche", "axe_two_handed", "rusty_axe"])) {
        return standard;
    }

    if (archetype.id === "longaxe") {
        return {
            ...standard,
            hitHeadChance: hasDamageSupport
                ? strong("Head-hit chance is strong on a longaxe if it also has a damage roll, like this one.", "specific")
                : minor("Head-hit chance is only minorly useful on a longaxe that doesn't also have a damage roll. If you aren't hitting hard on a headshot, you're just splitting armor damage.", "specific"),
        };
    }

    if (isArchetypeId(archetype, ["cryptcleaver", "warblade", "scimitar_two_handed"])) {
        return {
            ...standard,
            fatigueSkillCost: strong(`Skill-fatigue reduction is strong on a ${archetype.name} due to it being one of the most fatigue-intensive weapons in the game.`, "specific"),
            shieldDamage: harmful(`${archetype.name} is almost never used to break shields.`, "specific"),
        };
    }

    if (archetype.id === "flail_two_handed") {
        return {
            ...standard,
            hitHeadChance: strong("Head-hit chance is very strong on a two-handed flail due to Pound's 10% increased ignore armor on a headshot. It's already a heavy-hitting weapon, so headshots are really going to hurt.", "specific"),
        };
    }

    if (isArchetypeId(archetype, ["polehammer", "hammer_two_handed", "skull_hammer"])) {
        return {
            ...standard,
            armorDamage: strong("One of the key uses of a hammer is to crack open heavy armor, so Armor Damage is a desirable roll on them.", "specific"),
            hitHeadChance: useful(`Head-hit chance is useful on the ${archetype.name} due to its considerable damage, making headshots effective... but it's still not as valuable as raw damage and ignore armor.`, "specific"),
            shieldDamage: harmful("Shield damage is not a useful roll on hammers, since they are rarely used to break shields.", "specific"),
        };
    }

    if (isArchetypeId(archetype, ["polemace", "mace_two_handed", "spiked_mace"])) {
        return {
            ...standard,
            hitHeadChance: useful(`Head-hit chance is useful on the ${archetype.name} due to its considerable damage, making headshots effective... but it's still not as valuable as raw damage and ignore armor.`, "specific"),
            shieldDamage: harmful("Shield damage is not a useful roll on two-handed maces, since they are rarely used to break shields.", "specific"),
        };
    }

    if (archetype.id === "billhook") {
        return {
            ...standard,
            hitHeadChance: hasDamageSupport
                ? strong("Head-hit chance is strong on a billhook if it also has a damage roll, like this one.", "specific")
                : minor("Head-hit chance is only minorly useful on a billhook that doesn't also have a damage roll. If you aren't hitting hard on a headshot, you're just splitting armor damage.", "specific"),
        };
    }

    if (isArchetypeId(archetype, ["bladed_pike", "jagged_pike", "pike"])) {
        return {
            ...standard,
            hitHeadChance: harmful(`Head-hit chance is usually not a desirable roll on ${getArchetypeReference(archetype, "object")}, because it will most likely just split your armor damage up.`, "specific"),
        };
    }

    if (isArchetypeId(archetype, ["warscythe", "swordlance"])) {
        return {
            ...standard,
            fatigueSkillCost: strong(
                `Skill-fatigue reduction is strong on ${getArchetypeReference(archetype, "object")} because its primary use is the Reap skill, which is very fatigue-intensive.`,
                "specific",
            ),
            hitHeadChance: harmful(`Head-hit chance is usually not a desirable roll on ${getArchetypeReference(archetype, "object")}, because it will most likely just split your armor damage up.`, "specific"),
        };
    }

    if (archetype.id === "spetum") {
        return {
            ...standard,
            hitHeadChance: harmful(`Head-hit chance is usually not a desirable roll on ${getArchetypeReference(archetype, "object")}, because it will most likely just split your armor damage up.`, "specific"),
        };
    }

    return standard;
};

const getRangedPreferences = (archetype: Archetype): Partial<Record<RowId, StatPreference>> => {
    const standard = {
        accuracy: useful("Accuracy is useful for ranged weapons, but damage and ignore armor are what you're looking for."),
        ammo: minor("Extra ammo isn't bad, but isn't going to make this a killer weapon."),
        armorDamage: minor("Armor damage is going to come into play often, but it is still still not as good as raw damage and ignore armor."),
        damage: premium("Damage is the best roll on all ranged weapons."),
        directDamage: premium("Ignore armor is one of the best rolls on all ranged weapons."),
        durability: wasted("Durability is low value on ranged weapons, as they are rarely at risk of breaking."),
        fatigue: wasted("Flat fatigue reduction is low value on ranged weapons since they're already quite light."),
        fatigueSkillCost: useful("Skill-fatigue reduction is useful on ranged weapons, as they are actually rather fatigue intensive due to their high uptime throughout fights."),
        hitHeadChance: useful("Head-hit chance is situational on ranged weapons. Against heavily armored enemies you'll just be splitting your armor damage, but against lightly armored enemies it's often a one-shot kill."),
    } satisfies Partial<Record<RowId, StatPreference>>;

    if (archetype.id === "crossbow") {
        return standard;
    }

    if (isArchetypeId(archetype, ["javelins", "throwing_axes"])) {
        return {
            ...standard,
            accuracy: harmful("Throwing weapons are already accurate at their effective range, so rolling additional accuracy is a waste of a roll.", "specific"),
        };
    }

    if (archetype.id === "bow" || archetype.id === "bow_goblin") {
        return {
            ...standard,
            accuracy: strong("Bows are often being used at long ranges, where Accuracy really comes into play.", "specific"),
        };
    }

    return standard;
};

const getShieldPreferences = (archetype: Archetype): Partial<Record<RowId, StatPreference>> => {
    const role = getShieldRole(archetype);

    if (role === "ranged") {
        return {
            durability: useful("Durability matters less on a ranged defense shield than it does on a melee shield, since it won't encounter many axes. It's still useful to survive a throwing spear though."),
            fatigue: harmful("Flat fatigue reduction is basically a wasted roll on named shields, since a few points of fatigue isn't very impactful."),
            fatigueSkillCost: strong("Skill-fatigue reduction can help with spamming Shieldwall, but ranged defense is what matters most for a ranged-oriented shield."),
            meleeDefense: useful(`A good melee defense roll can make this shield serviceable in melee, but ${getArchetypeReference(archetype, "object")} is mainly a ranged-oriented shield.`, "specific"),
            rangedDefense: premium(`Ranged defense is the most valuable roll for ${getArchetypeReference(archetype, "object")}.`),
        };
    }

    if (role === "melee_bis") {
        return {
            durability: strong("Durability is useful here, but this shield base is already strong enough to survive most attempts to destroy it."),
            fatigue: wasted("Flat fatigue reduction is basically a wasted roll on named shields, since a few points of fatigue isn't very impactful."),
            fatigueSkillCost: strong("Skill-fatigue reduction can help with spamming Shieldwall, but melee defense is what matters most for a melee-oriented shield."),
            meleeDefense: premium(`Melee defense is the most valuable roll for ${getArchetypeReference(archetype, "object")}.`),
            rangedDefense: useful(`A good ranged defense roll can make this shield serviceable against projectiles, but ${getArchetypeReference(archetype, "object")} is mainly a melee-oriented shield.`, "specific"),
        };
    }

    if (role === "melee_good") {
        return {
            durability: strong("Durability matters a lot on melee shields because it affects whether they survive axe hits."),
            fatigue: harmful("Flat fatigue reduction is basically a wasted roll on named shields, since a few points of fatigue isn't very impactful."),
            fatigueSkillCost: useful("Skill-fatigue reduction can help with spamming Shieldwall, but melee defense is what matters most for a melee-oriented shield."),
            meleeDefense: strong(`Melee defense is the most valuable roll for ${getArchetypeReference(archetype, "object")}.`),
            rangedDefense: useful(`A good ranged defense roll can make this shield serviceable against projectiles, but ${getArchetypeReference(archetype, "object")} is mainly a melee-oriented shield.`, "specific"),
        };
    }

    if (role === "useless") {
        return {};
    }

    return {};
};

const getArmorPreferences = (): Partial<Record<RowId, StatPreference>> => {
    return {
        durability: strong("Durability is the main stat that separates a strong piece of armor from a weak one.", "specific"),
        fatigue: useful("Reduced fatigue matters a lot on armor and helmets because it determines which builds can actually wear the piece well.", "specific"),
    };
};

const getStatPreference = (
    archetype: Archetype,
    categoryId: CategoryId,
    rowId: RowId,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    let preferences: Partial<Record<RowId, StatPreference>>;

    switch (categoryId) {
        case "oneHanded":
            preferences = getOneHandedPreferences(archetype, legendaryStats, defaultLegendaryStats);
            break;
        case "twoHanded":
            preferences = getTwoHandedPreferences(archetype, legendaryStats, defaultLegendaryStats);
            break;
        case "ranged":
            preferences = getRangedPreferences(archetype);
            break;
        case "shield":
            preferences = getShieldPreferences(archetype);
            break;
        case "armor":
        case "helmet":
            preferences = getArmorPreferences();
            break;
        default:
            preferences = {};
            break;
    }

    return preferences[rowId] || minor(`This roll is not very useful for ${getArchetypeReference(archetype, "object")}.`);
};

const capitalize = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

const articleFreeArchetypeIds: ArchetypeId[] = ["javelins", "throwing_axes"];

const getArchetypeReference = (
    archetype: Archetype,
    position: "subject" | "object",
) => {
    if (articleFreeArchetypeIds.includes(archetype.id)) {
        return archetype.name;
    }

    return `${position === "subject" ? "The" : "the"} ${archetype.name}`;
};

const getArchetypeVerb = (archetype: Archetype, singular: string, plural: string) => {
    return articleFreeArchetypeIds.includes(archetype.id) ? plural : singular;
};

const getDetailText = (
    label: string,
    percentile: number,
    preference: StatPreference,
    itemReference: string,
) => {
    if (preference.specificity === "specific") {
        switch (preference.tier) {
            case "premium":
                return percentile >= 40
                    ? `${capitalize(label)} rolled well. ${preference.reason}`
                    : `${capitalize(label)} rolled low. ${preference.reason}`;
            case "strong":
                return percentile >= 75
                    ? `${capitalize(label)} rolled well. ${preference.reason}`
                    : `${capitalize(label)} is certainly useful on ${itemReference}. ${preference.reason}`;
            case "useful":
                return percentile >= 75
                    ? `${capitalize(label)} rolled well. ${preference.reason}`
                    : `${capitalize(label)} is useful on ${itemReference}. ${preference.reason}`;
            case "minor":
                return `${capitalize(label)} is a minor stat on ${itemReference}. ${preference.reason}`;
            case "wasted":
                return `${capitalize(label)} is low value on ${itemReference}. ${preference.reason}`;
            default:
                return `${capitalize(label)} is actively unhelpful on ${itemReference}. ${preference.reason}`;
        }
    }

    switch (preference.tier) {
        case "premium":
            if (percentile >= 70) {
                return `${capitalize(label)} rolled very well. ${preference.reason}`;
            }

            if (percentile >= 35) {
                return `${capitalize(label)} rolled reasonably well. ${preference.reason}`;
            }

            return `${capitalize(label)} rolled low. ${preference.reason}`;
        case "strong":
            if (percentile >= 70) {
                return `${capitalize(label)} rolled very well. ${preference.reason}`;
            }

            if (percentile >= 35) {
                return `${capitalize(label)} rolled reasonably well. ${preference.reason}`;
            }

            return `${capitalize(label)} rolled low. ${preference.reason}`;
        case "useful":
            if (percentile >= 70) {
                return `${capitalize(label)} rolled very well. ${preference.reason}`;
            }

            if (percentile >= 35) {
                return `${capitalize(label)} rolled reasonably well. ${preference.reason}`;
            }

            return `${capitalize(label)} rolled low. ${preference.reason}`;
        case "minor":
            if (percentile >= 70) {
                return `${capitalize(label)} rolled very well. ${preference.reason}`;
            }

            return `${capitalize(label)} rolled low. ${preference.reason}`;
        case "wasted":
            if (percentile >= 70) {
                return `${capitalize(label)} rolled high. ${preference.reason}`;
            }

            return `${capitalize(label)} is not what you're looking for on ${itemReference}. ${preference.reason}`;
        default:
            if (percentile >= 70) {
                return `${capitalize(label)} rolled high. ${preference.reason}`;
            }

            return `${capitalize(label)} is actively unhelpful on ${itemReference}. ${preference.reason}`;
    }
};

const getUtilityForPreference = (preference: StatPreference, percentile: number) => {
    const normalizedPercentile = percentile / 100;
    const profile = preferenceUtilityByTier[preference.tier];
    return profile.base + profile.scale * normalizedPercentile;
};

const getArmorRoleThresholds = (categoryId: CategoryId) => {
    const isArmor = categoryId === "armor";

    return {
        heavyThreshold: isArmor ? 270 : 250,
        lightThreshold: isArmor ? 16 : 10,
        nimbleForgedThreshold: 170,
    };
};

const getArmorRolesForStats = (
    categoryId: CategoryId,
    durability: number,
    fatigue: number,
): ArmorRole[] => {
    const fatigueBurden = Math.abs(fatigue);
    const { heavyThreshold, lightThreshold, nimbleForgedThreshold } = getArmorRoleThresholds(categoryId);
    const roles: ArmorRole[] = [];

    if (fatigueBurden < lightThreshold && durability >= nimbleForgedThreshold) {
        roles.push("nimbleforged");
    }

    if (fatigueBurden < lightThreshold) {
        roles.push("nimble");
    }

    if (durability > heavyThreshold) {
        roles.push("battleforged");
    }

    return roles;
};

const canArchetypeFitArmorRole = (archetype: Archetype, categoryId: CategoryId, role: ArmorRole) => {
    const bestFatigue = getRangeValue(archetype, "fatigueMax");
    const bestDurability = getRangeValue(archetype, "durabilityMax");

    if (bestFatigue === undefined || bestDurability === undefined) {
        return false;
    }

    const { heavyThreshold, lightThreshold, nimbleForgedThreshold } = getArmorRoleThresholds(categoryId);
    const fatigueBurden = Math.abs(bestFatigue);

    switch (role) {
        case "nimble":
            return fatigueBurden < lightThreshold;
        case "battleforged":
            return bestDurability > heavyThreshold;
        case "nimbleforged":
            return fatigueBurden < lightThreshold && bestDurability >= nimbleForgedThreshold;
    }
};

const getArmorRoleRanges = (categoryId: CategoryId, role: ArmorRole) => {
    const archetypePool = Object.values(categoryId === "armor" ? armorArchetypes : helmetArchetypes).filter((archetype) =>
        canArchetypeFitArmorRole(archetype, categoryId, role)
    );
    const { heavyThreshold, nimbleForgedThreshold } = getArmorRoleThresholds(categoryId);
    const durabilityFloor =
        role === "battleforged" ? heavyThreshold : role === "nimbleforged" ? nimbleForgedThreshold : undefined;
    const durabilityMin = Math.min(...archetypePool.map((archetype) => archetype.durabilityMin));
    const durabilityMax = Math.max(...archetypePool.map((archetype) => archetype.durabilityMax));
    const fatigueMin = Math.min(...archetypePool.map((archetype) => archetype.fatigueMin));
    const fatigueMax = Math.max(...archetypePool.map((archetype) => archetype.fatigueMax));

    return {
        durabilityMin: durabilityFloor === undefined ? durabilityMin : Math.max(durabilityMin, durabilityFloor),
        durabilityMax,
        fatigueMin,
        fatigueMax,
    };
};

const getArmorRoleLabel = (percentile: number) => {
    if (percentile >= 90) {
        return "Godly";
    }

    if (percentile >= 80) {
        return "Excellent";
    }

    if (percentile >= 65) {
        return "Strong";
    }

    if (percentile >= 50) {
        return "Good";
    }

    if (percentile >= 35) {
        return "Average";
    }

    if (percentile >= 20) {
        return "Weak";
    }

    return "Poor";
};

const getArmorRoleDisplayName = (role: ArmorRole) => {
    switch (role) {
        case "battleforged":
            return "battleforged";
        case "nimble":
            return "nimble";
        case "nimbleforged":
            return "nimbleforged";
    }
};

const getArmorCategoryLabel = (categoryId: CategoryId, plural = false) => {
    if (categoryId === "helmet") {
        return plural ? "helmets" : "helmet";
    }

    return plural ? "armor pieces" : "armor piece";
};

const armorStandardBenchmarks: Record<"armor" | "helmet", Record<Exclude<ArmorRole, "nimbleforged">, ArmorStandardBenchmark>> = {
    armor: {
        battleforged: {
            durability: 300,
            fatigue: -38,
            name: "Coat of Scales",
        },
        nimble: {
            durability: 120,
            fatigue: -9,
            name: "Assassin's Robe",
        },
    },
    helmet: {
        battleforged: {
            durability: 300,
            fatigue: -20,
            name: "Full Helm",
        },
        nimble: {
            durability: 140,
            fatigue: -6,
            name: "Assassin's Face Mask",
        },
    },
};

const getArmorStandardBenchmark = (categoryId: CategoryId, role: Exclude<ArmorRole, "nimbleforged">) => {
    if (categoryId !== "armor" && categoryId !== "helmet") {
        return undefined;
    }

    return armorStandardBenchmarks[categoryId][role];
};

const formatFatigueDelta = (value: number) => {
    if (value === 0) {
        return "equal fatigue";
    }

    return value > 0 ? `${value} less fatigue` : `${Math.abs(value)} more fatigue`;
};

const getArmorRecommendation = (durabilityDelta: number, fatigueDelta: number) => {
    if (durabilityDelta > 0) {
        return "Definitely consider using it.";
    }

    if (durabilityDelta === 0 && fatigueDelta >= 0) {
        return "Definitely consider using it.";
    }

    if (fatigueDelta > 0 && durabilityDelta >= -5) {
        return "Definitely consider using it.";
    }

    return "It might be a good backup, but probably not your main gear.";
};

const getArmorComparisonDetail = (
    archetype: Archetype,
    categoryId: CategoryId,
    role: ArmorRole,
    durability: number,
    fatigue: number,
    score: number,
) => {
    if (role === "nimbleforged") {
        return `${getArchetypeReference(archetype, "subject")} is a good piece of nimbleforged armor.`;
    }

    const benchmark = getArmorStandardBenchmark(categoryId, role);

    if (!benchmark) {
        return undefined;
    }

    const durabilityDelta = durability - benchmark.durability;
    const fatigueDelta = fatigue - benchmark.fatigue;
    const durabilityText = durabilityDelta === 0
        ? "same durability"
        : durabilityDelta > 0
        ? `+${durabilityDelta} durability`
        : `-${Math.abs(durabilityDelta)} durability`;
    const recommendation = getArmorRecommendation(durabilityDelta, fatigueDelta);

    return `Compared to the benchmark of the ${benchmark.name} (${benchmark.durability}/${benchmark.fatigue}), ${getArchetypeReference(archetype, "subject")} has ${durabilityText} and ${formatFatigueDelta(fatigueDelta)}. ${recommendation}`;
};

const getArmorRoleFatigueBonus = (fatiguePercentile: number) => {
    if (fatiguePercentile >= 90) {
        return 6;
    }

    if (fatiguePercentile >= 80) {
        return 3;
    }

    return 0;
};

const getArmorOrHelmetRating = (
    archetype: Archetype,
    categoryId: CategoryId,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
): RatingResult => {
    const modifiedRows = getValidModifiedRows(archetype, legendaryStats, defaultLegendaryStats);

    if (modifiedRows.length === 0) {
        return { details: [], label: "Unrated", percentile: 0, ratedRowCount: 0 };
    }

    const durability = getCurrentStatValue(legendaryStats, defaultLegendaryStats, "durability");
    const fatigue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, "fatigue");

    if (durability === undefined || fatigue === undefined) {
        return { details: [], label: "Unrated", percentile: 0, ratedRowCount: modifiedRows.length };
    }

    const durabilityRollPercentile = getPercentile(
        durability,
        getRangeValue(archetype, "durabilityMin")!,
        getRangeValue(archetype, "durabilityMax")!,
    );
    const fatigueRollPercentile = getPercentile(
        fatigue,
        getRangeValue(archetype, "fatigueMin")!,
        getRangeValue(archetype, "fatigueMax")!,
    );
    const fittingRoles = getArmorRolesForStats(categoryId, durability, fatigue);

    if (fittingRoles.length === 0) {
        const percentile = clamp(Math.round((durabilityRollPercentile * 0.6 + fatigueRollPercentile * 0.4) * 0.64), 0, 64);

        return {
            details: [
                `This ${archetype.name} does not cleanly fit nimble, battleforged, or nimbleforged use.`,
            ],
            label: getArmorRoleLabel(percentile),
            percentile,
            ratedRowCount: modifiedRows.length,
        };
    }

    const bestRole = fittingRoles
        .map((role) => {
            const ranges = getArmorRoleRanges(categoryId, role);
            const roleDurabilityPercentile = getPercentile(durability, ranges.durabilityMin, ranges.durabilityMax);
            const roleFatiguePercentile = getPercentile(fatigue, ranges.fatigueMin, ranges.fatigueMax);
            const fatigueBonus = getArmorRoleFatigueBonus(roleFatiguePercentile);

            return {
                fatigueBonus,
                role,
                roleDurabilityPercentile,
                roleFatiguePercentile,
                score: clamp(Math.round(roleDurabilityPercentile + fatigueBonus), 0, 100),
            };
        })
        .sort((left, right) => right.score - left.score)[0];

    const alternativeRoles = fittingRoles.filter((role) => role !== bestRole.role);
    const details = [
        `${getArchetypeReference(archetype, "subject")} fits ${getArmorRoleDisplayName(bestRole.role)} use.`,
        `${durability} durability puts ${getArchetypeReference(archetype, "object")} around the ${Math.round(bestRole.roleDurabilityPercentile)}th percentile for ${getArmorRoleDisplayName(bestRole.role)} ${getArmorCategoryLabel(categoryId, true)}.`,
    ];

    if (bestRole.fatigueBonus > 0) {
        details.push(
            `${fatigue} fatigue is unusually low for a ${getArmorRoleDisplayName(bestRole.role)} ${getArmorCategoryLabel(categoryId)}, which adds a small bonus here.`,
        );
    }

    if (alternativeRoles.length > 0) {
        details.push(
            `${getArchetypeReference(archetype, "subject")} also fits ${alternativeRoles.map(getArmorRoleDisplayName).join(" and ")} use.`,
        );
    }

    const comparisonDetail = getArmorComparisonDetail(
        archetype,
        categoryId,
        bestRole.role,
        durability,
        fatigue,
        bestRole.score,
    );

    if (comparisonDetail) {
        details.push(comparisonDetail);
    }

    return {
        details,
        label: getArmorRoleLabel(bestRole.score),
        percentile: bestRole.score,
        ratedRowCount: modifiedRows.length,
    };
};

const getArmorClassificationEntries = (
    archetype: Archetype,
    categoryId: CategoryId,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    if (categoryId !== "armor" && categoryId !== "helmet") {
        return [];
    }

    const durability = getCurrentStatValue(legendaryStats, defaultLegendaryStats, "durability");
    const fatigue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, "fatigue");

    if (durability === undefined || fatigue === undefined) {
        return [];
    }

    const fatigueBurden = Math.abs(fatigue);
    const isArmor = categoryId === "armor";
    const lightThreshold = isArmor ? 16 : 10;
    const heavyThreshold = isArmor ? 270 : 250;
    const nimbleForgedThreshold = isArmor ? 170 : 170;
    const durabilityPercentile = getPercentile(
        durability,
        getRangeValue(archetype, "durabilityMin")!,
        getRangeValue(archetype, "durabilityMax")!,
    );
    const fatiguePercentile = getPercentile(
        fatigue,
        getRangeValue(archetype, "fatigueMin")!,
        getRangeValue(archetype, "fatigueMax")!,
    );
    const details: DetailEntry[] = [];
    const fitsNimble = fatigueBurden < lightThreshold;
    const fitsBattleForged = durability > heavyThreshold;
    const fitsNimbleForged = fatigueBurden < lightThreshold && durability >= nimbleForgedThreshold;

    if (fitsNimbleForged) {
        details.push({
            impact: 0.22,
            text: `${getArchetypeReference(archetype, "subject")} fits nimbleforged territory: low fatigue and solid durability.`,
        });
    }

    if (fitsNimble) {
        details.push({
            impact: 0.12,
            text: `${getArchetypeReference(archetype, "subject")} has low enough fatigue to fit nimble use.`,
        });
    }

    if (fitsBattleForged) {
        details.push({
            impact: 0.12,
            text: `${getArchetypeReference(archetype, "subject")} has high enough durability to fit battleforged use.`,
        });
    }

    if (durabilityPercentile >= 85 && fatiguePercentile >= 85) {
        if (fitsNimbleForged) {
            details.push({
                impact: 0.34,
                text: `${getArchetypeReference(archetype, "subject")} rolled extremely well in both durability and fatigue for a nimbleforged piece.`,
            });
        } else if (fitsBattleForged) {
            details.push({
                impact: 0.34,
                text: `${getArchetypeReference(archetype, "subject")} rolled extremely well in both durability and fatigue for a battleforged piece.`,
            });
        } else if (fitsNimble) {
            details.push({
                impact: 0.24,
                text: `${getArchetypeReference(archetype, "subject")} rolled extremely well in both durability and fatigue for a nimble piece.`,
            });
        }
    }

    if (!fitsNimble && !fitsBattleForged && !fitsNimbleForged) {
        details.push({
            impact: -0.45,
            text: `${getArchetypeReference(archetype, "subject")} does not clearly fit nimble, battleforged, or nimbleforged use.`,
        });
    }

    return details;
};

const getThrowingWeaponEntries = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    if (!isArchetypeId(archetype, ["javelins", "throwing_axes"])) {
        return [];
    }

    const minimumDamage = getCurrentStatValue(legendaryStats, defaultLegendaryStats, "minimumDamage");
    const directDamage = getCurrentStatValue(legendaryStats, defaultLegendaryStats, "directDamage");

    if (minimumDamage === undefined || directDamage === undefined) {
        return [];
    }

    const damageThreshold = archetype.id === "javelins" ? 35 : 30;
    const directDamageThreshold = archetype.id === "javelins" ? 45 : 30;

    if (minimumDamage > damageThreshold || directDamage > directDamageThreshold) {
        return [
            {
                impact: 0.16,
                text: `${getArchetypeReference(archetype, "subject")} ${getArchetypeVerb(archetype, "beats", "beat")} the damage baseline of "heavy" throwing weapons, which many named throwing weapons fail to do.`,
            },
        ];
    }

    return [
        {
            impact: -0.16,
            text: `${getArchetypeReference(archetype, "subject")} still ${getArchetypeVerb(archetype, "falls", "fall")} short of the damage baseline of "heavy" throwing weapons.`,
        },
    ];
};

const getRowPercentileFromSummaries = (rowSummaries: RowSummary[], rowId: RowId) => {
    return rowSummaries.find((summary) => summary.rowId === rowId)?.percentile;
};

const getShieldContextEntries = (archetype: Archetype, rowSummaries: RowSummary[]) => {
    const role = getShieldRole(archetype);
    const meleeDefensePercentile = getRowPercentileFromSummaries(rowSummaries, "meleeDefense");
    const rangedDefensePercentile = getRowPercentileFromSummaries(rowSummaries, "rangedDefense");
    const durabilityPercentile = getRowPercentileFromSummaries(rowSummaries, "durability");
    const details: DetailEntry[] = [];

    if (role === "melee_bis") {
        if ((meleeDefensePercentile ?? 0) >= 75) {
            details.push({
                impact: 0.22,
                text: `Getting this kind of top roll on melee defense for ${getArchetypeReference(archetype, "object")} absolutely makes it a top-tier melee shield.`,
            });
        } else if ((meleeDefensePercentile ?? 0) >= 50) {
            details.push({
                impact: 0.12,
                text: `Getting a good roll like this on melee defense for ${getArchetypeReference(archetype, "object")} makes it a very solid melee shield.`,
            });
        }

        return details;
    }

    if (role === "melee_good") {
        if ((meleeDefensePercentile ?? 0) >= 30 && (durabilityPercentile ?? 0) >= 30) {
            details.push({
                impact: (meleeDefensePercentile ?? 0) >= 75 && (durabilityPercentile ?? 0) >= 75 ? 0.24 : 0.16,
                text: `${getArchetypeReference(archetype, "subject")} needs both melee defense and durability to stand out, and this shield rolled well on both!`,
            });
        } else {
            details.push({
                impact: 0,
                text: `${getArchetypeReference(archetype, "subject")} has a low durability base, so it needs good rolls in both durability and melee defense truly be a great shield.`,
            });
        }

        return details;
    }

    if (role === "ranged") {
        if ((rangedDefensePercentile ?? 0) >= 75) {
            details.push({
                impact: 0.26,
                text: `Getting this kind of top roll on ranged defense for ${getArchetypeReference(archetype, "object")} absolutely makes it a top-tier ranged shield.`,
            });
        } else if ((rangedDefensePercentile ?? 0) >= 50) {
            details.push({
                impact: 0.16,
                text: `Getting this kind of good roll on ranged defense for ${getArchetypeReference(archetype, "object")} makes it a very solid ranged shield.`,
            });
        }

        return details;
    }

    return details;
};

const getArchetypeCeiling = (archetype: Archetype) => {
    return archetypeCeilings[archetype.id];
};

const getArchetypeContextEntries = (
    archetype: Archetype,
    categoryId: CategoryId,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    rowSummaries: RowSummary[],
) => {
    const details: DetailEntry[] = [];

    switch (archetype.id) {
        case "spear":
            details.push({
                impact: -0.18,
                text: `${getArchetypeReference(archetype, "subject")} has a limited late-game ceiling, though it can still be an excellent early weapon if you happen to find it within the first 30 days or so.`,
            });
            break;
        case "goblin_skewer":
        case "goblin_falchion":
            details.push({
                impact: -0.28,
                text: "Even with good rolls, goblin weapons often do less damage than the standard human alternatives (the exception being the Jagged Pike, which offers more flexibility than human polearms with its 5ap attack).",
            });
            break;
        case "bow_goblin":
            details.push({
                impact: -0.28,
                text: `Even a top-rolled ${getArchetypeReference(archetype, "subject")} still does less damage than a normal warbow, and has less range. It's worth some gold though.`,
            });
            break;
        case "orc_heavy":
            details.push({
                impact: -0.5,
                text: "The orc heavy shield costs so much fatigue that its defenses just don't justify using it.",
            });
            break;
        case "metal_heater":
        case "gold_round":
        case "sipar":
            details.push({
                impact: 0.12,
                text: `${getArchetypeReference(archetype, "subject")} is one of the best shield bases for melee.`,
            });
            break;
        case "spetum":
            details.push({
                impact: -0.1,
                text: "Spetums are considered pretty bad weapons, so even good rolls make it something that still might not be worth using.",
            });
            break;
    }

    if (categoryId === "armor" || categoryId === "helmet") {
        details.push(...getArmorClassificationEntries(archetype, categoryId, legendaryStats, defaultLegendaryStats));
    }

    if (categoryId === "shield") {
        details.push(...getShieldContextEntries(archetype, rowSummaries));
    }

    details.push(...getThrowingWeaponEntries(archetype, legendaryStats, defaultLegendaryStats));

    return details;
};

const getUseRecommendationDetail = (
    archetype: Archetype,
    percentile: number,
    rowSummaries: RowSummary[],
) => {
    const premiumRowCount = rowSummaries.filter((summary) => summary.preference.tier === "premium").length;

    switch (archetype.id) {
        case "orc_heavy":
            return "Congrats, you found an ornament for the wagon!";
        case "spear":
            return percentile >= 70
                ? "This one is worth using if you find it early, but not something to plan around for the late game."
                : "This one is usually not worth using unless you need an early spear.";
        case "spetum":
        case "goblin_skewer":
        case "goblin_falchion":
        case "bow_goblin":
            return null;
        default:
            if (premiumRowCount >= 2) {
                return `${getArchetypeReference(archetype, "subject")} rolled two of its top-tier stats. That alone makes it rare and almost certainly worth using.`;
            }

            if (percentile >= 70) {
                return "This rolled well and is a very solid improvement on the standard equivalent.";
            }

            return "Even if this didn't roll amazingly well, it's still better than the standard equivalent.";
    }
};

const getRatingPercentile = (utilityScore: number) => {
    if (utilityScore <= 0) {
        return 0;
    }

    return clamp(Math.round(100 * (1 - Math.exp(-1.85 * utilityScore))), 0, 100);
};

const getPremiumThresholdBonus = (
    premiumPercentiles: number[],
) => {
    if (premiumPercentiles.length === 0) {
        return 0;
    }

    const averagePremiumPercentile =
        premiumPercentiles.reduce((sum, percentile) => sum + percentile, 0) / premiumPercentiles.length;
    const lowestPremiumPercentile = Math.min(...premiumPercentiles);

    if (premiumPercentiles.length >= 2) {
        if (averagePremiumPercentile >= 75 && lowestPremiumPercentile >= 65) {
            return 6;
        }

        if (averagePremiumPercentile >= 50 && lowestPremiumPercentile >= 45) {
            return 4;
        }

        return 0;
    }

    return premiumPercentiles[0] >= 75 ? 5 : 0;
};

export const getOverallRating = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    categoryId: CategoryId,
): RatingResult => {
    if (categoryId === "armor" || categoryId === "helmet") {
        return getArmorOrHelmetRating(archetype, categoryId, legendaryStats, defaultLegendaryStats);
    }

    const modifiedRows = getValidModifiedRows(archetype, legendaryStats, defaultLegendaryStats);
    const suppressStatSummaries = archetype.id === "orc_heavy";

    if (modifiedRows.length === 0) {
        return { details: [], label: "Unrated", percentile: 0, ratedRowCount: 0 };
    }

    const rowSummaries = suppressStatSummaries ? [] : modifiedRows.flatMap((definition): RowSummary[] => {
        const percentile = getRowPercentile(definition, archetype, legendaryStats, defaultLegendaryStats);
        if (percentile === undefined) {
            return [];
        }

        const preference = getStatPreference(
            archetype,
            categoryId,
            definition.id as RowId,
            legendaryStats,
            defaultLegendaryStats,
        );
        const utility = getUtilityForPreference(preference, percentile);

        return [
            {
                percentile,
                preference,
                impact: utility,
                rowId: definition.id as RowId,
                text: getDetailText(
                    rowLabelById[definition.id as RowId],
                    percentile,
                    preference,
                    getArchetypeReference(archetype, "object"),
                ),
            },
        ];
    });

    const detailEntries = rowSummaries.map(({ impact, text }) => ({
        impact,
        text,
    }));

    detailEntries.push(...getArchetypeContextEntries(archetype, categoryId, legendaryStats, defaultLegendaryStats, rowSummaries));

    const totalUtility = detailEntries.reduce((sum, entry) => sum + entry.impact, 0);
    const ceiling = getArchetypeCeiling(archetype);
    const premiumPercentiles = rowSummaries
        .filter((summary) => summary.preference.tier === "premium")
        .map((summary) => summary.percentile);
    const uncappedPercentile = clamp(
        getRatingPercentile(totalUtility) + getPremiumThresholdBonus(premiumPercentiles),
        0,
        100,
    );
    const percentile = ceiling === undefined ? uncappedPercentile : Math.min(uncappedPercentile, ceiling);
    const label = ratingTiers.find((tier) => percentile >= tier.minimum)?.label || "Poor";
    const details = detailEntries
        .sort((left, right) => right.impact - left.impact)
        .map((entry) => entry.text);
    const recommendationDetail = getUseRecommendationDetail(archetype, percentile, rowSummaries);
    recommendationDetail && details.push(recommendationDetail);

    return {
        details,
        label,
        percentile,
        ratedRowCount: modifiedRows.length,
    };
};

export const isAppraisalComplete = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    categoryId: CategoryId,
) => {
    const modifiedRowIds = getValidModifiedRows(archetype, legendaryStats, defaultLegendaryStats).map(
        (definition) => definition.id,
    );
    const nonDurabilityModifiedCount = modifiedRowIds.filter((rowId) => rowId !== "durability").length;

    if (categoryId === "shield") {
        return modifiedRowIds.length >= 2;
    }

    if (categoryId === "armor" || categoryId === "helmet") {
        return modifiedRowIds.includes("durability") && modifiedRowIds.includes("fatigue");
    }

    return nonDurabilityModifiedCount >= 2;
};

export const getArchetypeSubtitle = (archetype: Archetype) => {
    if ("meleeDefenseMin" in archetype) {
        return "Named Shield";
    }
    if ("accuracyMin" in archetype || "ammoMin" in archetype) {
        return "Named Ranged Weapon";
    }
    if ("minimumDamageMin" in archetype && "maximumDamageMin" in archetype) {
        return "Named Weapon";
    }
    if ("fatigueMin" in archetype) {
        return "Named Armor";
    }

    return "Named Item";
};

export const getCompletedAppraisalLine = (rating: RatingResult) => {
    switch (rating.label) {
        case "Godly":
            return "By the gods, that's wicked good work. A real beaut. Do right by her and she'll keep yeh sitting pretty--that she will.";
        case "Excellent":
            return "Aye, that's real fine work. Far better than most that yeh see, and I've seen plenty.";
        case "Strong":
            return "Yeh have a good, solid piece here. The sort of thing folk'll brag to strangers about after an ale or two. Not that I recommend doing that.";
        case "Good":
            return "Strong piece, that. Not blessed by saints, maybe, but it'll keep yeh breathing.";
        case "Average":
            return "Middle sort of piece. Won't make a song, won't make a funeral either. Least, not straightaway.";
        case "Weak":
            return "Well it's a bit of an antique innit it? It'll serve better than the standard cruft--but only just.";
        default:
            return "Named, sure. So's a pig if yeh shout at it long enough. Use it if you like, but don't expect much from it.";
    }
};

export const getRatingDetails = (rating: RatingResult) => {
    return rating.details;
};

export const getIncompleteBarkeepPrompt = (
    categoryId: CategoryId,
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    const modifiedRowIds = getValidModifiedRows(archetype, legendaryStats, defaultLegendaryStats).map(
        (definition) => definition.id,
    );
    const nonDurabilityModifiedCount = modifiedRowIds.filter((rowId) => rowId !== "durability").length;

    if (categoryId === "shield") {
        if (modifiedRowIds.length === 0) {
            return "For a shield, I need two rolled marks.";
        }

        return "Good. Now tell me one more rolled mark. A shield's more than a door with opinions. Most of the time.";
    }

    if (categoryId === "armor" || categoryId === "helmet") {
        const missingDurability = !modifiedRowIds.includes("durability");
        const missingFatigue = !modifiedRowIds.includes("fatigue");

        if (missingDurability || missingFatigue) {
            return "For armor, I need both the durability and the fatigue burden. Kit that saves yeh and kills yeh tired is still trying to kill yeh.";
        }
    }

    if (nonDurabilityModifiedCount === 0) {
        return "Give me two more rolled marks. Wouldn't want to judge a blade by its scabbard.";
    }

    return "One more line, then.";
};
