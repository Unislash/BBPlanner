import type { Accessory, Ammo, Bag, Consumable, Offhand, Shield, Tool, Weapon } from "../types/models";
import accessoriesJson from "./accessories.json";
import ammoJson from "./ammo.json";
import armorsJson from "./armors.json";
import consumablesJson from "./consumables.json";
import helmetsJson from "./helmets.json";
import shieldsJson from "./shields.json";
import toolsJson from "./tools.json";
import weaponsJson from "./weapons.json";

export const TWO_HANDED_WEAPON = "TwoHanded";
export const ONE_HANDED_WEAPON = "OneHanded";

export const EMPTY_NAME = "(Empty)";

const emptyItem = {
    id: "",
    name: EMPTY_NAME,
    imageName: "",
};

interface JsonItem {
    chanceToHitHead?: string;
    conditionMax?: string;
    rangeMax?: string;
    shieldDamage?: string;
    staminaModifier?: string;
}

export const helmets = Object.values(helmetsJson).map((jsonItem: JsonItem & Record<string, string>) => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.helmetIcon,
    description: jsonItem.description,
    conditionMax: jsonItem.conditionMax,
    value: jsonItem.value,
    // items with no stamina cost don't have a staminaModifier :-(
    staminaModifier: jsonItem.staminaModifier ?? "",
}));
helmets.unshift({
    ...emptyItem,
    description: "",
    conditionMax: "",
    value: "",
    staminaModifier: "",
});

export const armor = Object.values(armorsJson).map((jsonItem: JsonItem & Record<string, string>) => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.armorIcon,
    description: jsonItem.description,
    conditionMax: jsonItem.conditionMax,
    value: jsonItem.value,
    // items with no stamina cost don't have a staminaModifier :-(
    staminaModifier: jsonItem.staminaModifier ?? "",
}));
armor.unshift({
    ...emptyItem,
    description: "",
    conditionMax: "",
    value: "",
    staminaModifier: "",
});

export const accessories: Accessory[] = Object.values(accessoriesJson).map((jsonItem) => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.accessoryIcon,
    description: jsonItem.description,
}));
accessories.unshift({
    ...emptyItem,
    description: "",
});

export const weapons: Weapon[] = Object.values(weaponsJson).map((jsonItem: JsonItem & Record<string, string>) => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.armamentIcon,
    handType: jsonItem.handType,
    description: jsonItem.description,
    value: jsonItem.value,
    regularDamage: jsonItem.regularDamage,
    regularDamageMax: jsonItem.regularDamageMax,
    armorDamageMult: jsonItem.armorDamageMult,
    directDamageMult: jsonItem.directDamageMult,
    // not all weapons can damage shields
    shieldDamage: jsonItem.shieldDamage,
    // not all weapons add a chance to hit head
    chanceToHitHead: jsonItem.chanceToHitHead,
    // only range weapons have rangeMax
    rangeMax: jsonItem.rangeMax,
    // some weapons, such as throwing weapons, don't have durability
    conditionMax: jsonItem.conditionMax || "",
    // items with no stamina cost don't have a staminaModifier :-(
    staminaModifier: jsonItem.staminaModifier || "",
}));
weapons.unshift({
    ...emptyItem,
    description: "",
    value: "",
    conditionMax: "",
    staminaModifier: "",
    regularDamage: "",
    regularDamageMax: "",
    armorDamageMult: "",
    directDamageMult: "",
    shieldDamage: "",
    chanceToHitHead: "",
    rangeMax: "",
    handType: ONE_HANDED_WEAPON,
});

export const ammo: Ammo[] = Object.values(ammoJson).map((jsonItem) => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.ammoIcon,
    value: jsonItem.value,
    description: jsonItem.description,
}));
ammo.unshift({
    ...emptyItem,
    value: "",
    description: "",
});

export const shields: Shield[] = Object.values(shieldsJson).map((jsonItem) => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.shieldIcon,
    description: jsonItem.description,
    conditionMax: jsonItem.conditionMax,
    meleeDefense: jsonItem.meleeDefense,
    rangedDefense: jsonItem.rangedDefense,
    value: jsonItem.value,
    staminaModifier: jsonItem.staminaModifier,
}));

export const tools: Tool[] = Object.values(toolsJson).map((jsonItem: JsonItem & Record<string, string>) => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.toolIcon,
    value: jsonItem.value,
    // only some tools have a staminaModifier (like nets)
    staminaModifier: jsonItem.staminaModifier || "",
    description: jsonItem.description,
}));

export const offhandItems: Offhand[] = [...shields, ...tools];
offhandItems.unshift({
    ...emptyItem,
    description: "",
    value: "",
    staminaModifier: "",
});

export const consumables: Consumable[] = Object.values(consumablesJson).map((jsonItem) => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.accessoryIcon,
    description: jsonItem.description,
}));

export const bags: Bag[] = [
    ...consumables,
    ...weapons.map((weapon) => ({
        ...weapon,
        imageName: `${weapon.imageName}_70x70`,
    })),
    ...shields.map((shield) => ({
        ...shield,
        imageName: shield.imageName.replace("inventory", "icon"),
    })),
    ...tools.map((tool) => ({
        ...tool,
        imageName: `${tool.imageName.replace("inventory_", "")}_70x70`,
    })),
    ...ammo,
];
bags.unshift({
    ...emptyItem,
    description: "",
});
