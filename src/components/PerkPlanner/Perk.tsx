import classcat from "classcat";
import Tooltip from "rc-tooltip";
import * as React from "react";
import "rc-tooltip/assets/bootstrap.css";

interface PerkProps {
    image: string;
    isActive: boolean;
    onClick: () => void;
    tooltipText: React.ReactNode;
}

export const Perk: React.FC<PerkProps> = (props) => {
    const { image, tooltipText, isActive, onClick } = props;

    return (
        <Tooltip overlay={tooltipText} placement="bottom" mouseEnterDelay={0.5}>
            <div onClick={onClick} className={classcat(["perk", { isActive }])}>
                <div className="perkImageHoverWrapper">
                    {/*unfortunately we need a wrapper around img to let it be hoverable for the tooltip, but not draggable*/}
                    <img src={image} />
                </div>
            </div>
        </Tooltip>
    );
};
