import * as React from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../models';
import {loadFromStorage} from '../../storage';
import {removeBuild} from '../../thunks';
import DeleteIcon from '@material-ui/icons/Delete';

interface BuildListProps {
    buildIdList: string[];
    removeBuild: (buildId: string) => void;
}

export const BuildListBase: React.FC<BuildListProps> = props => {
    const {buildIdList, removeBuild} = props;

    return (
        <div className="savedBuilds">
            <h3>Saved Builds:</h3>
            <div className="buildList">
                {
                    buildIdList.map(buildId => (
                        <div className="buildEntry" key={buildId}>
                            <span className="buildEntryText" onClick={() => loadFromStorage(buildId)}>{buildId}</span>
                            <div
                                className="deleteBuild"
                                onClick={() => {
                                    removeBuild(buildId);
                                }}
                            >
                                <DeleteIcon/>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    buildIdList: state.buildIdList,
});

const mapDispatchToProps = {
    removeBuild,
};

export const BuildList = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BuildListBase);