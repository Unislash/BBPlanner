import NewIcon from "@material-ui/icons/PostAdd";
import Tooltip from "rc-tooltip";
import * as React from "react";
import { createNewBuild } from "../../stores/actions";
import { syncPlannerHistoryToCurrentState } from "../../stores/historyStore";

export const NewBuildButton = (): JSX.Element => {
    return (
        <Tooltip
            overlay="Create a new build from scratch"
            placement="bottom"
            mouseEnterDelay={0.5}
            overlayClassName="plannerButtonTooltip"
        >
            <div
                className="newButton plannerButton"
                onClick={() => {
                    createNewBuild();
                    syncPlannerHistoryToCurrentState();
                }}
            >
                <NewIcon />
            </div>
        </Tooltip>
    );
};
