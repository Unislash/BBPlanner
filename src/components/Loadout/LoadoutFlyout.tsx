/** @jsx jsx */

import * as React from 'react';
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

const Menu = styled.div`
    position: absolute;
    bottom: 100%;
    background-color: #261E1B;
    border-radius: 4px;
    box-shadow: 0 0 0 1px hsla(218, 50%, 10%, 0.1), 0 4px 11px hsla(218, 50%, 10%, 0.1);
    z-index: 2;
`;

const Blanket = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
`;

const FlyoutRoot = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

export interface LoadoutFlyoutProps {
    isOpen: boolean;
    target: React.ReactNode;
    onClose: () => void;
}

export const LoadoutFlyout: React.FC<LoadoutFlyoutProps> = ({ children, isOpen, target, onClose }) => (
    <FlyoutRoot>
        {target}
        {isOpen ? <Menu>{children}</Menu> : null}
        {isOpen ? <Blanket onClick={onClose} /> : null}
    </FlyoutRoot>
);