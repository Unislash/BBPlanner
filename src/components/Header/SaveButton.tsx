import * as React from 'react';
import SaveIcon from '@material-ui/icons/Favorite';
import SaveIconBorder from '@material-ui/icons/FavoriteBorder';
import classcat from 'classcat';
import Tooltip from 'rc-tooltip';
import { useState } from 'react';
import {initialBuildStore, useBuildActions, useBuildIdList, useBuildName} from '../../stores/buildStore';

export const SaveButton = (): JSX.Element => {
    const {saveBuild} = useBuildActions();
    const buildName = useBuildName();
    const buildIdList = useBuildIdList();

    const [tooltipVisible, setTooltipVisible] = useState(false);

    const isSaved = buildIdList.indexOf(buildName) > -1;
    const usingDefaultBuildName = buildName === initialBuildStore.buildName;
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
