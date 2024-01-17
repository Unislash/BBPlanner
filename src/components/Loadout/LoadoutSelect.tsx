/** @jsx jsx */
import { jsx } from '@emotion/core';
import Tooltip from 'rc-tooltip';
import * as React from 'react';
import { useState } from 'react';
import Select from 'react-select'
import {EMPTY_NAME} from '../../data/itemData';
import {LoadoutItem, LoadoutSlotType} from '../../models';
import { LoadoutFlyout } from './LoadoutFlyout';
import {loadoutSelectStyles} from './LoadoutSelectStyles';
import {LoadoutSlotButton} from './LoadoutSlotButton';
import {LoadoutTooltip} from './LoadoutTooltip';

interface LoadoutSelectProps {
    loadoutSlotType: LoadoutSlotType;
    options: LoadoutItem[];
    selected: LoadoutItem;
    onItemChange?: (newItem: LoadoutItem) => void;
}

export const LoadoutSelect = (props: LoadoutSelectProps): JSX.Element => {
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
                onChange={
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    onSelectChange as any
                }
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
