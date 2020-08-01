import * as React from 'react';
import NewIcon from '@material-ui/icons/PostAdd';
import {connect} from 'react-redux';
import {createNewBuild} from '../../actions';
import Tooltip from 'rc-tooltip';

interface NewBuildButtonProps {
    createNewBuild: () => void;
}

export const BaseNewBuildButton: React.FC<NewBuildButtonProps> = ({
    createNewBuild,
}) => {
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

const mapDispatchToProps = {
    createNewBuild,
};

export const NewBuildButton = connect(
    null,
    mapDispatchToProps,
)(BaseNewBuildButton);
