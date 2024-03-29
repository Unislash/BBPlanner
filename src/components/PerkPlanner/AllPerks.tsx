import fastAdaption from '../../images/perks/fast-adaption.png';
import cripplingStrikes from '../../images/perks/crippling-strikes.png';
import colossus from '../../images/perks/colossus.png';
import nineLives from '../../images/perks/nine-lives.png';
import bagsAndBelts from '../../images/perks/bags-and-belts.png';
import pathfinder from '../../images/perks/pathfinder.png';
import adrenaline from '../../images/perks/adrenaline.png';
import recover from '../../images/perks/recover.png';
import student from '../../images/perks/student.png';
import executioner from '../../images/perks/executioner.png';
import bullseye from '../../images/perks/bullseye.png';
import dodge from '../../images/perks/dodge.png';
import fortifiedMind from '../../images/perks/fortified-mind.png';
import resilient from '../../images/perks/resilient.png';
import steelBrow from '../../images/perks/steel-brow.png';
import quickHands from '../../images/perks/quick-hands.png';
import gifted from '../../images/perks/gifted.png';
import backstabber from '../../images/perks/backstabber.png';
import anticipation from '../../images/perks/anticipation.png';
import shieldExpert from '../../images/perks/shield-expert.png';
import brawny from '../../images/perks/brawny.png';
import relentless from '../../images/perks/relentless.png';
import rotation from '../../images/perks/rotation.png';
import rally from '../../images/perks/rally.png';
import taunt from '../../images/perks/taunt.png';
import maceMastery from '../../images/perks/mace-mastery.png';
import flailMastery from '../../images/perks/flail-mastery.png';
import hammerMastery from '../../images/perks/hammer-mastery.png';
import axeMastery from '../../images/perks/axe-mastery.png';
import cleaverMastery from '../../images/perks/cleaver-mastery.png';
import swordMastery from '../../images/perks/sword-mastery.png';
import daggerMastery from '../../images/perks/dagger-mastery.png';
import polearmMastery from '../../images/perks/polearm-mastery.png';
import spearMastery from '../../images/perks/spear-mastery.png';
import crossbowMastery from '../../images/perks/crossbow-mastery.png';
import bowMastery from '../../images/perks/bow-mastery.png';
import throwingMastery from '../../images/perks/throwing-mastery.png';
import reachAdvantage from '../../images/perks/reach-advantage.png';
import overwhelm from '../../images/perks/overwhelm.png';
import loneWolf from '../../images/perks/lone-wolf.png';
import underdog from '../../images/perks/underdog.png';
import footwork from '../../images/perks/footwork.png';
import berserk from '../../images/perks/berserk.png';
import headhunter from '../../images/perks/headhunter.png';
import nimble from '../../images/perks/nimble.png';
import battleForged from '../../images/perks/battle-forged.png';
import fearsome from '../../images/perks/fearsome.png';
import duelist from '../../images/perks/duelist.png';
import killingFrenzy from '../../images/perks/killing-frenzy.png';
import indomitable from '../../images/perks/indomitable.png';

import * as React from 'react';
import {Perk} from './Perk';
import {PerkTooltipHeader} from './PerkTooltipHeader';
import classcat from 'classcat';
import {useActivePerkIds, useCanAddPerk, usePerkActions} from '../../stores/perkStore';

