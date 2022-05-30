import React from 'react';
import { ListItemProps } from './ListItem.types';

const ListItem = ({
  disabled = false,
  highlight = false,
  onClick,
  label = '',
  value
}: ListItemProps) => {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    onClick(value);
  };

  const className = 'msts__list-item';
  return (
    <li
      className={`${className} ${disabled ? className + '_disabled' : ''} ${
        highlight ? className + '_highlighted' : ''
      }`}
      onClick={handleClick}
    >
      {label}
    </li>
  );
};

export default ListItem;
