import * as React from 'react';
import classcat from 'classcat';
import {ChangeEvent, useRef} from 'react';

import arrow_right from '../../images/arrow_right.png';

interface LevelBarProps {
    icon: string;
    levelNumber: number;
    setLevelNumber: (value: number) => void;
}

export const LevelBar: React.FC<LevelBarProps> = props => {
    const {
        icon,
        levelNumber,
        setLevelNumber,
    } = props;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Only take numbers
        const forcedNumber = event.target.value.replace(/\D/,'');
        let levelNumber = parseInt(forcedNumber || "0", 10)
        if (levelNumber > 11) {
            levelNumber = 11;
        }
        setLevelNumber(levelNumber);
    };

    const handleInputBlur = () => {
        if (levelNumber === 0) {
            setLevelNumber(1);
        }
    }

    const handleBarClick = () => {
        inputRef.current?.focus();
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="statBar">
            <img className="icon" src={icon} />
            <div
                className={classcat(['inputBar'])}
                onClick={handleBarClick}
            >
                <div className="barTextControl">
                    <span className="barInputWidthReserver">{levelNumber}</span>
                    <input
                        ref={inputRef}
                        className="barInputElement"
                        maxLength={2}
                        value={levelNumber}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                    />
                </div>
                <img className="arrowIndicator" src={arrow_right} />
                <div className="maxStat">11</div>
            </div>
        </div>
    );
};