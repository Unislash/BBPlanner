export const maxLevel = 11;

export const getAvailableNumberOfPerks = (
    currentPerkAmount: number,
    maxLevel: number,
    isStudent: boolean
): number => {
    let remainingPerks = maxLevel - 1;
    remainingPerks -= currentPerkAmount;
    if (isStudent) {
        remainingPerks += 1;
    }

    return remainingPerks;
};

const perksByRows: { [key: number]: string[]; } = {
    0: [
        'fastAdaption',
        'cripplingStrikes',
        'colossus',
        'nineLives',
        'bagsAndBelts',
        'pathfinder',
        'adrenaline',
        'recover',
        'student',
    ],
    1: [
        'executioner',
        'bullseye',
        'dodge',
        'fortifiedMind',
        'resilient',
        'steelBrow',
        'quickHands',
        'gifted',
    ],
    2: [
        'backstabber',
        'anticipation',
        'shieldExpert',
        'brawny',
        'relentless',
        'rotation',
        'rally',
        'taunt',
    ],
    3: [
        'maceMastery',
        'flailMastery',
        'hammerMastery',
        'axeMastery',
        'cleaverMastery',
        'swordMastery',
        'daggerMastery',
        'polearmMastery',
        'spearMastery',
        'crossbowMastery',
        'bowMastery',
        'throwingMastery',
    ],
    4: [
        'reachAdvantage',
        'overwhelm',
        'loneWolf',
        'underdog',
        'footwork',
    ],
    5: [
        'berserk',
        'headhunter',
        'nimble',
        'battleForged',
    ],
    6: [
        'fearsome',
        'duelist',
        'killingFrenzy',
        'indomitable',
    ],
};

/**
 * Fun algorithm: for any active perk, if the *number of perks* in previous rows is less
 * than the *number of previous rows*, the build is invalid.
 */
export const isBuildInvalid = (activePerks: string[]) => {
    const firstInvalidPerkId = activePerks.find(currentPerk => {
        // Find the row that the perk belongs to
        const rowNumberKey = Object.keys(perksByRows).find(row => {
            return !!perksByRows[parseInt(row)].find(perk => {
                return perk === currentPerk;
            });
        });
        const rowNumber = parseInt(rowNumberKey!);

        // Count the number of active perks in previous rows
        let previousRowsPerksCount = 0;
        for(let i = 0; i < rowNumber!; i++) {
            activePerks.forEach(perkId => {
                if (perksByRows[i].indexOf(perkId) > -1) {
                    previousRowsPerksCount += 1;
                }
            });
        }

        // Determine if the perk is invalid
        if (rowNumber! > previousRowsPerksCount) {
            return true;
        }
    });

    return !!firstInvalidPerkId;
};