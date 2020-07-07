import * as React from 'react';
import classcat from 'classcat';

import star from '../../images/star.png';

interface StarProps {
    starIndex: number;
    currentStars: number;
    setCurrentStars: (value: number) => void;
    hoveredStarIndex: number | undefined;
    setHoveredStarIndex: (value: number | undefined) => void;
}

export const Star: React.FC<StarProps> = props => {
    const {
        starIndex,
        currentStars,
        setCurrentStars,
        hoveredStarIndex,
        setHoveredStarIndex,
    } = props;

    const toggleStar = (numberToToggleTo: number) => {
        if (currentStars === starIndex) {
            setCurrentStars(0);
        } else {
            setCurrentStars(numberToToggleTo);
        }
    };

    return (
        <div className="star">
            <img
                className={classcat(['starIcon', {
                    inactive: hoveredStarIndex == null ? currentStars < starIndex : hoveredStarIndex < starIndex
                }])}
                src={star}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(starIndex);
                }}
                onMouseEnter={() => setHoveredStarIndex(starIndex)}
                onMouseLeave={() => setHoveredStarIndex(undefined)}
            />
        </div>
    );
};