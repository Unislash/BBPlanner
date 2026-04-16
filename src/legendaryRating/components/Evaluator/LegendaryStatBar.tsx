import classcat from "classcat";
import * as React from "react";
import { type ChangeEvent, useEffect, useState } from "react";

type Tone = "red" | "yellow" | "blue" | "brown" | "gray";

interface StatInput {
    max: number;
    min: number;
    onChange: (value: number) => void;
    value: number;
}

interface LegendaryStatBarProps {
    icon: string;
    isModified: boolean;
    label: string;
    primary: StatInput;
    rangeText: string;
    secondary?: StatInput;
    tone: Tone;
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

const formatPercentile = (value: number) => {
    const roundedValue = Math.round(value);
    return `${roundedValue}%`;
};

const normalizeIntegerInput = (value: string) => {
    const digitMatches = value.match(/\d/g) || [];
    const hasLeadingNegativeSign = value.trim().startsWith("-");

    if (digitMatches.length === 0) {
        return hasLeadingNegativeSign ? "-" : "";
    }

    return `${hasLeadingNegativeSign ? "-" : ""}${digitMatches.join("")}`;
};

const parseIntegerInput = (value: string) => {
    const normalizedValue = normalizeIntegerInput(value);
    if (normalizedValue === "" || normalizedValue === "-") {
        return undefined;
    }

    return parseInt(normalizedValue, 10);
};

export const LegendaryStatBar = ({
    icon,
    isModified,
    label,
    primary,
    rangeText,
    secondary,
    tone,
}: LegendaryStatBarProps): JSX.Element => {
    const [primaryInputValue, setPrimaryInputValue] = useState(`${primary.value}`);
    const [secondaryInputValue, setSecondaryInputValue] = useState(secondary ? `${secondary.value}` : "");

    useEffect(() => {
        setPrimaryInputValue(`${primary.value}`);
    }, [primary.value]);

    useEffect(() => {
        setSecondaryInputValue(secondary ? `${secondary.value}` : "");
    }, [secondary, secondary?.value]);

    const primaryPercentile = formatPercentile(getPercentile(primary.value, primary.min, primary.max));
    const secondaryPercentile = secondary
        ? formatPercentile(getPercentile(secondary.value, secondary.min, secondary.max))
        : undefined;
    const averagePercentile = secondary
        ? (getPercentile(primary.value, primary.min, primary.max) +
              getPercentile(secondary.value, secondary.min, secondary.max)) /
          2
        : getPercentile(primary.value, primary.min, primary.max);
    const appraisalTierLabel = !isModified
        ? ""
        : averagePercentile >= 90
          ? "Masterwork"
          : averagePercentile >= 75
            ? "Exquisite"
            : averagePercentile >= 50
              ? "Superior"
              : "Improved";

    const handlePrimaryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const normalizedValue = normalizeIntegerInput(event.target.value);
        setPrimaryInputValue(normalizedValue);

        const parsedValue = parseIntegerInput(normalizedValue);
        if (parsedValue !== undefined) {
            primary.onChange(parsedValue);
        }
    };

    const handleSecondaryChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!secondary) {
            return;
        }

        const normalizedValue = normalizeIntegerInput(event.target.value);
        setSecondaryInputValue(normalizedValue);

        const parsedValue = parseIntegerInput(normalizedValue);
        if (parsedValue !== undefined) {
            secondary.onChange(parsedValue);
        }
    };

    const handlePrimaryBlur = () => {
        setPrimaryInputValue(`${primary.value}`);
    };

    const handleSecondaryBlur = () => {
        if (!secondary) {
            return;
        }

        setSecondaryInputValue(`${secondary.value}`);
    };

    return (
        <div
            className={classcat([
                "legendaryStatBar",
                `legendaryStatBar_${tone}`,
                isModified ? "legendaryStatBar_modified" : "legendaryStatBar_reference",
                averagePercentile >= 90 && isModified && "legendaryStatBar_masterwork",
            ])}
        >
            <div className="legendaryStatGlyph">
                <img alt="" className="legendaryStatIcon" src={icon} />
            </div>
            <div className="legendaryStatMeta">
                <div className="legendaryStatLabelRow">
                    <div className="legendaryStatLabel">{label}</div>
                    {isModified && <span className="legendaryStatChangedBadge">{appraisalTierLabel}</span>}
                </div>
                <div className="legendaryStatRange">{rangeText}</div>
            </div>
            <div className="legendaryStatValueGroup">
                <div className="legendaryStatInputs">
                    <input
                        className="legendaryStatInput"
                        inputMode="numeric"
                        value={primaryInputValue}
                        onChange={handlePrimaryChange}
                        onBlur={handlePrimaryBlur}
                        aria-label={`${label} primary value`}
                    />
                    {secondary && (
                        <>
                            <span className="legendaryStatSeparator">-</span>
                            <input
                                className="legendaryStatInput"
                                inputMode="numeric"
                                value={secondaryInputValue}
                                onChange={handleSecondaryChange}
                                onBlur={handleSecondaryBlur}
                                aria-label={`${label} secondary value`}
                            />
                        </>
                    )}
                </div>
            </div>
            {isModified && (
                <div className="legendaryStatPercentiles">
                    <span className="legendaryStatPercentileLabel">Quality</span>
                    <strong className="legendaryStatPercentileValue">
                        {primaryPercentile}
                        {secondaryPercentile ? ` / ${secondaryPercentile}` : ""}
                    </strong>
                    <div className="legendaryStatPercentileBar">
                        <span
                            className="legendaryStatPercentileFill"
                            style={{ width: `${Math.max(6, averagePercentile)}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
