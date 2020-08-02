import * as React from 'react';
import {connect} from 'react-redux';
import InvalidIcon from '@material-ui/icons/ErrorOutline';

import {getAvailableNumberOfPerks, isBuildInvalid, maxLevel} from '../../logic';
import {AppState} from '../../models';
import Tooltip from 'rc-tooltip';

interface InvalidBuildIndicatorProps {
    isStudent: boolean;
    currentPerks: string[];
}

export const InvalidBuildIndicatorBase: React.FC<InvalidBuildIndicatorProps> = props => {
    const {isStudent, currentPerks} = props;
    const remainingPerks = getAvailableNumberOfPerks(currentPerks.length, maxLevel, isStudent);

    return isBuildInvalid(currentPerks, remainingPerks) ? (
        <Tooltip
            overlay="This build is invalid; take some earlier perks instead"
            placement="bottom"
            mouseEnterDelay={.5}
            overlayClassName="plannerButtonTooltip"
        >
            <InvalidIcon className="invalidIndicator"/>
        </Tooltip>
    ) : null;
};

const mapStateToProps = (state: AppState) => ({
    isStudent: state.isStudent,
    currentPerks: state.activePerkIds,
});

export const InvalidBuildIndicator = connect(
    mapStateToProps,
)(InvalidBuildIndicatorBase);