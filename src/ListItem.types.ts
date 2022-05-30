import { Value } from "./ColumnSelect.types";

export interface ListItemProps {
    disabled?: boolean;
    highlight?: boolean;
    label?: string;
    onClick: (value: Value) => void;
    value: Value;
}