import { Value, Option } from "./ColumnSelect.types";

export interface ListProps {
    disabled: boolean;
    onClick: (value: Value) => void;
    options: Option[];
}