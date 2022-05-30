import React, { ComponentClass, FunctionComponent } from "react";
import { FilterProps } from "./Filter.types";

export type Value = string | number;

export interface Option {
    name: string;
    value: Value;
    disabled?: boolean;
    highlight?: boolean;
}
  
export interface ColumnSelectProps {
    availableFooter?: React.ReactNode;
    availableHeader?: React.ReactNode;
    className?: string;
    clearFilterText?: string;
    clearable?: boolean;
    deselectAllText?: string;
    disabled?: boolean;
    filterBy?: (
        option: Option,
        filter: string
    ) => boolean;
    filterComponent?: FunctionComponent<FilterProps> | ComponentClass<FilterProps>;
    highlight?: Value[];
    limit?: number;
    onChange?: (options: Value[]) => void;
    options?: Option[];
    placeholder?: string;
    searchable?: boolean;
    selectAllText?: string;
    selectedFooter?: React.ReactNode;
    selectedHeader?: React.ReactNode;
    showControls?: boolean;
    value?: Value[];
}