const tooltips = {
    fastAdaption: <><PerkTooltipHeader title="Fast Adaptation" />Adapt to your opponent's moves! Gain an additional stacking +10% chance to hit with each attack that misses an opponent. Bonus is reset upon landing a hit.</>,
    cripplingStrikes: <><PerkTooltipHeader title="Crippling Strikes" /> Cripple your enemies! Lowers the threshold to inflict injuries by 33% for both melee and ranged attacks.</>,
    colossus: <><PerkTooltipHeader title="Colossus" />Bring it on! Hitpoints are increased by 25%, which also reduces the chance to sustain debilitating injuries when being hit.</>,
    nineLives: <><PerkTooltipHeader title="Nine Lives" />Once per battle, upon receiving a killing blow, survive instead with a few hitpoints left (11-15) and have all damage over time effects (e.g. bleeding, poisoned) cured. The next hit is likely to kill you for good, of course, but improved defensive stats until your next turn help you to survive until then (+15 Melee Defense, Ranged Defense, Resolve, and Initiative).</>,
    bagsAndBelts: <><PerkTooltipHeader title="Bags and Belts" />Unlock two extra bag slots to carry all your favorite things. Items placed in bags no longer give a penalty to Maximum Fatigue, except for two-handed weapons and shields.</>,
    pathfinder: <><PerkTooltipHeader title="Pathfinder" />Learn to move on difficult terrain. Action Point costs for movement on all terrain is reduced by -1 to a minimum of 2 Action Points per tile, and Fatigue cost is reduced to half. Changing height levels also has no additional Action Point cost anymore.</>,
    adrenaline: <><PerkTooltipHeader title="Adrenaline" />Unlocks the 'Adrenaline' skill which costs 1 AP and 25 Fatigue to be used and puts you first in the turn order for the next round, to have another turn before your enemies do. Feel the adrenaline rushing through your veins!</>,
    recover: <><PerkTooltipHeader title="Recover" />Unlocks the 'Recover' skill which allows for resting a turn (spend 9 AP) in order to reduce accumulated Fatigue by 50%.</>,
    student: <><PerkTooltipHeader title="Student" />Everything can be learned if you put your mind to it. Gain additional 20% experience from battle. At the eleventh character level, you gain an additional perk point and this perk becomes inert.</>,
    executioner: <><PerkTooltipHeader title="Executioner" />Inflict additional 20% damage against targets that have sustained any injury effects, like a broken arm.</>,
    bullseye: <><PerkTooltipHeader title="Bullseye" />Nailed it! The penalty to hitchance when shooting at a target that has no clear line of fire is reduced from 75% to 50% for ranged weapons. This affects an initial, separate, undisplayed roll which determines whether the shot hits the intended target, and only applies when the intended target has Cover. See Combat Mechanics for further details.</>,
    dodge: <><PerkTooltipHeader title="Dodge" />Too fast for you! Gain 15% of the character's Initiative as a bonus to Melee and Ranged Defense.</>,
    fortifiedMind: <><PerkTooltipHeader title="Fortified Mind" />An iron will is not swayed from the true path easily. Resolve is increased by 25%.</>,
    resilient: <><PerkTooltipHeader title="Resilient" />Keep it together! Any status effect with a finite duration (e.g. Bleeding, Charmed) has its duration reduced to 1 turn. Status effects that have their effects grow weaker over several turns (e.g. Goblin Poison) are at their weakest state from the start.</>,
    steelBrow: <><PerkTooltipHeader title="Steel Brow" />Hits to the head no longer cause critical damage to this character, which also lowers the risk of sustaining debilitating head injuries significantly.</>,
    quickHands: <><PerkTooltipHeader title="Quick Hands" />Looking for this? Swapping any item in battle except for shields becomes a free action with no Action Point cost once every turn.</>,
    gifted: <><PerkTooltipHeader title="Gifted" />Mercenary life comes easy when you're naturally gifted. Instantly gain a levelup to increase this character's attributes with maximum rolls but without talents.</>,
    backstabber: <><PerkTooltipHeader title="Backstabber" />Honor doesn't win you fights, stabbing the enemy where it hurts does. The bonus to hitchance in melee is doubled to +10% for each ally, including Wardogs, surrounding and distracting your target.</>,
    anticipation: <><PerkTooltipHeader title="Anticipation" />When being attacked with ranged weapons, gain 1 +10% of your base Ranged Defense as additional Ranged Defense per tile that the attacker is away, and always at least +10 to Ranged Defense.</>,
    shieldExpert: <><PerkTooltipHeader title="Shield Expert" />Learn to better deflect hits to the side instead of blocking them head on. The shield defense bonus is increased by 25%. This also applies to the amplified shield bonus from the Shieldwall skill. Additionally, shield damage received is reduced by 50% to a minimum of 1. The knock back skill gains +15% chance to hit.</>,
    brawny: <><PerkTooltipHeader title="Brawny" />The fatigue penalty from wearing armor and helmet is reduced by 30%</>,
    relentless: <><PerkTooltipHeader title="Relentless" />Don't slow down! At all times your Initiative is reduced only by 50% of your accumulated Fatigue, instead of all of it. In addition, using the 'Wait' command will no longer give you a penalty to Initiative in the next round (normally a 25% penalty).</>,
    rotation: <><PerkTooltipHeader title="Rotation" />Unlocks the 'Rotation' skill which costs 3 AP and 25 Fatigue to be used and allows two characters to switch places while ignoring zone of control as long as neither character is stunned, rooted or otherwise disabled.</>,
    rally: <><PerkTooltipHeader title="Rally the Troops" />Unlocks the 'Rally the Troops' skill. Rally costs 5 AP, 25 Fatigue and triggers a morale check to raise morale of any ally at Wavering or worse morale within 4 tiles; with a bonus of 40% of the skill user's Resolve, and a penalty of -10 per tile of distance, to the roll. It can also rally fleeing and panicked allies within the same range at no penalty.</>,
    taunt: <><PerkTooltipHeader title="Taunt" />Unlocks the 'Taunt' skill which costs 4 AP and 15 Fatigue to be used and makes opponents take offensive actions instead of defensive ones, and attack the taunting character over another potentially more vulnerable ones.</>,
    maceMastery: <><PerkTooltipHeader title="Mace Mastery" />Master maces to beat your opponents into submission, armored or not. Skills build up 25% less Fatigue. Knock Out, Knock Over and Strike Down have a 100% chance to stun the target if not immune. The Polemace no longer has a penalty for attacking targets directly adjacent.</>,
    flailMastery: <><PerkTooltipHeader title="Flail Mastery" />Master flails and circumvent your opponent's shield. Skills build up 25% less Fatigue. Lash and Hail ignore the defense bonus of shield. Pound ignores an additional +10% of armor on head hits. Thresh gains +5% chance to hit.</>,
    hammerMastery: <><PerkTooltipHeader title="Hammer Mastery" />Master hammers and fighting against heavily armored opponents. Skills build up 25% less Fatigue. Destroy Armor and Demolish Armor inflict 33% more damage against armor. Shatter gains +5% chance to hit. The Polehammer no longer has a penalty for attacking targets directly adjacent.</>,
    axeMastery: <><PerkTooltipHeader title="Axe Mastery" />Master combat with axes and destroying shields. Skills build up 25% less Fatigue. Split Shield damage to shields is increased by 50% when used with axes. Round Swing gains +5% chance to hit. The Longaxe no longer has a penalty for attacking targets directly adjacent.</>,
    cleaverMastery: <><PerkTooltipHeader title="Cleaver Mastery" />Master cleavers to inflict gruesome wounds. Skills build up 25% less Fatigue. Bleeding damage inflicted by cleavers and whips is doubled to 10 and 20 per turn, respectively. Disarm no longer has a penalty to hit.</>,
    swordMastery: <><PerkTooltipHeader title="Sword Mastery" />Master the art of swordfighting and using your opponent's mistakes to your advantage. Skills build up 25% less Fatigue. Riposte no longer has a penalty to hitchance. Gash has a 50% lower threshold to inflict injuries. Split and Swing gain a +10% chance to hit.</>,
    daggerMastery: <><PerkTooltipHeader title="Dagger Mastery" />Master swift and deadly daggers. Skills build up 25% less Fatigue. Stab, Puncture, and Deathblow now costs 3 AP to use (instead of 4), which allows for an additional attack each turn.</>,
    polearmMastery: <><PerkTooltipHeader title="Polearm Mastery" />Master polearms and keeping the enemy at bay. Skills build up 25% less Fatigue. Polearm skills have their Action Point cost reduced to 5, and no longer have a penalty for attacking targets directly adjacent.</>,
    spearMastery: <><PerkTooltipHeader title="Spear Mastery" />Master fighting with spears and keeping the enemy at bay. Skills build up 25% less Fatigue. Spearwall is no longer disabled once an opponent manages to overcome it. Instead, Spearwall continues to give free attacks on any further opponent attempting to enter the Zone of Control. The Spetum and Warfork no longer has a penalty for attacking targets directly adjacent.</>,
    crossbowMastery: <><PerkTooltipHeader title="Crossbow Mastery" />Master crossbows and firearms, learn where to aim best. Skills build up 25% less Fatigue. An additional 20% of damage inflicted with crossbows ignores armor. Handgonnes now require 6 Action Points to reload and can be fired every turn instead of every other turn.</>,
    bowMastery: <><PerkTooltipHeader title="Bow Mastery" />Master the art of archery and pelting your opponents with arrows from afar. Skills build up 25% less Fatigue. View range and maximum firing range with bows is increased by 1.</>,
    throwingMastery: <><PerkTooltipHeader title="Throwing Mastery" />Master throwing weapons to wound or kill the enemy before they even get close. Skills build up 25% less Fatigue. Damage is increased by 30% when attacking at 2 tiles of distance. Damage is increased by 20% when attacking at 3 tiles of distance.</>,
    reachAdvantage: <><PerkTooltipHeader title="Reach Advantage" />Learn to use the superior reach of large weapons to keep the enemy from getting close enough to land a good hit. Each hit with a two-handed melee weapon add as a stack of Reach Advantage that increases your Melee Defense by +5, up to a maximum of 5 stacks, until this character`s next turn. A single attack hitting multiple targets can add several stacks at once. If you put away your weapon, you lose all stacks.</>,
    overwhelm: <><PerkTooltipHeader title="Overwhelm" />Learn to take advantage of your high initiative and prevent the enemy from attacking effectively by overwhelming them with your attacks! With every attack, hit or miss, against an opponent that acts after you in the current round, inflict the 'Overwhelmed' status effect which lowers both Melee Skill and Ranged Skill by 10% for one turn. The effect stacks with each attack and can be applied to multiple targets at once with a single attack.</>,
    loneWolf: <><PerkTooltipHeader title="Lone Wolf" />I work best alone. With no ally within 3 tiles of distance, gain a 15% bonus to Melee Skill, Ranged Skill, Melee Defense, Ranged Defense, and Resolve.</>,
    underdog: <><PerkTooltipHeader title="Underdog" />I'm used to it. Any defense malus due to being surrounded by opponents no longer applies to this character. If an attacker has the Backstabber perk, the effect of that perk is negated, and the normal defense malus due to being surrounded is applied instead.</>,
    footwork: <><PerkTooltipHeader title="Footwork" />Unlocks the 'Footwork' skill which costs 3 AP and 20 Fatigue to be used and allows you to leave a zone of control without triggering free attacks by using skillful footwork.</>,
    berserk: <><PerkTooltipHeader title="Berserk" />RAARGH! Once per turn, upon killing an enemy, 4 Action Points are immediately regained. Characters can not regain more than their maximum Action Points and no more than 4 for a single attack.</>,
    headhunter: <><PerkTooltipHeader title="Head Hunter" />Go for the head! Hitting the head of a target will give you a guaranteed hit to the head also with your next attack. Connecting with your hit will reset the effect.</>,
    nimble: <><PerkTooltipHeader title="Nimble" />Specialize in light armor! By nimbly dodging or deflecting blows, gain the chance to convert any hits to glancing hits. Hitpoint damage taken is reduced by up to 60%, but lowered exponentially by the total penalty to Maximum Fatigue from body and head armor above 15. The lighter your armor and helmet, the more you benefit. Brawny does not affect this perk. Does not affect damage from mental attacks or status effects, but can help to avoid receiving them.</>,
    battleForged: <><PerkTooltipHeader title="Battle Forged" />Specialize in heavy armor! Armor damage taken is reduced by a percentage equal to 5% of the total armor value of both body and head armor. The heavier your armor and helmet, the more you benefit.</>,
    fearsome: <><PerkTooltipHeader title="Fearsome" />Make them scatter and flee! Any attack that inflicts at least 1 point of damage to hitpoints triggers a morale check for the opponent with a penalty equal to 20% of your Resolve - 10, as opposed to no penalty and only if at or above 15 points of damage.</>,
    duelist: <><PerkTooltipHeader title="Duelist" />Become one with your weapon and go for the weak spots! With the offhand free or carrying a throwable tool (e.g. a throwing net), an additional +25% of any damage ignores armor. Does not work with two-handed weapons.</>,
    killingFrenzy: <><PerkTooltipHeader title="Killing Frenzy" />Go into a killing frenzy! A kill increases all damage by 25% for 2 turns. Does not stack, but another kill will reset the timer.</>,
    indomitable: <><PerkTooltipHeader title="Indomitable" />Unlocks the 'Indomitable' skill which costs 5 AP and 25 Fatigue to be used and grants a 50% damage reduction and immunity to being stunned, knocked back or grabbed for one turn.</>,
};

export const AllPerks = (): JSX.Element => {
    const activePerks = useActivePerkIds();
    const canAddPerk = useCanAddPerk();
    const {togglePerk} = usePerkActions();

    return (
        <div className={classcat(["allPerks", {canAddPerk: canAddPerk}])}>
            <div className="perkRow perkRow_one">
                <Perk isActive={isPerkActive("fastAdaption", activePerks)} onClick={() => togglePerk("fastAdaption")} image={fastAdaption} tooltipText={tooltips.fastAdaption} />
                <Perk isActive={isPerkActive("cripplingStrikes", activePerks)} onClick={() => togglePerk("cripplingStrikes")} image={cripplingStrikes} tooltipText={tooltips.cripplingStrikes} />
                <Perk isActive={isPerkActive("colossus", activePerks)} onClick={() => togglePerk("colossus")} image={colossus} tooltipText={tooltips.colossus} />
                <Perk isActive={isPerkActive("nineLives", activePerks)} onClick={() => togglePerk("nineLives")} image={nineLives} tooltipText={tooltips.nineLives} />
                <Perk isActive={isPerkActive("bagsAndBelts", activePerks)} onClick={() => togglePerk("bagsAndBelts")} image={bagsAndBelts} tooltipText={tooltips.bagsAndBelts} />
                <Perk isActive={isPerkActive("pathfinder", activePerks)} onClick={() => togglePerk("pathfinder")} image={pathfinder} tooltipText={tooltips.pathfinder} />
                <Perk isActive={isPerkActive("adrenaline", activePerks)} onClick={() => togglePerk("adrenaline")} image={adrenaline} tooltipText={tooltips.adrenaline} />
                <Perk isActive={isPerkActive("recover", activePerks)} onClick={() => togglePerk("recover")} image={recover} tooltipText={tooltips.recover} />
                <Perk isActive={isPerkActive("student", activePerks)} onClick={() => {togglePerk("student");}} image={student} tooltipText={tooltips.student} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("executioner", activePerks)} onClick={() => togglePerk("executioner")} image={executioner} tooltipText={tooltips.executioner} />
                <Perk isActive={isPerkActive("bullseye", activePerks)} onClick={() => togglePerk("bullseye")} image={bullseye} tooltipText={tooltips.bullseye} />
                <Perk isActive={isPerkActive("dodge", activePerks)} onClick={() => togglePerk("dodge")} image={dodge} tooltipText={tooltips.dodge} />
                <Perk isActive={isPerkActive("fortifiedMind", activePerks)} onClick={() => togglePerk("fortifiedMind")} image={fortifiedMind} tooltipText={tooltips.fortifiedMind} />
                <Perk isActive={isPerkActive("resilient", activePerks)} onClick={() => togglePerk("resilient")} image={resilient} tooltipText={tooltips.resilient} />
                <Perk isActive={isPerkActive("steelBrow", activePerks)} onClick={() => togglePerk("steelBrow")} image={steelBrow} tooltipText={tooltips.steelBrow} />
                <Perk isActive={isPerkActive("quickHands", activePerks)} onClick={() => togglePerk("quickHands")} image={quickHands} tooltipText={tooltips.quickHands} />
                <Perk isActive={isPerkActive("gifted", activePerks)} onClick={() => togglePerk("gifted")} image={gifted} tooltipText={tooltips.gifted} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("backstabber", activePerks)} onClick={() => togglePerk("backstabber")} image={backstabber} tooltipText={tooltips.backstabber} />
                <Perk isActive={isPerkActive("anticipation", activePerks)} onClick={() => togglePerk("anticipation")} image={anticipation} tooltipText={tooltips.anticipation} />
                <Perk isActive={isPerkActive("shieldExpert", activePerks)} onClick={() => togglePerk("shieldExpert")} image={shieldExpert} tooltipText={tooltips.shieldExpert} />
                <Perk isActive={isPerkActive("brawny", activePerks)} onClick={() => togglePerk("brawny")} image={brawny} tooltipText={tooltips.brawny} />
                <Perk isActive={isPerkActive("relentless", activePerks)} onClick={() => togglePerk("relentless")} image={relentless} tooltipText={tooltips.relentless} />
                <Perk isActive={isPerkActive("rotation", activePerks)} onClick={() => togglePerk("rotation")} image={rotation} tooltipText={tooltips.rotation} />
                <Perk isActive={isPerkActive("rally", activePerks)} onClick={() => togglePerk("rally")} image={rally} tooltipText={tooltips.rally} />
                <Perk isActive={isPerkActive("taunt", activePerks)} onClick={() => togglePerk("taunt")} image={taunt} tooltipText={tooltips.taunt} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("maceMastery", activePerks)} onClick={() => togglePerk("maceMastery")} image={maceMastery} tooltipText={tooltips.maceMastery} />
                <Perk isActive={isPerkActive("flailMastery", activePerks)} onClick={() => togglePerk("flailMastery")} image={flailMastery} tooltipText={tooltips.flailMastery} />
                <Perk isActive={isPerkActive("hammerMastery", activePerks)} onClick={() => togglePerk("hammerMastery")} image={hammerMastery} tooltipText={tooltips.hammerMastery} />
                <Perk isActive={isPerkActive("axeMastery", activePerks)} onClick={() => togglePerk("axeMastery")} image={axeMastery} tooltipText={tooltips.axeMastery} />
                <Perk isActive={isPerkActive("cleaverMastery", activePerks)} onClick={() => togglePerk("cleaverMastery")} image={cleaverMastery} tooltipText={tooltips.cleaverMastery} />
                <Perk isActive={isPerkActive("swordMastery", activePerks)} onClick={() => togglePerk("swordMastery")} image={swordMastery} tooltipText={tooltips.swordMastery} />
                <Perk isActive={isPerkActive("daggerMastery", activePerks)} onClick={() => togglePerk("daggerMastery")} image={daggerMastery} tooltipText={tooltips.daggerMastery} />
                <Perk isActive={isPerkActive("polearmMastery", activePerks)} onClick={() => togglePerk("polearmMastery")} image={polearmMastery} tooltipText={tooltips.polearmMastery} />
                <Perk isActive={isPerkActive("spearMastery", activePerks)} onClick={() => togglePerk("spearMastery")} image={spearMastery} tooltipText={tooltips.spearMastery} />
                <Perk isActive={isPerkActive("crossbowMastery", activePerks)} onClick={() => togglePerk("crossbowMastery")} image={crossbowMastery} tooltipText={tooltips.crossbowMastery} />
                <Perk isActive={isPerkActive("bowMastery", activePerks)} onClick={() => togglePerk("bowMastery")} image={bowMastery} tooltipText={tooltips.bowMastery} />
                <Perk isActive={isPerkActive("throwingMastery", activePerks)} onClick={() => togglePerk("throwingMastery")} image={throwingMastery} tooltipText={tooltips.throwingMastery} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("reachAdvantage", activePerks)} onClick={() => togglePerk("reachAdvantage")} image={reachAdvantage} tooltipText={tooltips.reachAdvantage} />
                <Perk isActive={isPerkActive("overwhelm", activePerks)} onClick={() => togglePerk("overwhelm")} image={overwhelm} tooltipText={tooltips.overwhelm} />
                <Perk isActive={isPerkActive("loneWolf", activePerks)} onClick={() => togglePerk("loneWolf")} image={loneWolf} tooltipText={tooltips.loneWolf} />
                <Perk isActive={isPerkActive("underdog", activePerks)} onClick={() => togglePerk("underdog")} image={underdog} tooltipText={tooltips.underdog} />
                <Perk isActive={isPerkActive("footwork", activePerks)} onClick={() => togglePerk("footwork")} image={footwork} tooltipText={tooltips.footwork} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("berserk", activePerks)} onClick={() => togglePerk("berserk")} image={berserk} tooltipText={tooltips.berserk} />
                <Perk isActive={isPerkActive("headhunter", activePerks)} onClick={() => togglePerk("headhunter")} image={headhunter} tooltipText={tooltips.headhunter} />
                <Perk isActive={isPerkActive("nimble", activePerks)} onClick={() => togglePerk("nimble")} image={nimble} tooltipText={tooltips.nimble} />
                <Perk isActive={isPerkActive("battleForged", activePerks)} onClick={() => togglePerk("battleForged")} image={battleForged} tooltipText={tooltips.battleForged} />
            </div>
            <div className="perkRow perkRow_two">
                <Perk isActive={isPerkActive("fearsome", activePerks)} onClick={() => togglePerk("fearsome")} image={fearsome} tooltipText={tooltips.fearsome} />
                <Perk isActive={isPerkActive("duelist", activePerks)} onClick={() => togglePerk("duelist")} image={duelist} tooltipText={tooltips.duelist} />
                <Perk isActive={isPerkActive("killingFrenzy", activePerks)} onClick={() => togglePerk("killingFrenzy")} image={killingFrenzy} tooltipText={tooltips.killingFrenzy} />
                <Perk isActive={isPerkActive("indomitable", activePerks)} onClick={() => togglePerk("indomitable")} image={indomitable} tooltipText={tooltips.indomitable} />
            </div>
        </div>
    );
};

const isPerkActive = (perkId: string, activePerkIds: string[]) => {
    return activePerkIds.indexOf(perkId) > -1;
};
