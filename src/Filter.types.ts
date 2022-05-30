export interface FilterProps {
    clearFilterText: string;
    clearable: boolean;
    disabled: boolean;
    onChange: (filter: string) => void;
    placeholder: string;
    value: string;
}