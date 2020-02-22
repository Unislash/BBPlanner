import * as React from 'react';

interface RequiredLevelProps {
    isStudent: boolean;
    currentPerkAmount: number;
    maxLevel: number;
}

export const RequiredLevel: React.FC<RequiredLevelProps> = props => {
    const {isStudent, currentPerkAmount, maxLevel} = props;
    let requiredLevel = 1;
    requiredLevel += currentPerkAmount;
    if (isStudent && currentPerkAmount >= maxLevel) {
        requiredLevel -= 1;
    }

    return (
        <h3 className="perksRemaining">Required Level: {requiredLevel}</h3>
    );
};