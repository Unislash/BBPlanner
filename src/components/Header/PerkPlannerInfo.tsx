import * as React from "react";
import { useActivePerkIds, useIsStudent } from "../../stores/perkStore";
import { RemainingPerks } from "./RemainingPerks";
import { RequiredLevel } from "./RequiredLevel";

export const PerkPlannerInfo = (): JSX.Element => {
    const currentPerkAmount = useActivePerkIds().length;
    const isStudent = useIsStudent();

    return (
        <div className="perkPlannerInfo">
            <RequiredLevel isStudent={isStudent} currentPerkAmount={currentPerkAmount} />
            <RemainingPerks isStudent={isStudent} currentPerkAmount={currentPerkAmount} />
        </div>
    );
};
