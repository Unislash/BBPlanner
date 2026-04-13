import styled from "@emotion/styled";
import * as React from "react";
import { buttonResetStyles } from '../../../sharedStyles';
import { LegendaryItemImageMap } from "./legendaryItemImageMap";

export interface ArchetypeGridItemProps {
    id: string;
    onClick: () => void;
    legendaryItemImageMap?: LegendaryItemImageMap;
    imageName: string;
    name: string;
}

export const ArchetypeGridItem = styled.button<ArchetypeGridItemProps>`
    ${buttonResetStyles}
    flex-shrink: 0;
    margin-right: 100px;
    margin-bottom: 80px;
    position: relative;
    background: linear-gradient(180deg, rgba(47, 28, 17, 0.96), rgba(22, 12, 7, 0.98));
    border: none;
    width: 82px;
    height: 82px;
    border: 1px solid rgba(139, 101, 59, 0.42);
    box-shadow:
        0 12px 18px rgba(0, 0, 0, 0.34),
        inset 0 1px 0 rgba(255, 220, 163, 0.1),
        inset 0 -6px 10px rgba(0, 0, 0, 0.22);
    border-radius: 8px;
    cursor: pointer;
    transition:
        transform 160ms ease,
        box-shadow 160ms ease,
        border-color 160ms ease,
        background 160ms ease;

    &:hover {
        transform: translateY(-6px) rotate(-1deg);
        border-color: rgba(221, 169, 95, 0.55);
        box-shadow:
            0 18px 28px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 224, 177, 0.16),
            inset 0 -6px 10px rgba(0, 0, 0, 0.22);
    }

    &:before {
        content: "";
        position: absolute;
        top: 6px;
        bottom: 6px;
        right: 6px;
        left: 6px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        filter: drop-shadow(0 4px 7px rgba(0, 0, 0, 0.38));
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
        right: -34px;
        left: -34px;
        margin-top: 10px;
        padding: 4px 6px 3px;
        border: 1px solid rgba(110, 83, 50, 0.3);
        background: rgba(30, 16, 9, 0.76);
        color: #f1dfbf;
        font-size: 13px;
        line-height: 1.2;
        text-shadow: 0 0 4px black;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
    }
`;
