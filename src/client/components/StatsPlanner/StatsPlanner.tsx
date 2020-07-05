import * as React from 'react';
import {StatBar} from './StatBar';

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

interface StatsPlannerProps {
    statNums: StatNums;
    stars: Stars;
    setStat: (statType: StatType, num: number) => void;
    setStar: (statType: StatType, amount: number) => void;
}

export const StatsPlannerBase: React.FC<StatsPlannerProps> = props => {
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
        <div className="statsPlanner">
            <h3>Stat Planner:</h3>
            <p>Enter your current stats and add stars to see the expected max value</p>
            <div className="statBars">
                <StatBar
                    icon={healthIcon}
                    statNumber={statNums["health"]}
                    setStatNumber={getSetStat("health")}
                    statType={'health'}
                    stars={stars["health"]}
                    setStars={getSetStar("health")}
                />
                <StatBar
                    icon={fatigueIcon}
                    statNumber={statNums['fatigue']}
                    setStatNumber={getSetStat('fatigue')}
                    statType={'fatigue'}
                    stars={stars['fatigue']}
                    setStars={getSetStar('fatigue')}
                />
                <StatBar
                    icon={resolveIcon}
                    statNumber={statNums['resolve']}
                    setStatNumber={getSetStat('resolve')}
                    statType={'resolve'}
                    stars={stars['resolve']}
                    setStars={getSetStar('resolve')}
                />
                <StatBar
                    icon={initiativeIcon}
                    statNumber={statNums['initiative']}
                    setStatNumber={getSetStat('initiative')}
                    statType={'initiative'}
                    stars={stars['initiative']}
                    setStars={getSetStar('initiative')}
                />
                <StatBar
                    icon={mattackIcon}
                    statNumber={statNums['mattack']}
                    setStatNumber={getSetStat('mattack')}
                    statType={'mattack'}
                    stars={stars['mattack']}
                    setStars={getSetStar('mattack')}
                />
                <StatBar
                    icon={rattackIcon}
                    statNumber={statNums['rattack']}
                    setStatNumber={getSetStat('rattack')}
                    statType={'rattack'}
                    stars={stars['rattack']}
                    setStars={getSetStar('rattack')}
                />
                <StatBar
                    icon={mdefenseIcon}
                    statNumber={statNums['mdefense']}
                    setStatNumber={getSetStat('mdefense')}
                    statType={'mdefense'}
                    stars={stars['mdefense']}
                    setStars={getSetStar('mdefense')}
                />
                <StatBar
                    icon={rdefenseIcon}
                    statNumber={statNums['rdefense']}
                    setStatNumber={getSetStat('rdefense')}
                    statType={'rdefense'}
                    stars={stars['rdefense']}
                    setStars={getSetStar('rdefense')}
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

export const StatsPlanner = connect(
    mapStateToProps,
    mapDispatchToProps,
)(StatsPlannerBase);