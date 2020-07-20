import React from 'react';
import HyperlinkIcon from '@material-ui/icons/OpenInNew';

export const OtherResources: React.FC = () => {
    return (
        <div className="otherResources">
            <h3>Other Resources</h3>
            <div className="otherResourcesCopy">
                <p>Take a look at these excellent Battle Brothers resources:</p>
                <p><a href="http://tumult.cc/bb-calc.html">Tumult BB Calc<HyperlinkIcon /></a></p>
                <p><a href="https://battlebrothers.fandom.com/wiki/Battle_Brothers_Wiki">Battle Brothers Wiki<HyperlinkIcon /></a></p>
                <p><a href="https://bbbros.herokuapp.com">"Effective HP" Calculator<HyperlinkIcon /></a></p>
                <p><a href="https://github.com/turtle225/Battle-Brothers-Damage-Calculator">Multi-Enemy Combat Simulator<HyperlinkIcon /></a></p>
                <p><a href="https://www.nexusmods.com/battlebrothers/mods">Mods on Nexus<HyperlinkIcon /></a></p>
                <p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Battle Brothers Reddit<HyperlinkIcon /></a></p>
                <p><a href="http://battlebrothersgame.com">Battle Brothers Website<HyperlinkIcon /></a></p>
                <p><a href="mailto:unislash@bbplanner.xyz">Contact Me</a></p>
            </div>
        </div>
    );
};