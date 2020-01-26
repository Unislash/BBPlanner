import * as React from 'react';
import {Fade, Tooltip} from '@material-ui/core';
import classcat from 'classcat';

interface PerkProps {
    isActive: boolean;
    image: string;
    tooltipText: React.ReactNode;
    onClick: () => void;
}

export const Perk: React.FC<PerkProps> = props => {
    const {image, tooltipText, isActive, onClick} = props;

    return (
        <div onClick={onClick} className={classcat(["perk", {isActive}])}>
            <Tooltip
                title={tooltipText}
                arrow={false}
                placement="bottom"
                TransitionComponent={Fade}
            >
                <div className="perkImageHoverWrapper">
                    {/*unfortunately we need a wrapper around img to let it be hoverable for the tooltip, but not draggable*/}
                    <img src={image}/>
                </div>
            </Tooltip>
        </div>
    );
};