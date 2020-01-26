import * as React from 'react';
import {AppState} from '../reducers';
import {setBuildName} from '../actions';
import {connect} from 'react-redux';

interface BuildNameProps {
    buildName: string;
    onChange: (newValue: string) => void;
}

export const BuildNameBase: React.FC<BuildNameProps> = props => {
    const {buildName, onChange} = props;

    return (
        <input
            className="buildNameInput"
            type="text"
            value={buildName}
            onChange={e => onChange(e.target.value)}
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