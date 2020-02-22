import * as React from 'react';
import {getAvailableNumberOfPerks} from '../logic';

interface RemainingPerksProps {
    isStudent: boolean;
    currentPerkAmount: number;
    maxLevel: number;
}

export const RemainingPerks: React.FC<RemainingPerksProps> = props => {
    const {isStudent, currentPerkAmount, maxLevel} = props;
    const remainingPerks = getAvailableNumberOfPerks(currentPerkAmount, maxLevel, isStudent);

    return (
        <h3 className="perksRemaining">Remaining Perks: {remainingPerks}</h3>
    );
};