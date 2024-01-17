import classcat from "classcat";
import * as React from "react";
import star from "../../images/star.png";

interface StarProps {
    currentStars: number;
    hoveredStarIndex: number | undefined;
    setCurrentStars: (value: number) => void;
    setHoveredStarIndex: (value: number | undefined) => void;
    starIndex: number;
}

export const Star: React.FC<StarProps> = (props) => {
    const { starIndex, currentStars, setCurrentStars, hoveredStarIndex, setHoveredStarIndex } = props;

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
                className={classcat([
                    "starIcon",
                    {
                        inactive: hoveredStarIndex == null ? currentStars < starIndex : hoveredStarIndex < starIndex,
                    },
                ])}
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
