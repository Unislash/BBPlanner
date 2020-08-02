import * as React from 'react';
import {connect} from 'react-redux';

import {RemainingPerks} from './RemainingPerks';
import {RequiredLevel} from './RequiredLevel';
import {AppState} from '../../models';

interface PerkPlannerInfoProps {
    isStudent: boolean;
    currentPerkAmount: number;
}

export const PerkPlannerInfoBase: React.FC<PerkPlannerInfoProps> = props => {
    const {isStudent, currentPerkAmount} = props;

    return (
        <div className="perkPlannerInfo">
            <RequiredLevel isStudent={isStudent} currentPerkAmount={currentPerkAmount}/>
            <RemainingPerks isStudent={isStudent} currentPerkAmount={currentPerkAmount}/>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    isStudent: state.isStudent,
    currentPerkAmount: state.activePerkIds.length,
});

export const PerkPlannerInfo = connect(
    mapStateToProps,
)(PerkPlannerInfoBase);