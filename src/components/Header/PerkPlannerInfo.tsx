import * as React from 'react';

import {RemainingPerks} from './RemainingPerks';
import {RequiredLevel} from './RequiredLevel';
import {useActivePerkIds, useIsStudent} from '../../stores/perkStore';

export const PerkPlannerInfo = (): JSX.Element => {
    const currentPerkAmount = useActivePerkIds().length;
    const isStudent = useIsStudent();

    return (
        <div className="perkPlannerInfo">
            <RequiredLevel isStudent={isStudent} currentPerkAmount={currentPerkAmount}/>
            <RemainingPerks isStudent={isStudent} currentPerkAmount={currentPerkAmount}/>
        </div>
    );
};
