//weapons
//tools
//shields
//helmets
//consumables
//armors
//ammo
//accessories
//blazing deserts
//bugged items
import {STR64} from '../../url';

// Accidentally shipped a bug where the generated IDs had a fencepost error. I need to keep them
// in the list to preserve the relative ordering of the hashed ids, but don't want to create
// duplicates... so now those items are named this:
const bugRemnant = "derp";

const itemNames = [
    "Ancient Spear",
    "Ancient Sword",
    "Antler Cleaver",
    "Arming Sword",
    "Axehammer",
    "Bardiche",
    "Battle Whip",
    "Billhook",
    "Ancient Bladed Pike",
    "Bludgeon",
    "Blunt Cleaver",
    "Boar Spear",
    "Broken Ancient Sword",
    "Broken Ancient Bladed Pike",
    "Butcher's Cleaver",
    "Claw Club",
    "Crossbow",
    "Crude Axe",
    "Crypt Cleaver",
    "Dagger",
    "Drum",
    "Falchion",
    "Falx",
    "Fencing Sword",
    "Fighting Axe",
    "Fighting Spear",
    "Flail",
    "Boondock Bow",
    "Spiked Impaler",
    "Cruel Falchion",
    "Reinforced Boondock Bow",
    "Notched Blade",
    "Jagged Pike",
    "Goblin Skewer",
    "Bundle of Spiked Bolas",
    "Gnarly Staff",
    "Goedendag",
    "Greataxe",
    "Greatsword",
    "Handaxe",
    "Hatchet",
    "Heavy Crossbow",
    "Bundle of Heavy Javelins",
    "Heavy Rusty Axe",
    "Bundle of Heavy Throwing Axes",
    "Hooked Blade",
    "Hunting Bow",
    "Bundle of Javelins",
    "Khopesh",
    "Knife",
    "Reproach of the Old Gods",
    "Light Crossbow",
    "Longaxe",
    "Longsword",
    "Lute",
    "Masterwork Bow",
    "Military Cleaver",
    "Military Pick",
    "Militia Spear",
    "Morning Star",
    "Noble Sword",
    "Obsidian Dagger",
    "Head Splitter",
    "Man Splitter",
    `Head Chopper ${bugRemnant}`,
    "Berserk Chain",
    "Bundle of Crude Javelins",
    "Cudgel",
    "Tree Limb",
    "Pickaxe",
    "Pike",
    "Pitchfork",
    "Battle Standard",
    "Polehammer",
    "Reinforced Wooden Flail",
    "Rhomphaia",
    "Rondel Dagger",
    "Rusty Warblade",
    "Scimitar",
    "Scramasax",
    "Shamshir",
    "Shortsword",
    "Short Bow",
    "Two-Handed Skull Hammer",
    "Spetum",
    "Staff Sling",
    "Thorned Whip",
    "Three-Headed Flail",
    "Bundle of Throwing Axes",
    "Throwing Spear",
    "Two-handed Flail",
    "Two-Handed Flanged Mace",
    "Two-Handed Hammer",
    "Two-Handed Mace",
    "Two-Handed Spiked Mace",
    "Two-handed Wooden Flail",
    "Two-Handed Mallet",
    "Warbrand",
    "Warfork",
    "Warhammer",
    "Warscythe",
    "War Bow",
    "Winged Mace",
    "Wonky Bow",
    "Woodcutter's Axe",
    "Wooden Flail",
    "Wooden Stick",
    "Acid Flask",
    "Flask of Blessed Water",
    "Reinforced Throwing Net",
    "Throwing Net",
    "Ancient Auxiliary Shield",
    "Buckler",
    "Ancient Coffin Shield",
    "Kraken Shield",
    "Lindwurm Shield",
    "Living Tree Shield",
    "Reinforced Skirmisher Shield",
    "Wooden Skirmisher Shield",
    "Heater Shield",
    "Kite Shield",
    "Heavy Metal Shield",
    "Feral Shield",
    "Ancient Tower Shield",
    "Wooden Shield",
    "Old Wooden Shield",
    "Decayed Heater Shield",
    "Worn Kite Shield",
    `Aketon Cap ${bugRemnant}`,
    "Ancient Honor Guard Helmet",
    "Ancient Household Helmet",
    "Ancient Legionary Helmet",
    "Barbute Helmet",
    "Bascinet with Mail",
    "Bear Headpiece",
    "Beastmaster's Headpiece",
    "Closed Flat Top Helmet",
    "Closed Flat Top with Mail",
    "Closed and Padded Flat Top",
    "Closed Mail Coif",
    "Closed Scrap Metal Helmet",
    "Conic Helmet with Closed Mail",
    "Conic Helmet with Faceguard",
    "Crude Faceguard Helmet",
    "Crude Metal Helmet",
    "Cultist Hood",
    "Cultist Leather Hood",
    "Dark Cowl",
    "Decayed Closed Flat Top with Mail",
    "Covered Decayed Closed Flat Top with Mail",
    "Decayed Full Helm",
    "Decayed Great Helm",
    "Padded Dented Nasal Helmet",
    "The Emperor's Countenance",
    "Decorated Full Helm",
    "Feathered Hat",
    "Flat Top Helmet",
    "Flat Top with Closed Mail",
    "Flat Top with Mail",
    "Full Aketon Cap",
    "Full Helm",
    "Full Leather Cap",
    "Zweihander's Helmet",
    "Duelist's Hat",
    "Headscarf",
    "Heavy Horned Plate Helmet",
    "Hood",
    "Hunter's Hat",
    "Helmet of the Ijirok",
    "Jester's Hat",
    "Kettle hat",
    "Kettle Hat with Closed Mail",
    "Kettle Hat with Mail",
    "Leather Headband",
    "Leather Helmet",
    "Mail Coif",
    "Glimpse of Davkul",
    "Mouth Piece",
    "Nasal Helmet",
    "Nasal Helmet with Closed Mail",
    "Nasal Helmet with Mail",
    "Nasal Helmet With Rusty Mail",
    "Nordic Helmet",
    "Nordic Helmet with Closed Mail",
    "Open Leather Cap",
    "Padded Flat Top Helmet",
    "Padded Kettle hat",
    "Padded Nasal Helmet",
    "Reinforced Mail Coif",
    "Rusty Mail Coif",
    "Sallet Helmet",
    "Steppe Helmet with Mail",
    `Straw Hat ${bugRemnant}`,
    "Witchhunter's Hat",
    "Wizard's Hat",
    "Antidote",
    "Bandages",
    "Strange Mushrooms",
    "Cat Potion",
    "Iron Will Potion",
    "Lionheart Potion",
    "Night Owl Elixir",
    "Goblin Poison",
    "Second Wind Potion",
    "Poisoned Oil",
    "Ancient Breastplate",
    "Ancient Double Layer Mail",
    "Ancient Mail",
    "Ancient Plated Mail Hauberk",
    "Ancient Plated Scale Hauberk",
    "Ancient Plate Harness",
    "Ancient Scale Coat",
    "Ancient Scale Harness",
    "Animal Hide Armor",
    "Apron",
    "Aspect of Davkul",
    "Basic Mail Shirt",
    "Blotched Gambeson",
    "Butcher's Apron",
    "Coat of Plates",
    "Coat of Scales",
    "Cultist Leather Robe",
    "Decayed Coat of Plates",
    "Decayed Coat of Scales",
    "Decayed Reinforced Mail Hauberk",
    "The Emperor's Armor",
    "Footman's Armor",
    "Gambeson",
    "Heavy Iron Armor",
    "Heavy Lamellar Armor",
    "Heraldic Mail",
    "Hide and Bone Armor",
    "Armor of the Ijirok",
    "Lamellar Harness",
    "Leather Lamellar Armor",
    "Leather Scale Armor",
    "Leather Tunic",
    "Leather Wraps",
    "Light Scale Armor",
    "Linen Tunic",
    "Mail Hauberk",
    "Mail Shirt",
    "Monk's Robe",
    "Noble Mail",
    "Noble Tunic",
    "Padded Leather",
    "Padded Surcoat",
    "Patched Mail Shirt",
    "Dark Rugged Surcoat",
    "Rugged Surcoat",
    "Reinforced Animal Hide Armor",
    "Reinforced Mail Hauberk",
    "Rugged Scale Armor",
    "Sackcloth",
    "Scale Armor",
    "Scrap Metal Armor",
    `Sellsword's Armor ${bugRemnant}`,
    "Tattered Sackcloth",
    "Dark Thick Tunic",
    "Thick Furs",
    "Thick Plated Barbarian Armor",
    "Thick Tunic",
    "Direwolf Hide Armor",
    "Direwolf Mail Armor",
    "Wizard's Robe",
    "Worn Mail Shirt",
    "Large Quiver of Arrows",
    "Large Quiver of Bolts",
    "Quiver of Arrows",
    "Quiver of Bolts",
    "Alp Trophy Necklace",
    "Armored Wardog",
    "Armored Warhound",
    "Cursed Crystal Skull",
    "Falcon",
    "Nachzehrer Trophy Necklace",
    "Goblin Trophy",
    "Heavily Armored Wardog",
    "Heavily Armored Warhound",
    "Hexen Trophy Necklace",
    "Orc Trophy",
    "Sergeant's Sash",
    "Undead Trophy",
    "Wardog",
    "Unleash Warhound",
    "Warwolf",
    "Composite Bow",
    "Fire Lance",
    "Handgonne",
    "Heavy Southern Mace",
    "Light Southern Mace",
    "Nomad Mace",
    "Nomad Sling",
    "Polemace",
    "Qatal Dagger",
    "Saif",
    "Swordlance",
    "Two-Handed Saif",
    "Two-Handed Scimitar",
    "Flash Pot",
    "Fire Pot",
    "Smoke Pot",
    "Assassin's Face Mask",
    "Assassin's Head Wrap",
    "Blade Dancer's Head Wrap",
    "Desert Stalker's Head Wrap",
    "Engineer's Hat",
    "Gladiator Helmet",
    "Gunner's Hat",
    "Heavy Lamellar Helmet",
    "Leather Head Wrap",
    "Nomad Head Wrap",
    "Nomad Leather Cap",
    "Nomad Light Helmet",
    "Nomad Reinforced Helmet",
    "Southern Head Wrap",
    "Southern Helmet with Coif",
    "Spiked Skull Cap with Mail",
    "Turban Helmet",
    "Wrapped Southern Helmet",
    "Large Powder Bag",
    "Powder Bag",
    // Give bugged items a new id
    "Head Chopper",
    "Aketon Cap",
    "Straw Hat",
    "Sellsword's Armor",
]

export const generateItemsToId = () => {
    const itemsById: { [key: string]: string; } = {};
    const idsByItem: { [key: string]: string; } = {};
    for (let i = 1; i <= itemNames.length; i++) {
        let id = "";
        let remainingI = i;
        let secondStr64DigitIndex = 0;
        while(remainingI >= 0) {
            if (Math.floor(remainingI / STR64.length) <= 0) {
                id += STR64[secondStr64DigitIndex];
                id += STR64[remainingI % STR64.length];
            }
            remainingI -= STR64.length;
            secondStr64DigitIndex += 1;
        }

        itemsById[id] = itemNames[i];
        idsByItem[itemNames[i]] = id;
    }
    console.log(itemsById);
    console.log(idsByItem);
}