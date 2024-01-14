import * as React from 'react';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Tooltip from 'rc-tooltip';

export const ForecastInfoButton: React.FC = () => {
    return (
        <Tooltip
            overlay={<span>
                These stats are the theoretical max for your brother; they are predicted as if you picked all stats for every level up.
                The idea of this tool is to help you evaluate the maximum potential of individual attributes.
                <br/><br/>
                <i>* Indicates perk interaction (such as Colossus or Fortified Mind).</i>
            </span>}
            placement="bottom"
            mouseEnterDelay={.5}
            overlayClassName="plannerButtonTooltip"
        >
            <div
                className="infoButton plannerHoverIcon"
            >
                <InfoOutlined/>
            </div>
        </Tooltip>
    );
};