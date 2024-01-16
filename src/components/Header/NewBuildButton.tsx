import * as React from 'react';
import NewIcon from '@material-ui/icons/PostAdd';
import Tooltip from 'rc-tooltip';
import {createNewBuild} from '../../stores/actions';


export const NewBuildButton = (): JSX.Element => {
    return (
        <Tooltip
            overlay="Create a new build from scratch"
            placement="bottom"
            mouseEnterDelay={.5}
            overlayClassName="plannerButtonTooltip"
        >
            <div
                className="newButton plannerButton"
                onClick={() => {
                    createNewBuild()
                }}
            >
                <NewIcon/>
            </div>
        </Tooltip>
    );
};
