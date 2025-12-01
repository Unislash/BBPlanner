import styled from "@emotion/styled";
import * as React from "react";
import { buttonResetStyles } from '../../../sharedStyles';

export interface ArchetypeGridItemProps {
    id: string;
    onClick: () => void;
    legendaryItemImageMap?: LegendaryItemImageMap;
    imageName: string;
    name: string;
}

export type LegendaryItemImageMap = { [key: string]: string };

export const ArchetypeGridItem = styled.button<ArchetypeGridItemProps>`
    ${buttonResetStyles}
    flex-shrink: 0;
    margin-right: 100px;
    margin-bottom: 80px;
    position: relative;
    background: transparent;
    border: none;
    width: 70px;
    height: 70px;
    border: 1px solid #110705;
    box-shadow:
        inset 1px 0px 3px rgba(115, 98, 80, 0.8),
        1px 0px 3px rgba(115, 98, 80, 0.8);
    background-color: rgba(11, 10, 10, 0.8);
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: rgba(20, 19, 19, 0.8);
    }

    &:before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        ${(props) => {
            if (props.legendaryItemImageMap) {
                return `background-image: url("${props.legendaryItemImageMap[props.imageName]}");`;
            }
        }}
    }
    
    /* Is this accessible? No. Is it hacky? Yes. But it works! */
    &:after {
        content: "${props => props.name}";
        position: absolute;
        top: 100%;
        right: -24px;
        left: -24px;
        margin-top: 8px;
        text-shadow: 0 0 4px black;
    }
`;