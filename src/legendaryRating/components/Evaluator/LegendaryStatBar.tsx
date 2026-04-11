import classcat from "classcat";
import * as React from "react";
import { ChangeEvent } from "react";

type Tone = "red" | "yellow" | "blue" | "brown" | "gray";

interface StatInput {
    max: number;
    min: number;
    onChange: (value: number) => void;
    value: number;
}

interface LegendaryStatBarProps {
    icon: string;
    label: string;
    primary: StatInput;
    rangeText: string;
    secondary?: StatInput;
    tone: Tone;
    valueFormatter?: (value: number) => string;
}

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

const getPercentile = (value: number, min: number, max: number) => {
    if (min === max) {
        return 100;
    }

    return clamp(((value - min) / (max - min)) * 100, 0, 100);
};

const getOrdinalSuffix = (value: number) => {
    const mod100 = value % 100;
    if (mod100 >= 11 && mod100 <= 13) {
        return "th";
    }

    switch (value % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

const formatPercentile = (value: number) => {
    const roundedValue = Math.round(value);
    return `${roundedValue}%`;
};

const sanitizeInteger = (value: string) => {
    const sanitizedValue = value.replace(/[^\d-]/g, "");
    if (!sanitizedValue) {
        return "0";
    }

    if (sanitizedValue === "-") {
        return "0";
    }

    const [firstCharacter, ...remainingCharacters] = sanitizedValue;
    const remainingDigits = remainingCharacters.join("").replace(/-/g, "");

    return `${firstCharacter === "-" ? "-" : ""}${(firstCharacter === "-" ? remainingDigits : `${firstCharacter}${remainingDigits}`).replace(/-/g, "")}`;
};

export const LegendaryStatBar = ({
    icon,
    label,
    primary,
    rangeText,
    secondary,
    tone,
    valueFormatter,
}: LegendaryStatBarProps): JSX.Element => {
    const primaryPercentile = formatPercentile(getPercentile(primary.value, primary.min, primary.max));
    const secondaryPercentile = secondary
        ? formatPercentile(getPercentile(secondary.value, secondary.min, secondary.max))
        : undefined;

    const handlePrimaryChange = (event: ChangeEvent<HTMLInputElement>) => {
        primary.onChange(parseInt(sanitizeInteger(event.target.value), 10));
    };

    const handleSecondaryChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!secondary) {
            return;
        }

        secondary.onChange(parseInt(sanitizeInteger(event.target.value), 10));
    };

    return (
        <div className={classcat(["legendaryStatBar", `legendaryStatBar_${tone}`])}>
            <img className="legendaryStatIcon" src={icon} />
            <div className="legendaryStatMeta">
                <div className="legendaryStatLabel">{label}</div>
                <div className="legendaryStatRange">{rangeText}</div>
            </div>
            <div className="legendaryStatValueGroup">
                <div className="legendaryStatInputs">
                    <input
                        className="legendaryStatInput"
                        inputMode="numeric"
                        value={primary.value}
                        onChange={handlePrimaryChange}
                        aria-label={`${label} primary value`}
                    />
                    {secondary && (
                        <>
                            <span className="legendaryStatSeparator">-</span>
                            <input
                                className="legendaryStatInput"
                                inputMode="numeric"
                                value={secondary.value}
                                onChange={handleSecondaryChange}
                                aria-label={`${label} secondary value`}
                            />
                        </>
                    )}
                </div>
            </div>
            <div className="legendaryStatPercentiles">
                <span className="legendaryStatPercentileLabel">Roll percentile</span>
                <strong className="legendaryStatPercentileValue">
                    {primaryPercentile}
                    {secondaryPercentile ? ` / ${secondaryPercentile}` : ""}
                </strong>
            </div>
        </div>
    );
};
