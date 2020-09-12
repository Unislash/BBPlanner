import {
    Accessory,
    Ammo,
    Armor,
    Bag,
    Helmet, instanceOfShield,
    instanceOfWeapon,
    LoadoutItem,
    LoadoutSlotType,
    Offhand,
    Weapon,
} from '../../models';
import React from 'react';
import styled from '@emotion/styled';
import armor_body from '../../images/loadoutInfo/armor_body.png';
import armor_head from '../../images/loadoutInfo/armor_head.png';
import money from '../../images/loadoutInfo/money.png';
import fatigue from '../../images/loadoutInfo/fatigue.png';
import asset_supplies from '../../images/loadoutInfo/asset_supplies.png';
import regular_damage from '../../images/loadoutInfo/regular_damage.png';
import direct_damage from '../../images/loadoutInfo/direct_damage.png';
import armor_damage from '../../images/loadoutInfo/armor_damage.png';
import chance_to_hit_head from '../../images/loadoutInfo/chance_to_hit_head.png';
import melee_defense from '../../images/loadoutInfo/melee_defense.png';
import ranged_defense from '../../images/loadoutInfo/ranged_defense.png';
import shield_damage from '../../images/loadoutInfo/shield_damage.png';
import vision from '../../images/loadoutInfo/vision.png';

interface LoadoutTooltipProps {
    loadoutSlotType: LoadoutSlotType;
    item: LoadoutItem;
}

const Title = styled.div`
    font-family: 'Cinzel-Bold', sans-serif;
    font-size: 16px;
`;

const Description = styled.div`
    font-style: italic;
    padding: 1px 0 4px 0;
    margin-bottom: 3px; 
`;

const StatLine = styled.div`
    display: flex;
    align-items: center;
`;

const MoneyIcon = styled.img`
    height: 10px;
`;

const StatIcon = styled.img`
    height: 20px;
    margin-right: 6px;
`;

const AccessoryContent: React.FC<{item: Accessory}> = ({item}) => (
    <>
        <Title>{item.name}</Title>
        <Description>{item.description}</Description>
    </>
);

const HelmetContent: React.FC<{item: Helmet}> = ({item}) => (
    <>
        <Title>{item.name}</Title>
        <Description>{item.description}</Description>
        <StatLine>Worth&nbsp;&nbsp;<MoneyIcon src={money}/>&nbsp;<b>{item.value}</b></StatLine>
        <StatLine><StatIcon src={armor_head}/><b>{item.conditionMax}</b> &nbsp;maximum durability</StatLine>
        {item.staminaModifier && <StatLine><StatIcon src={fatigue}/>Maximum Fatigue&nbsp;<b>{item.staminaModifier}</b></StatLine>}
    </>
);

const ArmorContent: React.FC<{item: Armor}> = ({item}) => (
    <>
        <Title>{item.name}</Title>
        <Description>{item.description}</Description>
        <StatLine>Worth&nbsp;&nbsp;<MoneyIcon src={money}/>&nbsp;<b>{item.value}</b></StatLine>
        <StatLine><StatIcon src={armor_body}/><b>{item.conditionMax}</b> &nbsp;maximum durability</StatLine>
        {item.staminaModifier && <StatLine><StatIcon src={fatigue}/>Maximum Fatigue&nbsp;<b>{item.staminaModifier}</b></StatLine>}
    </>
);

