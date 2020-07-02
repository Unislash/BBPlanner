import * as React from 'react';
import {StatBar} from './StatBar';
import {useState} from 'react';

import healthIcon from '../../images/stats/health.png';
import fatigueIcon from '../../images/stats/fatigue.png';
import resolveIcon from '../../images/stats/resolve.png';
import initiativeIcon from '../../images/stats/initiative.png';
import mattackIcon from '../../images/stats/mattack.png';
import rattackIcon from '../../images/stats/rattack.png';
import mdefenseIcon from '../../images/stats/mdefense.png';
import rdefenseIcon from '../../images/stats/rdefense.png';

interface StatsPlannerProps {
}

export const StatsPlanner: React.FC<StatsPlannerProps> = () => {
    const [health, setHealth] = useState(55);
    const [fatigue, setFatigue] = useState(100);
    const [resolve, setResolve] = useState(40);
    const [initiative, setInitiative] = useState(100);
    const [mattack, setMattack] = useState(55);
    const [rattack, setRattack] = useState(40);
    const [mdefense, setMdefense] = useState(4);
    const [rdefense, setRdefense] = useState(3);

    const [healthStars, setHealthStars] = useState(0);
    const [fatigueStars, setFatigueStars] = useState(0);
    const [resolveStars, setResolveStars] = useState(0);
    const [initiativeStars, setInitiativeStars] = useState(0);
    const [mattackStars, setMattackStars] = useState(0);
    const [rattackStars, setRattackStars] = useState(0);
    const [mdefenseStars, setMdefenseStars] = useState(0);
    const [rdefenseStars, setRdefenseStars] = useState(0);

    return (
        <div className="statsPlanner">
            <h3>Stat Planner:</h3>
            <p>Enter your current stats and add stars to see the expected max value</p>
            <div className="statBars">
                <StatBar
                    icon={healthIcon}
                    statNumber={health}
                    setStatNumber={setHealth}
                    statType={"health"}
                    stars={healthStars}
                    setStars={setHealthStars}
                />
                <StatBar
                    icon={fatigueIcon}
                    statNumber={fatigue}
                    setStatNumber={setFatigue}
                    statType={"fatigue"}
                    stars={fatigueStars}
                    setStars={setFatigueStars}
                />
                <StatBar
                    icon={resolveIcon}
                    statNumber={resolve}
                    setStatNumber={setResolve}
                    statType={"resolve"}
                    stars={resolveStars}
                    setStars={setResolveStars}
                />
                <StatBar
                    icon={initiativeIcon}
                    statNumber={initiative}
                    setStatNumber={setInitiative}
                    statType={"initiative"}
                    stars={initiativeStars}
                    setStars={setInitiativeStars}
                />
                <StatBar
                    icon={mattackIcon}
                    statNumber={mattack}
                    setStatNumber={setMattack}
                    statType={"mattack"}
                    stars={mattackStars}
                    setStars={setMattackStars}
                />
                <StatBar
                    icon={rattackIcon}
                    statNumber={rattack}
                    setStatNumber={setRattack}
                    statType={"rattack"}
                    stars={rattackStars}
                    setStars={setRattackStars}
                />
                <StatBar
                    icon={mdefenseIcon}
                    statNumber={mdefense}
                    setStatNumber={setMdefense}
                    statType={"mdefense"}
                    stars={mdefenseStars}
                    setStars={setMdefenseStars}
                />
                <StatBar
                    icon={rdefenseIcon}
                    statNumber={rdefense}
                    setStatNumber={setRdefense}
                    statType={"rdefense"}
                    stars={rdefenseStars}
                    setStars={setRdefenseStars}
                />
            </div>
        </div>
    );
};