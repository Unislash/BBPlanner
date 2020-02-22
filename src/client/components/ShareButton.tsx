import * as React from 'react';

import ShareIcon from '@material-ui/icons/Share';

export const ShareButton: React.FC = () => {

    return (
        <div
            className="shareButton"
            onClick={() => {
                // do share stuff
            }}
        >
            <ShareIcon/>
        </div>
    );
};
