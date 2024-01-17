import InvalidIcon from "@material-ui/icons/ErrorOutline";
import Tooltip from "rc-tooltip";
import * as React from "react";
import { isBuildInvalid } from "../../logic";
import { useActivePerkIds } from "../../stores/perkStore";

export const InvalidBuildIndicator = () => {
    const currentPerks = useActivePerkIds();

    return isBuildInvalid(currentPerks) ? (
        <Tooltip
            overlay="This build is invalid; take some earlier perks instead"
            placement="bottom"
            mouseEnterDelay={0.5}
            overlayClassName="plannerButtonTooltip"
        >
            <InvalidIcon className="invalidIndicator" />
        </Tooltip>
    ) : null;
};
