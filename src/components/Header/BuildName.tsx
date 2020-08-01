import * as React from 'react';
import {setBuildName} from '../../actions';
import {connect} from 'react-redux';
import {AppState} from '../../models';

interface BuildNameProps {
    buildName: string;
    onChange: (newValue: string) => void;
}

export const BuildNameBase: React.FC<BuildNameProps> = props => {
    const {buildName, onChange} = props;

    return (
        <input
            className="buildNameInput inputBar"
            type="text"
            value={buildName}
            onChange={e => onChange(e.target.value)}
            placeholder="Untitled Build"
        />
    );
};

const mapStateToProps = (state: AppState) => ({
    buildName: state.buildName,
});

const mapDispatchToProps = {
    onChange: setBuildName,
};

export const BuildName = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BuildNameBase);