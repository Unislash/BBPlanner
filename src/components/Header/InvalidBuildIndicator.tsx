import * as React from 'react';
import InvalidIcon from '@material-ui/icons/ErrorOutline';

import {isBuildInvalid} from '../../logic';
import Tooltip from 'rc-tooltip';
import {useActivePerkIds} from '../../stores/perkStore';

export const InvalidBuildIndicator = () => {
    const currentPerks = useActivePerkIds();

    return isBuildInvalid(currentPerks) ? (
        <Tooltip
            overlay="This build is invalid; take some earlier perks instead"
            placement="bottom"
            mouseEnterDelay={.5}
            overlayClassName="plannerButtonTooltip"
        >
            <InvalidIcon className="invalidIndicator"/>
        </Tooltip>
    ) : null;
};