const WeaponContent: React.FC<{item: Weapon}> = ({item}) => (
    <>
        <Title>{item.name}</Title>
        <Description>{item.description}</Description>
        <StatLine>Worth&nbsp;&nbsp;<MoneyIcon src={money}/>&nbsp;<b>{item.value}</b></StatLine>
        <StatLine><StatIcon src={asset_supplies}/><b>{item.conditionMax}</b> &nbsp;maximum durability</StatLine>
        <StatLine><StatIcon src={regular_damage}/>Damage of&nbsp;<b>{item.regularDamage} - {item.regularDamageMax}</b></StatLine>
        <StatLine><StatIcon src={direct_damage}/><b>{Math.round(parseFloat(item.directDamageMult) * 100)}%</b>&nbsp;of damage ignores armor</StatLine>
        <StatLine><StatIcon src={armor_damage}/><b>{Math.round(parseFloat(item.armorDamageMult) * 100)}%</b>&nbsp;effective against armor</StatLine>
        {item.chanceToHitHead && <StatLine><StatIcon src={chance_to_hit_head}/>Chance to hit head&nbsp;<b>+{item.chanceToHitHead}%</b></StatLine>}
        {item.rangeMax && <StatLine><StatIcon src={vision}/>Range of&nbsp;<b>{item.rangeMax}</b>&nbsp;tiles</StatLine>}
        {/*for some reason, some weapons have a shieldDamage of 0...*/}
        {!!parseInt(item.shieldDamage) && <StatLine><StatIcon src={shield_damage}/>Shield damage of&nbsp;<b>{item.shieldDamage}</b></StatLine>}
        {item.staminaModifier && <StatLine><StatIcon src={fatigue}/>Maximum Fatigue&nbsp;<b>{item.staminaModifier}</b></StatLine>}
    </>
);

const AmmoContent: React.FC<{item: Ammo}> = ({item}) => (
    <>
        <Title>{item.name}</Title>
        <Description>{item.description}</Description>
        <StatLine>Worth&nbsp;&nbsp;<MoneyIcon src={money}/>&nbsp;<b>{item.value}</b></StatLine>
    </>
);

const OffhandContent: React.FC<{item: Offhand}> = ({item}) => (
    <>
        <Title>{item.name}</Title>
        <Description>{item.description}</Description>
        <StatLine>Worth&nbsp;&nbsp;<MoneyIcon src={money}/>&nbsp;<b>{item.value}</b></StatLine>
        {"conditionMax" in item && <StatLine><StatIcon src={asset_supplies}/><b>{item.conditionMax}</b> &nbsp;maximum durability</StatLine>}
        {"meleeDefense" in item && <StatLine><StatIcon src={melee_defense}/>Melee Defense&nbsp;<b>+{item.meleeDefense}</b></StatLine>}
        {"rangedDefense" in item && <StatLine><StatIcon src={ranged_defense}/>Ranged Defense&nbsp;<b>+{item.rangedDefense}</b></StatLine>}
        {item.staminaModifier && <StatLine><StatIcon src={fatigue}/>Maximum Fatigue&nbsp;<b>{item.staminaModifier}</b></StatLine>}
    </>
);

const BagContent: React.FC<{item: Bag}> = ({item}) => {
    if (instanceOfWeapon(item)) {
        return <WeaponContent item={item} />;
    } else if (instanceOfShield(item)) {
        return <OffhandContent item={item} />;
    } else {
        return (<>
            <Title>{item.name}</Title>
            <Description>{item.description}</Description>
            {"value" in item && <StatLine>Worth&nbsp;&nbsp;<MoneyIcon src={money}/>&nbsp;<b>{item.value}</b></StatLine>}
        </>);
    }
};

const switchOnSlotType = (loadoutSlotType: LoadoutSlotType, item: LoadoutItem) => {
    switch(loadoutSlotType){
        case "accessories":
            return <AccessoryContent item={item as Accessory} />;
        case "weapons":
            return <WeaponContent item={item as Weapon} />;
        case "helmets":
            return <HelmetContent item={item as Helmet} />;
        case "armor":
            return <ArmorContent item={item as Armor} />;
        case "ammo":
            return <AmmoContent item={item as Ammo} />;
        case "offhandItems":
            return <OffhandContent item={item as Offhand} />;
        case "bags1":
        case "bags2":
        case "bags3":
        case "bags4":
            return <BagContent item={item as Bag} />;
        default:
            return null;
    }
}

export const LoadoutTooltip: React.FC<LoadoutTooltipProps> = ({loadoutSlotType, item}) => (
    <div>
        {switchOnSlotType(loadoutSlotType, item)}
    </div>
);