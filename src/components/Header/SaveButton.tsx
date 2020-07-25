import * as React from 'react';
import SaveIcon from '@material-ui/icons/Favorite';
import SaveIconBorder from '@material-ui/icons/FavoriteBorder';
import {connect} from 'react-redux';
import {saveBuild} from '../../thunks';
import {AppState} from '../../models';
import classcat from 'classcat';

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
    const isSaved = buildIdList.indexOf(buildName) > -1;
    return (
        <div
            className={classcat(['saveButton', 'plannerButton', {
                saved: isSaved
            }])}
            onClick={() => {
                saveBuild()
            }}
        >
            {isSaved ? <SaveIcon/> : <SaveIconBorder/>}
        </div>
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
