export const maxLevel = 11;

export const getAvailableNumberOfPerks = (currentPerkAmount: number,
                                          maxLevel: number,
                                          isStudent: boolean): number => {
    let remainingPerks = maxLevel - 1;
    remainingPerks -= currentPerkAmount;
    if (isStudent) {
        remainingPerks += 1;
    }

    return remainingPerks;
};