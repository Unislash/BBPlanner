import fastAdaption from '../images/perks/fast-adaption.png';
import cripplingStrikes from '../images/perks/crippling-strikes.png';
import colossus from '../images/perks/colossus.png';
import nineLives from '../images/perks/nine-lives.png';
import bagsAndBelts from '../images/perks/bags-and-belts.png';
import pathfinder from '../images/perks/pathfinder.png';
import adrenaline from '../images/perks/adrenaline.png';
import recover from '../images/perks/recover.png';
import student from '../images/perks/student.png';
import executioner from '../images/perks/executioner.png';
import bullseye from '../images/perks/bullseye.png';
import dodge from '../images/perks/dodge.png';
import fortifiedMind from '../images/perks/fortified-mind.png';
import resilient from '../images/perks/resilient.png';
import steelBrow from '../images/perks/steel-brow.png';
import quickHands from '../images/perks/quick-hands.png';
import gifted from '../images/perks/gifted.png';
import backstabber from '../images/perks/backstabber.png';
import anticipation from '../images/perks/anticipation.png';
import shieldExpert from '../images/perks/shield-expert.png';
import brawny from '../images/perks/brawny.png';
import relentless from '../images/perks/relentless.png';
import rotation from '../images/perks/rotation.png';
import rally from '../images/perks/rally.png';
import taunt from '../images/perks/taunt.png';
import maceMastery from '../images/perks/mace-mastery.png';
import flailMastery from '../images/perks/flail-mastery.png';
import hammerMastery from '../images/perks/hammer-mastery.png';
import axeMastery from '../images/perks/axe-mastery.png';
import cleaverMastery from '../images/perks/cleaver-mastery.png';
import swordMastery from '../images/perks/sword-mastery.png';
import daggerMastery from '../images/perks/dagger-mastery.png';
import polearmMastery from '../images/perks/polearm-mastery.png';
import spearMastery from '../images/perks/spear-mastery.png';
import crossbowMastery from '../images/perks/crossbow-mastery.png';
import bowMastery from '../images/perks/bow-mastery.png';
import throwingMastery from '../images/perks/throwing-mastery.png';
import reachAdvantage from '../images/perks/reach-advantage.png';
import overwhelm from '../images/perks/overwhelm.png';
import loneWolf from '../images/perks/lone-wolf.png';
import underdog from '../images/perks/underdog.png';
import footwork from '../images/perks/footwork.png';
import berserk from '../images/perks/berserk.png';
import headhunter from '../images/perks/headhunter.png';
import nimble from '../images/perks/nimble.png';
import battleForged from '../images/perks/battle-forged.png';
import fearsome from '../images/perks/fearsome.png';
import duelist from '../images/perks/duelist.png';
import killingFrenzy from '../images/perks/killing-frenzy.png';
import indomitable from '../images/perks/indomitable.png';

import * as React from 'react';
import {Perk} from './Perk';
import {PerkHeader} from './PerkHeader';
import {connect} from 'react-redux';
import {togglePerk, toggleStudent} from '../actions';
import {AppState} from '../reducers';

