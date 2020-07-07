import * as React from 'react';
import classcat from 'classcat';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

interface PerkProps {
    isActive: boolean;
    image: string;
    tooltipText: React.ReactNode;
    onClick: () => void;
}

export const Perk: React.FC<PerkProps> = props => {
    const {image, tooltipText, isActive, onClick} = props;

    return (
        <Tooltip
            overlay={tooltipText}
            placement="bottom"
            mouseEnterDelay={.8}
        >
            <div onClick={onClick} className={classcat(["perk", {isActive}])}>
                <div className="perkImageHoverWrapper">
                    {/*unfortunately we need a wrapper around img to let it be hoverable for the tooltip, but not draggable*/}
                    <img src={image}/>
                </div>
            </div>
        </Tooltip>
    );
};