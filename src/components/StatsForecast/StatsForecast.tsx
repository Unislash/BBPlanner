import * as React from 'react';
import {StatBar} from './StatBar';

import levelIcon from '../../images/stats/leveled_up.png';
import healthIcon from '../../images/stats/health.png';
import fatigueIcon from '../../images/stats/fatigue.png';
import resolveIcon from '../../images/stats/resolve.png';
import initiativeIcon from '../../images/stats/initiative.png';
import mattackIcon from '../../images/stats/mattack.png';
import rattackIcon from '../../images/stats/rattack.png';
import mdefenseIcon from '../../images/stats/mdefense.png';
import rdefenseIcon from '../../images/stats/rdefense.png';

import {setStat, setStar} from '../../actions';
import {connect} from 'react-redux';
import {AppState, Stars, StatNums, StatType} from '../../models';
import {LevelBar} from './LevelBar';

interface StatsForecastProps {
    statNums: StatNums;
    stars: Stars;
    setStat: (statType: StatType, num: number) => void;
    setStar: (statType: StatType, amount: number) => void;
}

export const StatsForecastBase: React.FC<StatsForecastProps> = props => {
    const {
        statNums,
        stars,
        setStat,
        setStar,
    } = props;

    const getSetStat = (statType: StatType) => {
        return (value: number) => {
            setStat(statType, value);
        }
    };

    const getSetStar = (statType: StatType) => {
        return (value: number) => {
            setStar(statType, value);
        }
    };

    return (
        <div className="statsForecast">
            <h3>Stats Forecast:</h3>
            <p>Enter your current level, stats, and stars to see the expected max stats</p>
            <div className="statBars">
                <LevelBar
                    icon={levelIcon}
                    levelNumber={statNums["level"]}
                    setLevelNumber={getSetStat("level")}
                />
                <StatBar
                    icon={healthIcon}
                    statNumber={statNums["health"]}
                    setStatNumber={getSetStat("health")}
                    statType={'health'}
                    stars={stars["health"]}
                    setStars={getSetStar("health")}
                    currentLevel={statNums['level']}
                />
                <StatBar
                    icon={fatigueIcon}
                    statNumber={statNums['fatigue']}
                    setStatNumber={getSetStat('fatigue')}
                    statType={'fatigue'}
                    stars={stars['fatigue']}
                    setStars={getSetStar('fatigue')}
                    currentLevel={statNums['level']}
                />
                <StatBar
                    icon={resolveIcon}
                    statNumber={statNums['resolve']}
                    setStatNumber={getSetStat('resolve')}
                    statType={'resolve'}
                    stars={stars['resolve']}
                    setStars={getSetStar('resolve')}
                    currentLevel={statNums['level']}
                />
                <StatBar
                    icon={initiativeIcon}
                    statNumber={statNums['initiative']}
                    setStatNumber={getSetStat('initiative')}
                    statType={'initiative'}
                    stars={stars['initiative']}
                    setStars={getSetStar('initiative')}
                    currentLevel={statNums['level']}
                />
                <StatBar
                    icon={mattackIcon}
                    statNumber={statNums['mattack']}
                    setStatNumber={getSetStat('mattack')}
                    statType={'mattack'}
                    stars={stars['mattack']}
                    setStars={getSetStar('mattack')}
                    currentLevel={statNums['level']}
                />
                <StatBar
                    icon={rattackIcon}
                    statNumber={statNums['rattack']}
                    setStatNumber={getSetStat('rattack')}
                    statType={'rattack'}
                    stars={stars['rattack']}
                    setStars={getSetStar('rattack')}
                    currentLevel={statNums['level']}
                />
                <StatBar
                    icon={mdefenseIcon}
                    statNumber={statNums['mdefense']}
                    setStatNumber={getSetStat('mdefense')}
                    statType={'mdefense'}
                    stars={stars['mdefense']}
                    setStars={getSetStar('mdefense')}
                    currentLevel={statNums['level']}
                />
                <StatBar
                    icon={rdefenseIcon}
                    statNumber={statNums['rdefense']}
                    setStatNumber={getSetStat('rdefense')}
                    statType={'rdefense'}
                    stars={stars['rdefense']}
                    setStars={getSetStar('rdefense')}
                    currentLevel={statNums['level']}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    statNums: state.statNums,
    stars: state.stars,
});

const mapDispatchToProps = {
    setStat,
    setStar,
};

export const StatsForecast = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StatsForecastBase);