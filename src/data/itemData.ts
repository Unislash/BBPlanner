import helmetsJson from './helmets.json';
import armorsJson from './armors.json';
import weaponsJson from './weapons.json';
import accessoriesJson from './accessories.json';
import consumablesJson from './consumables.json';
import shieldsJson from './shields.json';
import toolsJson from './tools.json';
import ammoJson from './ammo.json';

export const TWO_HANDED_WEAPON = "TwoHanded";
export const ONE_HANDED_WEAPON = "OneHanded";

const emptyItem = {
    id: "",
    name: "(Empty)",
    imageName: ""
}

export const helmets = Object.values(helmetsJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.helmetIcon
}));
helmets.unshift(emptyItem);

export const armor = Object.values(armorsJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.armorIcon
}));
armor.unshift(emptyItem);

export const accessories = Object.values(accessoriesJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.accessoryIcon
}));
accessories.unshift(emptyItem);

export const weapons = Object.values(weaponsJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.armamentIcon,
    handType: jsonItem.handType,
}));
weapons.unshift({
    ...emptyItem,
    handType: ONE_HANDED_WEAPON,
});

export const ammo = Object.values(ammoJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.ammoIcon
}));
ammo.unshift(emptyItem);

export const shields = Object.values(shieldsJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.shieldIcon
}));

export const tools = Object.values(toolsJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.toolIcon
}));

export const offhandItems = shields.concat(tools);
offhandItems.unshift(emptyItem);

export const bags = Object.values(consumablesJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.accessoryIcon
})).concat(Object.values(weaponsJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.armamentIcon + "_70x70"
}))).concat(Object.values(shieldsJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.shieldIcon.replace("inventory", "icon")
}))).concat(Object.values(toolsJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.toolIcon + "_70x70"
}))).concat(Object.values(ammoJson).map(jsonItem => ({
    id: jsonItem.name,
    name: jsonItem.name,
    imageName: jsonItem.ammoIcon
})));
bags.unshift(emptyItem);