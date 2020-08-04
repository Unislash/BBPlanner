import * as React from 'react';
import {connect} from 'react-redux';
import InvalidIcon from '@material-ui/icons/ErrorOutline';

import {isBuildInvalid} from '../../logic';
import {AppState} from '../../models';
import Tooltip from 'rc-tooltip';

interface InvalidBuildIndicatorProps {
    currentPerks: string[];
}

export const InvalidBuildIndicatorBase: React.FC<InvalidBuildIndicatorProps> = props => {
    const {currentPerks} = props;

    return isBuildInvalid(currentPerks) ? (
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
    currentPerks: state.activePerkIds,
});

export const InvalidBuildIndicator = connect(
    mapStateToProps,
)(InvalidBuildIndicatorBase);