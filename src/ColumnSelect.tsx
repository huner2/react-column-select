import React from 'react';
import { filterBy as filterBuiltin } from './utils';
import Filter from './Filter';
import List from './List';
import { ColumnSelectProps, Option, Value } from './ColumnSelect.types';

import './style.css';

const ColumnSelect = ({
  availableFooter = null,
  availableHeader = null,
  className = '',
  clearFilterText = 'Clear',
  clearable = true,
  deselectAllText = 'Deselect all',
  disabled = false,
  filterBy = filterBuiltin,
  filterComponent = undefined,
  highlight = [],
  limit = -1,
  onChange = () => null,
  options = [],
  placeholder = '',
  searchable = false,
  selectAllText = 'Select all',
  selectedFooter = null,
  selectedHeader = null,
  showControls = false,
  value = []
}: ColumnSelectProps) => {
  const [filterAvailable, setFilterAvailable] = React.useState<string>('');
  const [filterSelected, setFilterSelected] = React.useState<string>('');

  const handleClickAvailable = (addedValue: Value) => {
    const newValue = [...value, addedValue];
    onChange(newValue);
  };

  const handleClickSelected = (removedValue: Value) => {
    const newValue = value.filter((item: Value) => item !== removedValue);
    onChange(newValue);
  };

  const handleClickSelectAll = () => {
    const previousValue = value.slice();
    const options = filterAvailableFn();

    const newValue = options.reduce((acc, option: Option) => {
      if (!option.disabled && previousValue.indexOf(option.value) === -1) {
        acc.push(option.value);
      }
      return acc;
    }, previousValue);

    let limitedValue = newValue;
    if (limit >= 0) {
      limitedValue = newValue.slice(0, limit);
    }

    limitedValue.sort();

    onChange(limitedValue);
  };

  const handleClickDeselectAll = () => {
    const previousValue = value.slice();
    const options = filterActiveFn();

    const optionsValueMap = options.reduce(
      (acc: Record<string, boolean>, option: Option) => {
        acc[option.value] = true;
        return acc;
      },
      {}
    );

    const newValue = previousValue.reduce((acc: Value[], value) => {
      if (!optionsValueMap[value]) {
        acc.push(value);
      }
      return acc;
    }, []);

    onChange(newValue);
  };

  const filterAvailableFn = (): Option[] => {
    const filtered = options.reduce((acc: Option[], option) => {
      if (value.indexOf(option.value) === -1) {
        acc.push(option);
      }

      return acc;
    }, []);

    let limited = filtered;
    if (limit >= 0 && value.length >= limit) {
      limited = filtered.map((option) => {
        return Object.assign({}, option, { disabled: true });
      });
    }

    if (highlight && highlight.length > 0) {
      limited = limited.map((option) => {
        if (highlight.indexOf(option.value) !== -1) {
          return Object.assign({}, option, { highlight: true });
        }

        return option;
      });
    }

    if (!searchable) {
      return limited;
    }

    if (filterAvailable) {
      return limited.filter((option) => filterBy(option, filterAvailable));
    }

    return limited;
  };

  const filterActiveFn = (): Option[] => {
    const filtered = options.reduce((acc: Option[], option) => {
      if (value.indexOf(option.value) !== -1) {
        acc.push(option);
      }
      return acc;
    }, []);

    if (!searchable) {
      return filtered;
    }

    if (filterSelected) {
      return filtered.filter((option) => filterBy(option, filterSelected));
    }

    return filtered;
  };

  const handleChangeFilterAvailable = (filterAvailable: string): void => {
    setFilterAvailable(filterAvailable);
  };

  const handleChangeFilterSelected = (filterSelected: string): void => {
    setFilterSelected(filterSelected);
  };

  const renderFilter = (value: string, onChange: (filter: string) => void) => {
    if (!filterComponent) {
      return (
        <Filter
          value={value}
          clearFilterText={clearFilterText}
          clearable={clearable}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
        />
      );
    }
    return React.createElement(filterComponent, {
      clearFilterText,
      clearable,
      disabled,
      onChange,
      placeholder,
      value
    });
  };

  return (
    <div className={`msts ${disabled ? 'msts_disabled' : ''} ${className}`}>
      {availableHeader || selectedHeader ? (
        <div className="msts__heading">
          <div className="msts__side msts__side_available">
            {availableHeader}
          </div>

          <div className="msts__side msts__side_selected">{selectedHeader}</div>
        </div>
      ) : null}

      {searchable ? (
        <div className="msts__subheading">
          <div className="msts__side msts__side_filter">
            {renderFilter(filterAvailable, handleChangeFilterAvailable)}
          </div>

          <div className="msts__side msts__side_filter">
            {renderFilter(filterSelected, handleChangeFilterSelected)}
          </div>
        </div>
      ) : null}

      <div className="msts__body">
        <div className="msts__side msts__side_available">
          <List
            options={filterAvailableFn()}
            disabled={disabled}
            onClick={handleClickAvailable}
          />
        </div>

        {showControls ? (
          <div className="msts__side msts__side_controls">
            <button
              className="msts__control msts__control_select-all"
              title={selectAllText}
              type="button"
              disabled={
                value.length === options.length ||
                value.length >= limit ||
                disabled
              }
              onClick={handleClickSelectAll}
            />

            <button
              className="msts__control msts__control_deselect-all"
              title={deselectAllText}
              type="button"
              disabled={!value.length || disabled}
              onClick={handleClickDeselectAll}
            />
          </div>
        ) : null}

        <div className="msts__side msts__side_selected">
          <List
            options={filterActiveFn()}
            disabled={disabled}
            onClick={handleClickSelected}
          />
        </div>
      </div>

      {availableFooter || selectedFooter ? (
        <div className="msts__footer">
          <div className="msts__side msts__side_available">
            {availableFooter}
          </div>

          <div className="msts__side msts__side_selected">{selectedFooter}</div>
        </div>
      ) : null}
    </div>
  );
};

export default ColumnSelect;
