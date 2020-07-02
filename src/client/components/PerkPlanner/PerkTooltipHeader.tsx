import * as React from 'react';

interface PerkHeaderProps {
    title: React.ReactNode;
}

export const PerkTooltipHeader: React.FC<PerkHeaderProps> = props => {
    const {title} = props;

    return (
        <div className="perkHeader">
            {title}
        </div>
    );
};