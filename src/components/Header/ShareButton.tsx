import * as React from 'react';
import ShareIcon from '@material-ui/icons/Share';
import Tooltip from 'rc-tooltip';
import { useState } from 'react';

const copyUrlToClipboard = () => {
    const dummy = document.createElement('input');
    const text = window.location.href;

    dummy.style.opacity = "0";
    dummy.style.position = "absolute";
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}

export const ShareButton: React.FC = () => {
    const [tooltipVisible, setTooltipVisible] = useState(false);

    return (
        <Tooltip
            overlay="URL copied to clipboard!"
            placement="bottom"
            visible={tooltipVisible}
            overlayClassName="shareTooltip"
        >
            <div
                className="plannerButton shareButton"
                onClick={() => {
                    copyUrlToClipboard();
                    setTooltipVisible(true);
                    setTimeout(() => {
                        setTooltipVisible(false);
                    }, 3000);
                }}
            >
                <ShareIcon/>
            </div>
        </Tooltip>
    );
};

