import * as React from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../models';
import {loadFromStorage} from '../../storage';

interface BuildListProps {
    buildIdList: string[];
}

export const BuildListBase: React.FC<BuildListProps> = props => {
    const {buildIdList} = props;

    return (
        <div className="savedBuilds">
            <h3>Saved Builds:</h3>
            <div className="buildList">
                {
                    buildIdList.map(buildId => (
                        <span className="buildEntry" key={buildId} onClick={() => loadFromStorage(buildId)}>
                            {buildId}
                        </span>
                    ))
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    buildIdList: state.buildIdList,
});


export const BuildList = connect(
    mapStateToProps,
)(BuildListBase);