import React from 'react';
import { FilterProps } from './Filter.types';

const Filter = ({
  clearFilterText,
  clearable,
  disabled,
  onChange,
  placeholder,
  value
}: FilterProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClickClear = () => {
    onChange('');
  };

  return (
    <div className="msts__filter">
      <input
        className="msts__filter-input"
        type="text"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {clearable && value && !disabled ? (
        <span
          className="msts__filter-clear"
          title={clearFilterText}
          onClick={handleClickClear}
        />
      ) : null}
    </div>
  );
};

export default Filter;
