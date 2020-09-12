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
import Tooltip from 'rc-tooltip';
import {LoadoutTooltip} from './LoadoutTooltip';
import {EMPTY_NAME} from '../../data/itemData';

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
                <Tooltip
                    overlay={<LoadoutTooltip
                        loadoutSlotType={loadoutSlotType}
                        item={selected}
                    />}
                    placement="right"
                    mouseEnterDelay={
                        // Oooooookay so it's 1am and I can't think of a more simple way to do this.
                        // Will I regret this as I sleep? Yes.
                        // Will I regret this in the morning? Hopefully not!
                        selected.name === EMPTY_NAME ? 100 : .5
                    }
                >
                    <LoadoutSlotButton
                        loadoutSlotType={loadoutSlotType}
                        onClick={toggleOpen}
                        imageName={selected?.imageName}
                    />
                </Tooltip>
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
