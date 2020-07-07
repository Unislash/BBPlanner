import * as React from 'react';
import {resetPerks} from '../../actions';
import {connect} from 'react-redux';
import {AppState} from '../../models';

import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button/Button';

interface ResetPerksProps {
    resetPerks: () => void;
}

export const ResetPerksBase: React.FC<ResetPerksProps> = props => {
    const {resetPerks} = props;

    return (
        <Button
            variant="outlined" color="secondary" disableElevation
            className="resetPerks"
            onClick={resetPerks}
        >
            <DeleteIcon/> Reset Perks
        </Button>
    );
};

const mapStateToProps = (state: AppState) => ({
    buildName: state.buildName,
});

const mapDispatchToProps = {
    resetPerks,
};

export const ResetPerks = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ResetPerksBase);