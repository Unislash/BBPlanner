import * as React from 'react';
import {getAvailableNumberOfPerks, maxLevel} from '../../logic';

interface RemainingPerksProps {
    isStudent: boolean;
    currentPerkAmount: number;
}

export const RemainingPerks = (props: RemainingPerksProps): JSX.Element => {
    const {isStudent, currentPerkAmount} = props;
    const remainingPerks = getAvailableNumberOfPerks(currentPerkAmount, maxLevel, isStudent);

    return (
        <h3 className="perksRemaining">Remaining Perks: {remainingPerks}</h3>
    );
};