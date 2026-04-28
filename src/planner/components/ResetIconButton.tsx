import ResetIcon from "@material-ui/icons/RotateLeft";
import Tooltip from "rc-tooltip";
import * as React from "react";

interface ResetIconButtonProps {
    onClick: () => void;
    tooltipText: string;
}

export const ResetIconButton = ({ onClick, tooltipText }: ResetIconButtonProps): JSX.Element => {
    return (
        <Tooltip overlay={tooltipText} placement="bottom" mouseEnterDelay={0.5} overlayClassName="plannerButtonTooltip">
            <div className="plannerButton sectionResetButton" onClick={onClick}>
                <ResetIcon />
            </div>
        </Tooltip>
    );
};
