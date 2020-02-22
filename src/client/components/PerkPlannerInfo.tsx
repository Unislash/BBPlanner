import * as React from 'react';
import {AppState} from '../reducers';
import {connect} from 'react-redux';

import {RemainingPerks} from './RemainingPerks';
import {RequiredLevel} from './RequiredLevel';
import {maxLevel} from '../logic';

interface PerkPlannerInfoProps {
    isStudent: boolean;
    currentPerkAmount: number;
}

export const PerkPlannerInfoBase: React.FC<PerkPlannerInfoProps> = props => {
    const {isStudent, currentPerkAmount} = props;

    return (
        <>
            <RequiredLevel isStudent={isStudent} currentPerkAmount={currentPerkAmount} maxLevel={maxLevel}/>
            <RemainingPerks isStudent={isStudent} currentPerkAmount={currentPerkAmount} maxLevel={maxLevel}/>
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    isStudent: state.isStudent,
    currentPerkAmount: state.activePerkIds.length,
});

export const PerkPlannerInfo = connect(
    mapStateToProps,
)(PerkPlannerInfoBase);