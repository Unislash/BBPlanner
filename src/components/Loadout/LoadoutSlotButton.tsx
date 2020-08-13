/** @jsx jsx */

import * as React from 'react';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import {LoadoutSlotType} from '../../models';

import inventory_slot_accessory from "../../images/items/inventory_slot_accessory.png";
import inventory_slot_mainhand from "../../images/items/inventory_slot_mainhand.png"
import inventory_slot_helmet from "../../images/items/inventory_slot_helmet.png"
import inventory_slot_body from "../../images/items/inventory_slot_body.png"
import inventory_slot_ammo from "../../images/items/inventory_slot_ammo.png"
import inventory_slot_offhand from "../../images/items/inventory_slot_offhand.png"
import inventory_slot_bag from "../../images/items/inventory_slot_bag.png"

const buttonResetStyles = `
    text-transform: none; // Remove inheritance of text transform in Firefox
    overflow: visible; // Show overflow in Edge
    margin: 0; // Remove margin in Firefox and Safari
    padding: 0; // Remove padding in webkit
    outline: none; // Remove default focus outline in various browsers
    font-family: inherit; // Ensure we inherit from parent since many browsers override this in user-agent stylesheet.

    &::-moz-focus-inner {
        border: 0;
        margin: 0;
        padding: 0;
    }
`;

type ItemImageMap = { [key: string]: string; };

export interface LoadoutSlotButtonProps {
    loadoutSlotType: LoadoutSlotType;
    onClick?: () => void;
    imageName?: string;
}

export const LoadoutSlotButton: React.FC<LoadoutSlotButtonProps> = props => {
    const [itemImageMap, setItemImageMap] = useState<ItemImageMap | undefined>(undefined);

    useEffect(() => {
        async function getItemImageMap() {
            return import(/* webpackPrefetch: true */ /* webpackChunkName: "itemImageMap" */ './itemImageMap')
                .then(({default: itemImageMap}: any) => {
                    setItemImageMap(itemImageMap);
                })
                .catch(() => 'An error occurred while loading item image map');
        }

        getItemImageMap();
    }, []);

    return (
        <StyledLoadoutSlotButton {...props} itemImageMap={itemImageMap} />
    );
};

const slotBackgroundMap: { [key in LoadoutSlotType]: string; } = {
    "accessories" : inventory_slot_accessory,
    'weapons': inventory_slot_mainhand,
    'helmets': inventory_slot_helmet,
    'armor': inventory_slot_body,
    'ammo': inventory_slot_ammo,
    'offhandItems': inventory_slot_offhand,
    'bags1': inventory_slot_bag,
    'bags2': inventory_slot_bag,
    'bags3': inventory_slot_bag,
    'bags4': inventory_slot_bag,
}

export interface StyledLoadoutSlotButtonProps extends LoadoutSlotButtonProps {
    itemImageMap?: ItemImageMap;
}

export const StyledLoadoutSlotButton = styled.button<StyledLoadoutSlotButtonProps>`
    ${buttonResetStyles}
    position: relative;
    background: transparent;
    border: none;
    width: 100%;
    height: 100%;
    border: 1px solid #110705;
    box-shadow: inset 1px 0px 3px rgba(115, 98, 80,.5), 1px 0px 3px rgba(115, 98, 80,.5);
    background-color: rgba(11, 10, 10, .8);
    border-radius: 6px;
    cursor: pointer;
    
    &:hover {
        background-color: rgba(20, 19, 19, .8);
    }
    
    &:before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        ${(props) => {
            if (props.imageName && props.itemImageMap) {
                return `background-image: url("${props.itemImageMap[props.imageName]}");`
            } else {
                return `
                    background-image: url("${slotBackgroundMap[props.loadoutSlotType]}");
                    filter: grayscale(70%);
                    opacity: .6;
                `
            }
        }}
    }
`;