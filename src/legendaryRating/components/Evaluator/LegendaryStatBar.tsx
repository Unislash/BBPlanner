import classcat from "classcat";
import * as React from "react";
import { type ChangeEvent, useEffect, useState } from "react";

type Tone = "red" | "yellow" | "blue" | "brown" | "gray";

interface StatInput {
    max: number;
    min: number;
    onCommit: (value: number) => void;
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

const isValueWithinRange = (value: number, min: number, max: number) => {
    const lowerBound = Math.min(min, max);
    const upperBound = Math.max(min, max);
    return value >= lowerBound && value <= upperBound;
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

    const primaryIsInvalid = !isValueWithinRange(primary.value, primary.min, primary.max);
    const secondaryIsInvalid = !!secondary && !isValueWithinRange(secondary.value, secondary.min, secondary.max);
    const hasInvalidValue = primaryIsInvalid || secondaryIsInvalid;

    useEffect(() => {
        setPrimaryInputValue(`${primary.value}`);
    }, [primary.value]);

    useEffect(() => {
        setSecondaryInputValue(secondary ? `${secondary.value}` : "");
    }, [secondary, secondary?.value]);

    const primaryPercentileValue = getPercentile(primary.value, primary.min, primary.max);
    const secondaryPercentileValue = secondary
        ? getPercentile(secondary.value, secondary.min, secondary.max)
        : undefined;
    const primaryPercentile = formatPercentile(primaryPercentileValue);
    const secondaryPercentile = secondaryPercentileValue !== undefined
        ? formatPercentile(secondaryPercentileValue)
        : undefined;
    const averagePercentile = secondary
        ? (primaryPercentileValue + secondaryPercentileValue!) / 2
        : primaryPercentileValue;
    const percentileValue = hasInvalidValue
        ? "Outside Range"
        : `${primaryPercentile}${secondaryPercentile ? ` / ${secondaryPercentile}` : ""}`;
    const percentileLabel = hasInvalidValue
        ? "Mistaken"
        : averagePercentile >= 90
          ? "Masterwork"
          : averagePercentile >= 75
            ? "Exquisite"
            : averagePercentile >= 50
              ? "Superior"
              : "Improved";

    const handlePrimaryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPrimaryInputValue(normalizeIntegerInput(event.target.value));
    };

    const handleSecondaryChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!secondary) {
            return;
        }

        setSecondaryInputValue(normalizeIntegerInput(event.target.value));
    };

    const handlePrimaryBlur = () => {
        const parsedValue = parseIntegerInput(primaryInputValue);
        if (parsedValue !== undefined) {
            primary.onCommit(parsedValue);
            setPrimaryInputValue(`${parsedValue}`);
            return;
        }

        setPrimaryInputValue(`${primary.value}`);
    };

    const handleSecondaryBlur = () => {
        if (!secondary) {
            return;
        }

        const parsedValue = parseIntegerInput(secondaryInputValue);
        if (parsedValue !== undefined) {
            secondary.onCommit(parsedValue);
            setSecondaryInputValue(`${parsedValue}`);
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
                hasInvalidValue && "legendaryStatBar_invalid",
                averagePercentile >= 90 && isModified && !hasInvalidValue && "legendaryStatBar_masterwork",
            ])}
        >
            <div className="legendaryStatGlyph">
                <img alt="" className="legendaryStatIcon" src={icon} />
            </div>
            <div className="legendaryStatMeta">
                <div className="legendaryStatLabel">{label}</div>
                <div className="legendaryStatRange">{rangeText}</div>
            </div>
            <div className="legendaryStatValueGroup">
                <div className="legendaryStatInputs">
                    <input
                        className={classcat(["legendaryStatInput", primaryIsInvalid && "legendaryStatInput_invalid"])}
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
                                className={classcat([
                                    "legendaryStatInput",
                                    secondaryIsInvalid && "legendaryStatInput_invalid",
                                ])}
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
                <div
                    className={classcat([
                        "legendaryStatPercentiles",
                        hasInvalidValue && "legendaryStatPercentiles_invalid",
                    ])}
                >
                    <span className="legendaryStatPercentileLabel">{percentileLabel}</span>
                    <strong className="legendaryStatPercentileValue">{percentileValue}</strong>
                    {!hasInvalidValue && (
                        <div className="legendaryStatPercentileBar">
                            <span
                                className="legendaryStatPercentileFill"
                                style={{ width: `${Math.max(6, averagePercentile)}%` }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
