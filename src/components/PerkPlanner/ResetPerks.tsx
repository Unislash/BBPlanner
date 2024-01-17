import Button from "@material-ui/core/Button/Button";
import ResetIcon from "@material-ui/icons/RotateLeft";
import * as React from "react";
import { usePerkActions } from "../../stores/perkStore";

export const ResetPerks = (): JSX.Element => {
    const { resetPerks } = usePerkActions();

    return (
        <Button variant="outlined" color="secondary" disableElevation className="resetPerks" onClick={resetPerks}>
            <ResetIcon />
            &nbsp;Reset Perks
        </Button>
    );
};
