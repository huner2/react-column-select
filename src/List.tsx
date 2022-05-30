import React from 'react';
import ListItem from './ListItem';
import { ListProps } from './List.types';

const List = ({ disabled, onClick, options }: ListProps) => {
  const handleClick = (value: number | string) => {
    if (disabled) {
      return;
    }

    onClick(value);
  };

  return (
    <ul className="msts__list">
      {options.map((item) => (
        <ListItem
          key={item.value}
          disabled={item.disabled || false}
          highlight={item.highlight || false}
          label={item.name}
          value={item.value}
          onClick={handleClick}
        />
      ))}
    </ul>
  );
};

export default List;
