import * as React from 'react';
import {maxLevel} from '../../logic';

interface RequiredLevelProps {
    isStudent: boolean;
    currentPerkAmount: number;
}

export const RequiredLevel = (props: RequiredLevelProps): JSX.Element => {
    const {isStudent, currentPerkAmount} = props;

    let requiredLevel = 1;
    requiredLevel += currentPerkAmount;
    if (isStudent && currentPerkAmount >= maxLevel) {
        requiredLevel -= 1;
    }

    return (
        <h3 className="perksRemaining">Required Level: {requiredLevel}</h3>
    );
};