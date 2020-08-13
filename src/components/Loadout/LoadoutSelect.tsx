/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/core';

// import levelIcon from '../../images/stats/leveled_up.png';

import Select from 'react-select'
import {LoadoutItem, LoadoutSlotType} from '../../models';
import { connect } from 'react-redux';
import { useState } from 'react';
import { LoadoutFlyout } from './LoadoutFlyout';
import {loadoutSelectStyles} from './LoadoutSelectStyles';
import {LoadoutSlotButton} from './LoadoutSlotButton';

interface LoadoutSelectProps {
    options: LoadoutItem[];
    selected: LoadoutItem;
    onItemChange?: (newItem: LoadoutItem) => void;
    loadoutSlotType: LoadoutSlotType;
}

export const LoadoutSelectBase: React.FC<LoadoutSelectProps> = props => {
    const {
        options,
        selected,
        onItemChange,
        loadoutSlotType,
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const onSelectChange = (newValue: LoadoutItem) => {
        toggleOpen();
        onItemChange && onItemChange(newValue);
    };

    return (
        <LoadoutFlyout
            isOpen={isOpen}
            onClose={toggleOpen}
            target={
                <LoadoutSlotButton
                    loadoutSlotType={loadoutSlotType}
                    onClick={toggleOpen}
                    imageName={selected?.imageName}
                />
            }
        >
            <Select
                autoFocus
                backspaceRemovesValue={false}
                components={{
                    DropdownIndicator: null,
                    IndicatorSeparator: null,
                }}
                controlShouldRenderValue={false}
                hideSelectedOptions={false}
                isClearable={false}
                menuIsOpen
                onChange={onSelectChange as any}
                options={options}
                getOptionLabel={option => option.name}
                getOptionValue={option => option.id}
                placeholder=""
                styles={loadoutSelectStyles}
                tabSelectsValue={false}
                value={selected}
                menuShouldScrollIntoView={false}
            />
        </LoadoutFlyout>
    );
};

const mapDispatchToProps = {
};

export const LoadoutSelect = connect(
    null,
    mapDispatchToProps,
)(LoadoutSelectBase);
