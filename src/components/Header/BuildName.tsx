import * as React from 'react';
import {useBuildActions, useBuildName} from '../../stores/buildStore';

export const BuildName = (): JSX.Element => {
    const buildName = useBuildName();
    const {setBuildName} = useBuildActions();

    return (
        <input
            className="buildNameInput inputBar"
            type="text"
            value={buildName}
            onChange={e => setBuildName(e.target.value, true)}
            placeholder="Untitled Build"
        />
    );
};
