import * as React from 'react';
import SaveIcon from '@material-ui/icons/Favorite';
import SaveIconBorder from '@material-ui/icons/FavoriteBorder';
import {connect} from 'react-redux';
import {saveBuild} from '../../thunks';
import {AppState} from '../../models';
import classcat from 'classcat';
import Tooltip from 'rc-tooltip';
import { useState } from 'react';
import {initialState} from '../../initialState';

interface SaveButtonProps {
    buildName: string;
    buildIdList: string[];
    saveBuild: () => void;
}

export const BaseSaveButton: React.FC<SaveButtonProps> = ({
    saveBuild,
    buildName,
    buildIdList,
}) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const isSaved = buildIdList.indexOf(buildName) > -1;
    const usingDefaultBuildName = buildName === initialState.buildName;
    return (
        <Tooltip
            overlay="A build has no name?"
            placement="bottom"
            visible={tooltipVisible}
            overlayClassName="plannerButtonTooltip"
        >
            <div
                className={classcat(['saveButton', 'plannerButton', {
                    saved: isSaved
                }])}
                onClick={() => {
                    // Only allow saving if the user enters a name
                    if (usingDefaultBuildName) {
                        setTooltipVisible(true);
                        setTimeout(() => {
                            setTooltipVisible(false);
                        }, 3000);
                    } else {
                        saveBuild();
                    }
                }}
            >
                {isSaved ? <SaveIcon/> : <SaveIconBorder/>}
            </div>
        </Tooltip>
    );
};

const mapStateToProps = (state: AppState) => ({
    buildName: state.buildName,
    buildIdList: state.buildIdList,
});

const mapDispatchToProps = {
    saveBuild,
};

export const SaveButton = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BaseSaveButton);
