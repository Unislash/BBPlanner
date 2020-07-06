import * as React from 'react';
import SaveIcon from '@material-ui/icons/SaveAlt';
import {connect} from 'react-redux';
import {saveBuild} from '../../thunks';

interface SaveButtonProps {
    saveBuild: () => void;
}

export const BaseSaveButton: React.FC<SaveButtonProps> = ({saveBuild}) => {

    return (
        <div
            className="saveButton"
            onClick={() => {
                saveBuild()
            }}
        >
            <SaveIcon/>
        </div>
    );
};

const mapDispatchToProps = {
    saveBuild,
};

export const SaveButton = connect(
    null,
    mapDispatchToProps,
)(BaseSaveButton);