const tooltips = {
    fastAdaption: <><PerkHeader title="Fast Adaptation" />Adapt to your opponent's moves! Gain an additional stacking + 8% chance to hit with each attack that misses an opponent. Bonus is reset upon landing a hit.</>,
    cripplingStrikes: <><PerkHeader title="Crippling Strikes" /> Cripple your enemies! Lowers the threshold to inflict injuries by 33% for both melee and ranged attacks.</>,
    colossus: <><PerkHeader title="Colossus" />Bring it on! Hitpoints are increased by 25%, which also reduces the chance to sustain debilitating injuries when being hit.</>,
    nineLives: <><PerkHeader title="Nine Lives" />Once per battle, upon receiving a killing blow, survive instead with a few hitpoints left. The next hit is likely to kill you for good, of course.</>,
    bagsAndBelts: <><PerkHeader title="Bags and Belts" />Unlock two extra bag slots to carry all your favorite things. Items placed in bags no longer give a penalty to Maximum Fatigue, except for two-handed weapons and shields.</>,
    pathfinder: <><PerkHeader title="Pathfinder" />Learn to move on difficult terrain. Action Point costs for movement on all terrain is reduced by -1 to a minimum of 2 Action Points per tile, and Fatigue cost is reduced to half. Changing height levels also has no additional Action Point cost anymore.</>,
    adrenaline: <><PerkHeader title="Adrenaline" />Unlocks the 'Adrenaline' skill which costs 0 AP and 25 Fatigue to be used and puts you first in the turn order for the next round, to have another turn before your enemies do. Feel the adrenaline rushing through your veins!</>,
    recover: <><PerkHeader title="Recover" />Unlocks the 'Recover' skill which allows for resting a turn (spend 9 AP) in order to reduce accumulated Fatigue by 50%.</>,
    student: <><PerkHeader title="Student" />Everything can be learned if you put your mind to it. Gain additional 20% experience from battle. At the eleventh character level, you gain an additional perk point and this perk becomes inert.</>,
    executioner: <><PerkHeader title="Executioner" />Inflict additional 20% damage against targets that have sustained any injury effects, like a broken arm.</>,
    bullseye: <><PerkHeader title="Bullseye" />Nailed it! The penalty to hitchance when shooting at a target that has no clear line of fire is reduced from 75% to 50% for ranged weapons. This affects an initial, seperate, undisplayed roll which determines whether the shot hits the intended target, and only applies when the intended target has Cover. See Combat Mechanics for further details.</>,
    dodge: <><PerkHeader title="Dodge" />Too fast for you! Gain 15% of the character's Initiative as a bonus to Melee and Ranged Defense.</>,
    fortifiedMind: <><PerkHeader title="Fortified Mind" />An iron will is not swayed from the true path easily. Resolve is increased by 25%.</>,
    resilient: <><PerkHeader title="Resilient" />Keep it together! Any negative status effect with a finite duration (e.g. Bleeding, Charmed) has its duration reduced by -1 turn, to a minimum of 1 turn.</>,
    steelBrow: <><PerkHeader title="Steel Brow" />Hits to the head no longer cause critical damage to this character, which also lowers the risk of sustaining debilitating head injuries significantly.</>,
    quickHands: <><PerkHeader title="Quick Hands" />Looking for this? Swapping items in battle becomes a free action with no Action Point cost once every turn.</>,
    gifted: <><PerkHeader title="Gifted" />Mercenary life comes easy when you're naturally gifted. Instantly gain a levelup to increase this character's attributes with maximum rolls but without talents.</>,
    backstabber: <><PerkHeader title="Backstabber" />Honor doesn't win you fights, stabbing the enemy where it hurts does. The bonus to hitchance in melee is doubled to +10% for each ally, including Wardogs, surrounding and distracting your target.</>,
    anticipation: <><PerkHeader title="Anticipation" />When being attacked with ranged weapons, gain 1 + 10% of your base Ranged Defense as additional Ranged Defense per tile that the attacker is away.</>,
    shieldExpert: <><PerkHeader title="Shield Expert" />Learn to better deflect hits to the side instead of blocking them head on. The shield defense bonus is increased by 25%. This also applies to the amplified shield bonus from the Shieldwall skill. Additionally, shield damage received is reduced by 50% to a minimum of 1. The knock back skill gains +15% chance to hit.</>,
    brawny: <><PerkHeader title="Brawny" />The fatigue penalty from wearing armor and helmet is reduced by 25%</>,
    relentless: <><PerkHeader title="Relentless" />Don't slow down! At all times your Initiative is reduced only by 50% of your accumulated Fatigue, instead of all of it. You also don't lose Initiative when you wait instead of ending your turn anymore.</>,
    rotation: <><PerkHeader title="Rotation" />Unlocks the 'Rotation' skill which costs 3 AP and 25 Fatigue to be used and allows two characters to switch places while ignoring zone of control as long as neither character is stunned, rooted or otherwise disabled.</>,
    rally: <><PerkHeader title="Rally the Troops" />Unlocks the 'Rally the Troops' skill. Rally costs 6 AP, 25 Fatigue and triggers a morale check to raise morale of any ally at Wavering or worse morale within 4 tiles; with a bonus of 40% of the skill user's Resolve, and a penalty of -10 per tile of distance, to the roll. It can also rally fleeing and panicked allies.</>,
    taunt: <><PerkHeader title="Taunt" />Unlocks the 'Taunt' skill which costs 4 AP and 15 Fatigue to be used and makes opponents take offensive actions instead of defensive ones, and attack the taunting character over another potentially more vulnerable one.</>,
    maceMastery: <><PerkHeader title="Mace Mastery" />Master maces to beat your opponents into submission, armored or not. Skills build up 25% less Fatigue. Knock Out and Strike Down have a 100% chance to stun the target if not immune.</>,
    flailMastery: <><PerkHeader title="Flail Mastery" />Master flails and circumvent your opponent's shield. Skills build up 25% less Fatigue. Lash ignores the defense bonus of shield. Thresh gains +5% chance to hit.</>,
    hammerMastery: <><PerkHeader title="Hammer Mastery" />Master hammers and fighting against heavily armored opponents. Skills build up 25% less Fatigue. Destroy Armor and Demolish Armor inflict 33% more damage against armor. Shatter gains + 5% chance to hit. The Polehammer no longer has a penalty for attacking targets directly adjacent.</>,
    axeMastery: <><PerkHeader title="Axe Mastery" />Master combat with axes and destroying shields. Skills build up 25% less Fatigue. Split Shield damage to shields is increased by 50% when used with axes. Round Swing gains + 5% chance to hit. The Longaxe no longer has a penalty for attacking targets directly adjacent.</>,
    cleaverMastery: <><PerkHeader title="Cleaver Mastery" />Master cleavers to inflict gruesome wounds. Skills build up 25% less Fatigue. Bleeding damage inflicted by cleavers is doubled to 10 per turn.</>,
    swordMastery: <><PerkHeader title="Sword Mastery" />Master the art of swordfighting and using your opponent's mistakes to your advantage. Skills build up 25% less Fatigue. Riposte no longer has a penalty to hitchance. Split and Swing gain a + 5% chance to hit.</>,
    daggerMastery: <><PerkHeader title="Dagger Mastery" />Master swift and deadly daggers. Skills build up 25% less Fatigue. Stab and Puncture now costs 3 AP to use (instead of 4) which allows for an additional attack each turn.</>,
    polearmMastery: <><PerkHeader title="Polearm Mastery" />Master polearms and keeping the enemy at bay. Skills build up 25% less Fatigue. Polearm skills have their Action Point cost reduced to 5, and no longer have a penalty for attacking targets directly adjacent.</>,
    spearMastery: <><PerkHeader title="Spear Mastery" />Master fighting with spears and keeping the enemy at bay. Skills build up 25% less Fatigue. Spearwall is no longer disabled once an opponent manages to overcome it. Instead, Spearwall continues to give free attacks on any further opponent attempting to enter the Zone of Control. The Spetum no longer has a penalty for attacking targets directly adjacent.</>,
    crossbowMastery: <><PerkHeader title="Crossbow Mastery" />Master crossbows and learn where to aim best. Skills build up 25% less Fatigue. An additional 20% of damage inflicted with crossbows ignores armor.</>,
    bowMastery: <><PerkHeader title="Bow Mastery" />Master the art of archery and pelting your opponents with arrows from afar. Skills build up 25% less Fatigue. View range and maximum firing range with bows is increased by 1.</>,
    throwingMastery: <><PerkHeader title="Throwing Mastery" />Master throwing weapons to wound or kill the enemy before they even get close. Skills build up 25% less Fatigue. Damage is increased by 40% when attacking at 2 tiles of distance. Damage is increased by 20% when attacking at 3 tiles of distance.</>,
    reachAdvantage: <><PerkHeader title="Reach Advantage" />Learn to use the superior reach of large weapons to keep the enemy from getting close enough to land a good hit. Each hit with a two-handed melee weapon add as a stack of Reach Advantage that increases your Melee Defense by +5, up to a maximum of 5 stacks, until this character`s next turn. A single attack hitting multiple targets can add several stacks at once. If you put away your weapon, you lose all stacks.</>,
    overwhelm: <><PerkHeader title="Overwhelm" />Learn to take advantage of your high initiative and prevent the enemy from attacking effectively by overwhelming them with your attacks! With every attack, hit or miss, against an opponent that acts after you in the current round, inflict the 'Overwhelmed' status effect which lowers both Melee Skill and Ranged Skill by 10% for one turn. The effect stacks with each attack and can be applied to multiple targets at once with a single attack.</>,
    loneWolf: <><PerkHeader title="Lone Wolf" />I work best alone. With no ally within 3 tiles of distance, gain a 15% bonus to Melee Skill, Ranged Skill, Melee Defense, Ranged Defense, and Resolve.</>,
    underdog: <><PerkHeader title="Underdog" />I'm used to it. Any defense malus due to being surrounded by opponents no longer applies to this character. If an attacker has the Backstabber perk, the effect of that perk is negated, and the normal defense malus due to being surrounded is applied instead.</>,
    footwork: <><PerkHeader title="Footwork" />Unlocks the 'Footwork' skill which costs 3 AP and 25 Fatigue to be used and allows you to leave a zone of control without triggering free attacks by using skillful footwork.</>,
    berserk: <><PerkHeader title="Berserk" />RAARGH! Once per turn, upon killing an enemy, 4 Action Points are immediately regained. Characters can not regain more than their maximum Action Points and no more than 4 for a single attack.</>,
    headhunter: <><PerkHeader title="Head Hunter" />Go for the head! Gain +15% chance to hit the head for critical damage each time you hit the body. Bonus is reset upon hitting the head.</>,
    nimble: <><PerkHeader title="Nimble" />Specialize in light armor! By nimbly dodging or deflecting blows, gain the chance to convert any hits to glancing hits. Hitpoint damage taken is reduced by up to 75%, but lowered exponentially by the total penalty to Maximum Fatigue from body and head armor. The lighter your armor the more you benefit. Brawny does not affect this perk. Does not affect damage from status effects, but can help to avoid receiving them.</>,
    battleForged: <><PerkHeader title="Battle Forged" />Specialize in heavy armor! Armor damage taken is reduced by a percentage equal to 5% of the total armor value of both body and head armor. The heavier your armor and helmet, the more you benefit.</>,
    fearsome: <><PerkHeader title="Fearsome" />Make them scatter and flee! Any attack that inflicts at least 1 point of damage to hitpoints triggers a morale check for the opponent, as opposed to only if at or above 15 points of damage.</>,
    duelist: <><PerkHeader title="Duelist" />Become one with your weapon and go for the weak spots! With the offhand free, an additional + 25% of any damage ignores armor. Does not work with two-handed weapons.</>,
    killingFrenzy: <><PerkHeader title="Killing Frenzy" />Go into a killing frenzy! A kill increases all damage by 25% for 2 turns. Does not stack, but another kill will reset the timer.</>,
    indomitable: <><PerkHeader title="Indomitable" />Unlocks the 'Indomitable' skill which costs 3 AP and 20 Fatigue to be used and grants a 50% damage reduction and immunity to being stunned, knocked back or grabbed for one turn.</>,
};

interface AllPerksProps {
    activePerks: string[];
    togglePerk: (perkId: string) => void;
    toggleStudent: () => void;
}

export const AllPerksBase: React.FC<AllPerksProps> = props => {

    return (
        <div className="allPerks">
            <div className="perkRow perkRow_one">
                <Perk isActive={isPerkActive("fastAdaption", props.activePerks)} onClick={() => props.togglePerk("fastAdaption")} image={fastAdaption} tooltipText={tooltips.fastAdaption} />
                <Perk isActive={isPerkActive("cripplingStrikes", props.activePerks)} onClick={() => props.togglePerk("cripplingStrikes")} image={cripplingStrikes} tooltipText={tooltips.cripplingStrikes} />
                <Perk isActive={isPerkActive("colossus", props.activePerks)} onClick={() => props.togglePerk("colossus")} image={colossus} tooltipText={tooltips.colossus} />
                <Perk isActive={isPerkActive("nineLives", props.activePerks)} onClick={() => props.togglePerk("nineLives")} image={nineLives} tooltipText={tooltips.nineLives} />
                <Perk isActive={isPerkActive("bagsAndBelts", props.activePerks)} onClick={() => props.togglePerk("bagsAndBelts")} image={bagsAndBelts} tooltipText={tooltips.bagsAndBelts} />
                <Perk isActive={isPerkActive("pathfinder", props.activePerks)} onClick={() => props.togglePerk("pathfinder")} image={pathfinder} tooltipText={tooltips.pathfinder} />
                <Perk isActive={isPerkActive("adrenaline", props.activePerks)} onClick={() => props.togglePerk("adrenaline")} image={adrenaline} tooltipText={tooltips.adrenaline} />
                <Perk isActive={isPerkActive("recover", props.activePerks)} onClick={() => props.togglePerk("recover")} image={recover} tooltipText={tooltips.recover} />
                <Perk isActive={isPerkActive("student", props.activePerks)} onClick={() => {props.togglePerk("student"); props.toggleStudent();}} image={student} tooltipText={tooltips.student} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("executioner", props.activePerks)} onClick={() => props.togglePerk("executioner")} image={executioner} tooltipText={tooltips.executioner} />
                <Perk isActive={isPerkActive("bullseye", props.activePerks)} onClick={() => props.togglePerk("bullseye")} image={bullseye} tooltipText={tooltips.bullseye} />
                <Perk isActive={isPerkActive("dodge", props.activePerks)} onClick={() => props.togglePerk("dodge")} image={dodge} tooltipText={tooltips.dodge} />
                <Perk isActive={isPerkActive("fortifiedMind", props.activePerks)} onClick={() => props.togglePerk("fortifiedMind")} image={fortifiedMind} tooltipText={tooltips.fortifiedMind} />
                <Perk isActive={isPerkActive("resilient", props.activePerks)} onClick={() => props.togglePerk("resilient")} image={resilient} tooltipText={tooltips.resilient} />
                <Perk isActive={isPerkActive("steelBrow", props.activePerks)} onClick={() => props.togglePerk("steelBrow")} image={steelBrow} tooltipText={tooltips.steelBrow} />
                <Perk isActive={isPerkActive("quickHands", props.activePerks)} onClick={() => props.togglePerk("quickHands")} image={quickHands} tooltipText={tooltips.quickHands} />
                <Perk isActive={isPerkActive("gifted", props.activePerks)} onClick={() => props.togglePerk("gifted")} image={gifted} tooltipText={tooltips.gifted} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("backstabber", props.activePerks)} onClick={() => props.togglePerk("backstabber")} image={backstabber} tooltipText={tooltips.backstabber} />
                <Perk isActive={isPerkActive("anticipation", props.activePerks)} onClick={() => props.togglePerk("anticipation")} image={anticipation} tooltipText={tooltips.anticipation} />
                <Perk isActive={isPerkActive("shieldExpert", props.activePerks)} onClick={() => props.togglePerk("shieldExpert")} image={shieldExpert} tooltipText={tooltips.shieldExpert} />
                <Perk isActive={isPerkActive("brawny", props.activePerks)} onClick={() => props.togglePerk("brawny")} image={brawny} tooltipText={tooltips.brawny} />
                <Perk isActive={isPerkActive("relentless", props.activePerks)} onClick={() => props.togglePerk("relentless")} image={relentless} tooltipText={tooltips.relentless} />
                <Perk isActive={isPerkActive("rotation", props.activePerks)} onClick={() => props.togglePerk("rotation")} image={rotation} tooltipText={tooltips.rotation} />
                <Perk isActive={isPerkActive("rally", props.activePerks)} onClick={() => props.togglePerk("rally")} image={rally} tooltipText={tooltips.rally} />
                <Perk isActive={isPerkActive("taunt", props.activePerks)} onClick={() => props.togglePerk("taunt")} image={taunt} tooltipText={tooltips.taunt} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("maceMastery", props.activePerks)} onClick={() => props.togglePerk("maceMastery")} image={maceMastery} tooltipText={tooltips.maceMastery} />
                <Perk isActive={isPerkActive("flailMastery", props.activePerks)} onClick={() => props.togglePerk("flailMastery")} image={flailMastery} tooltipText={tooltips.flailMastery} />
                <Perk isActive={isPerkActive("hammerMastery", props.activePerks)} onClick={() => props.togglePerk("hammerMastery")} image={hammerMastery} tooltipText={tooltips.hammerMastery} />
                <Perk isActive={isPerkActive("axeMastery", props.activePerks)} onClick={() => props.togglePerk("axeMastery")} image={axeMastery} tooltipText={tooltips.axeMastery} />
                <Perk isActive={isPerkActive("cleaverMastery", props.activePerks)} onClick={() => props.togglePerk("cleaverMastery")} image={cleaverMastery} tooltipText={tooltips.cleaverMastery} />
                <Perk isActive={isPerkActive("swordMastery", props.activePerks)} onClick={() => props.togglePerk("swordMastery")} image={swordMastery} tooltipText={tooltips.swordMastery} />
                <Perk isActive={isPerkActive("daggerMastery", props.activePerks)} onClick={() => props.togglePerk("daggerMastery")} image={daggerMastery} tooltipText={tooltips.daggerMastery} />
                <Perk isActive={isPerkActive("polearmMastery", props.activePerks)} onClick={() => props.togglePerk("polearmMastery")} image={polearmMastery} tooltipText={tooltips.polearmMastery} />
                <Perk isActive={isPerkActive("spearMastery", props.activePerks)} onClick={() => props.togglePerk("spearMastery")} image={spearMastery} tooltipText={tooltips.spearMastery} />
                <Perk isActive={isPerkActive("crossbowMastery", props.activePerks)} onClick={() => props.togglePerk("crossbowMastery")} image={crossbowMastery} tooltipText={tooltips.crossbowMastery} />
                <Perk isActive={isPerkActive("bowMastery", props.activePerks)} onClick={() => props.togglePerk("bowMastery")} image={bowMastery} tooltipText={tooltips.bowMastery} />
                <Perk isActive={isPerkActive("throwingMastery", props.activePerks)} onClick={() => props.togglePerk("throwingMastery")} image={throwingMastery} tooltipText={tooltips.throwingMastery} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("reachAdvantage", props.activePerks)} onClick={() => props.togglePerk("reachAdvantage")} image={reachAdvantage} tooltipText={tooltips.reachAdvantage} />
                <Perk isActive={isPerkActive("overwhelm", props.activePerks)} onClick={() => props.togglePerk("overwhelm")} image={overwhelm} tooltipText={tooltips.overwhelm} />
                <Perk isActive={isPerkActive("loneWolf", props.activePerks)} onClick={() => props.togglePerk("loneWolf")} image={loneWolf} tooltipText={tooltips.loneWolf} />
                <Perk isActive={isPerkActive("underdog", props.activePerks)} onClick={() => props.togglePerk("underdog")} image={underdog} tooltipText={tooltips.underdog} />
                <Perk isActive={isPerkActive("footwork", props.activePerks)} onClick={() => props.togglePerk("footwork")} image={footwork} tooltipText={tooltips.footwork} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("berserk", props.activePerks)} onClick={() => props.togglePerk("berserk")} image={berserk} tooltipText={tooltips.berserk} />
                <Perk isActive={isPerkActive("headhunter", props.activePerks)} onClick={() => props.togglePerk("headhunter")} image={headhunter} tooltipText={tooltips.headhunter} />
                <Perk isActive={isPerkActive("nimble", props.activePerks)} onClick={() => props.togglePerk("nimble")} image={nimble} tooltipText={tooltips.nimble} />
                <Perk isActive={isPerkActive("battleForged", props.activePerks)} onClick={() => props.togglePerk("battleForged")} image={battleForged} tooltipText={tooltips.battleForged} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("fearsome", props.activePerks)} onClick={() => props.togglePerk("fearsome")} image={fearsome} tooltipText={tooltips.fearsome} />
                <Perk isActive={isPerkActive("duelist", props.activePerks)} onClick={() => props.togglePerk("duelist")} image={duelist} tooltipText={tooltips.duelist} />
                <Perk isActive={isPerkActive("killingFrenzy", props.activePerks)} onClick={() => props.togglePerk("killingFrenzy")} image={killingFrenzy} tooltipText={tooltips.killingFrenzy} />
                <Perk isActive={isPerkActive("indomitable", props.activePerks)} onClick={() => props.togglePerk("indomitable")} image={indomitable} tooltipText={tooltips.indomitable} />
            </div>
        </div>
    );
};

const isPerkActive = (perkId: string, activePerkIds: string[]) => {
    return activePerkIds.indexOf(perkId) > -1;
};

const mapStateToProps = (state: AppState) => ({
    activePerks: state.activePerkIds,
});

const mapDispatchToProps = {
    togglePerk,
    toggleStudent,
};

export const AllPerks = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AllPerksBase);