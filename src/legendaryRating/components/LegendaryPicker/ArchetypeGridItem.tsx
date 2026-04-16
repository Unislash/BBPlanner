import styled from "@emotion/styled";
import * as React from "react";
import { buttonResetStyles } from '../../../sharedStyles';
import { LegendaryItemImageMap } from "./legendaryItemImageMap";

export interface ArchetypeGridItemProps {
    animationIndex?: number;
    className?: string;
    id: string;
    onClick: () => void;
    legendaryItemImageMap?: LegendaryItemImageMap;
    imageName: string;
    name: string;
}

const ArchetypeGridItemShell = styled.div<Pick<ArchetypeGridItemProps, "animationIndex">>`
    @keyframes legendaryGridItemSettle {
        0% {
            opacity: 0;
            transform: translateY(18px) rotate(1.8deg) scale(0.97);
        }
        100% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
        }
    }

    flex-shrink: 0;
    margin: 0 50px 80px;
    opacity: 0;
    animation: legendaryGridItemSettle 360ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    animation-delay: ${props => `${Math.min((props.animationIndex || 0) * 26, 260)}ms`};
`;

const ArchetypeGridItemButton = styled.button<ArchetypeGridItemProps>`
    ${buttonResetStyles}
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
        transform: translateY(-2px) rotate(-.5deg);
        border-color: rgba(221, 169, 95, 0.55);
        box-shadow:
            0 18px 28px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 224, 177, 0.16),
            inset 0 -6px 10px rgba(0, 0, 0, 0.22);
    }

    &:before {
        content: "";
        position: absolute;
        top: 2px;
        bottom: 2px;
        right: 2px;
        left: 2px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        filter: drop-shadow(0 4px 7px rgba(0, 0, 0, 0.38));
        mask-image:
        linear-gradient(to right, transparent, black 8%, black 92%, transparent),
        linear-gradient(to bottom, transparent, black 8%, black 92%, transparent);
        mask-composite: intersect;

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
        color: #f2ebdd;
        font-size: 14px;
        line-height: 1.2;
        text-shadow: 0 0 4px black;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
    }
`;

export const ArchetypeGridItem = ({
    animationIndex,
    className,
    ...props
}: ArchetypeGridItemProps): JSX.Element => {
    return (
        <ArchetypeGridItemShell animationIndex={animationIndex} className={className}>
            <ArchetypeGridItemButton {...props} />
        </ArchetypeGridItemShell>
    );
};
