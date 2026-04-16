import * as React from "react";

export interface CategoryButtonProps {
    name: string;
    selected: boolean;
    onClick: () => void;
}

export const CategoryButton = ({ name, selected, onClick }: CategoryButtonProps): JSX.Element => {
    return (
        <button
            className={`categoryButton ${selected ? "selected" : ""}`}
            onClick={onClick}
        >
            {name}
        </button>
    );
};
