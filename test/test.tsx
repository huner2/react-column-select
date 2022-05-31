import React from 'react';
import { prettyDOM, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import C from '../src';
import { Option, Value } from '../src/ColumnSelect.types';
import { FilterProps } from '../src/Filter.types';

test('render component block', () => {
  const { container } = render(<C />);
  const root = container.firstChild;
  expect(root).toHaveClass('msts');
  expect(root).toBeInstanceOf(HTMLDivElement);
});

test('allow to add custom class name', () => {
  const props = {
    className: 'foo bar'
  };
  const { container } = render(<C {...props} />);
  expect(container.firstChild).toHaveClass('msts foo bar');
});

test('render children blocks', () => {
  const props = {};
  const { container } = render(<C {...props} />);
  expect(container.querySelectorAll('.msts__side')).toHaveLength(2);

  const sideAvailable = container.querySelector('.msts__side_available');
  expect(sideAvailable).toBeInstanceOf(HTMLDivElement);
  expect(sideAvailable).toHaveClass('msts__side msts__side_available');

  const sideSelected = container.querySelector('.msts__side_selected');
  expect(sideSelected).toBeInstanceOf(HTMLDivElement);
  expect(sideSelected).toHaveClass('msts__side msts__side_selected');
});

test('render list items', () => {
  const props = {
    options: [
      { name: 'Foo', value: 0 },
      { name: 'Bar', value: 1 }
    ],
    value: [1]
  };
  const { container } = render(<C {...props} />);
  const items = container.querySelectorAll('.msts__list-item');
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent('Foo');
  expect(items[1]).toHaveTextContent('Bar');
});

test('render controls', () => {
  const props = {
    showControls: true
  };
  const { container } = render(<C {...props} />);
  const items = container.querySelector('.msts__side_controls');
  expect(items).toBeInstanceOf(HTMLDivElement);
  expect(items).toHaveClass('msts__side msts__side_controls');
});

test('dont render controls by default', () => {
  const props = {};
  const { container } = render(<C {...props} />);
  const items = container.querySelectorAll('.msts__side_controls');
  expect(items).toHaveLength(0);
});

test('render filter', () => {
  const props = {
    searchable: true
  };
  const { container } = render(<C {...props} />);
  const items = container.querySelector('.msts__subheading');
  expect(items).toBeInstanceOf(HTMLDivElement);
  expect(items).toHaveClass('msts__subheading');
});

test('dont render filter by default', () => {
  const props = {};
  const { container } = render(<C {...props} />);
  const items = container.querySelectorAll('.msts__subheading');
  expect(items).toHaveLength(0);
});

test('render filter clear', async () => {
  const props = {
    searchable: true
  };
  const { container } = render(<C {...props} />);
  const filters = container.querySelectorAll('.msts__filter-input');

  expect(container.querySelectorAll('.msts__filter-clear')).toHaveLength(0);
  await userEvent.type(filters[0], 'foo');
  expect(container.querySelectorAll('.msts__filter-clear')).toHaveLength(1);

  await userEvent.type(filters[1], 'foo');
  expect(container.querySelectorAll('.msts__filter-clear')).toHaveLength(2);

  const filterClear = container.querySelectorAll('.msts__filter-clear');
  expect(filterClear).toHaveLength(2);
  expect(filterClear[0]).toBeInstanceOf(HTMLSpanElement);
  expect(filterClear[0]).toHaveClass('msts__filter-clear');
});

test('custom `filterBy` property', async () => {
  const props = {
    searchable: true,
    // Custom case-sensitive filter for test
    filterBy: (item: Option, filter: string) => item.name.indexOf(filter) > -1,
    options: [
      { name: 'Foo', value: 0 },
      { name: 'foo', value: 1 },
      { name: 'Bar', value: 2 },
      { name: 'bar', value: 3 }
    ],
    value: [2, 3]
  };
  const { container } = render(<C {...props} />);
  const filters = container.querySelectorAll('.msts__filter-input');

  await userEvent.type(filters[0], 'Fo');
  const available = container.querySelector('.msts__side_available');
  expect(available?.querySelectorAll('.msts__list-item')).toHaveLength(1);
  expect(available?.querySelector('.msts__list-item')).toHaveTextContent('Foo');

  await userEvent.type(filters[1], 'Ba');
  const selected = container.querySelector('.msts__side_selected');
  expect(selected?.querySelectorAll('.msts__list-item')).toHaveLength(1);
  expect(selected?.querySelector('.msts__list-item')).toHaveTextContent('Bar');
});

test('dont render filter clear if `clearable` is false', async () => {
  const props = {
    searchable: true,
    clearable: false
  };
  const { container } = render(<C {...props} />);
  const filters = container.querySelectorAll('.msts__filter-input');

  await userEvent.type(filters[0], 'foo');
  expect(container.querySelectorAll('.msts__filter-clear')).toHaveLength(0);
});

test('`disabled`: disable controls', () => {
  const props = {
    showControls: true,
    disabled: true,
    options: [
      { name: 'Foo', value: 0 },
      { name: 'Bar', value: 1 }
    ],
    value: [1]
  };
  const { container } = render(<C {...props} />);
  const controls = container.querySelectorAll('.msts__control');

  expect(controls[0]).toBeDisabled;
  expect(controls[1]).toBeDisabled;
});

test('`disabled`: disable filter', async () => {
  const props = {
    searchable: true,
    disabled: true
  };
  const { container } = render(<C {...props} />);
  const filters = container.querySelectorAll('.msts__filter-input');

  expect(filters[0]).toBeDisabled;
  expect(filters[1]).toBeDisabled;

  await userEvent.type(filters[0], 'foo');
  await userEvent.type(filters[1], 'foo');

  expect(container.querySelectorAll('.msts__filter-clear')).toHaveLength(0);
});

test('`disabled`: disable component', () => {
  const props = {
    disabled: true
  };
  const { container } = render(<C {...props} />);
  expect(container.firstChild).toHaveClass('msts msts_disabled');
});

test('`disabled`: disable handle', async () => {
  let isChanged = false;
  const props = {
    disabled: true,
    options: [{ name: 'Foo', value: 0 }],
    onChange() {
      isChanged = true;
    }
  };
  const { container } = render(<C {...props} />);
  const items = container.querySelectorAll('.msts__list-item')[0];
  await userEvent.click(items);
  expect(isChanged).toBeFalsy();
});

test('`disabled`: disable option', async () => {
  let isChanged = false;
  const props = {
    options: [{ name: 'Foo', value: 0, disabled: true }],
    onChange() {
      isChanged = true;
    }
  };
  const { container } = render(<C {...props} />);
  const items = container.querySelectorAll('.msts__list-item')[0];
  await userEvent.click(items);
  expect(isChanged).toBeFalsy();
  expect(items).toHaveClass('msts__list-item msts__list-item_disabled');
});

test('dont select disabled option by select all', async () => {
  let value: Value[] = [];
  const props = {
    showControls: true,
    options: [
      { name: 'Foo', value: 0, disabled: true },
      { name: 'Bar', value: 1 }
    ],
    onChange(newValue: Value[]) {
      value = newValue;
    }
  };
  const { container } = render(<C {...props} />);
  const selectAll = container.querySelectorAll('.msts__control_select-all')[0];
  await userEvent.click(selectAll);
  expect(value).toEqual([1]);
});

test('`highlight`: highlight option', () => {
  const props = {
    options: [
      { name: 'Foo', value: 0 },
      { name: 'Bar', value: 1 }
    ],
    highlight: [1]
  };
  const { container } = render(<C {...props} />);
  const items = container.querySelectorAll('.msts__list-item');
  expect(items[0]).toHaveClass('msts__list-item');
  expect(items[1]).toHaveClass('msts__list-item msts__list-item_highlighted');
});

test('prop clearFilterText', async () => {
  const props = {
    searchable: true,
    clearFilterText: 'Foo'
  };
  const { container } = render(<C {...props} />);
  const filters = container.querySelectorAll('.msts__filter-input');

  await userEvent.type(filters[0], 'foo');
  await userEvent.type(filters[1], 'foo');

  const filterClear = container.querySelectorAll('.msts__filter-clear');
  expect(filterClear[0]).toHaveAttribute('title', 'Foo');
  expect(filterClear[1]).toHaveAttribute('title', 'Foo');
});

test('prop selectAllText and deselectAllText', () => {
  const props = {
    showControls: true,
    selectAllText: 'Foo',
    deselectAllText: 'Bar'
  };
  const { container } = render(<C {...props} />);

  const selectAll = container.querySelectorAll('.msts__control_select-all');
  expect(selectAll[0]).toHaveAttribute('title', 'Foo');

  const deselectAll = container.querySelectorAll('.msts__control_deselect-all');
  expect(deselectAll[0]).toHaveAttribute('title', 'Bar');
});

test('limit list', async () => {
  let isChanged = false;
  const props = {
    options: [
      { name: 'Foo', value: 0 },
      { name: 'Bar', value: 1 },
      { name: 'Baz', value: 2 },
      { name: 'Qux', value: 3 },
      { name: 'Quux', value: 4 }
    ],
    limit: 3,
    value: [0, 1, 2],
    onChange() {
      isChanged = true;
    }
  };
  const { container } = render(<C {...props} />);
  const items = container.querySelectorAll('.msts__list-item');
  await userEvent.click(items[0]);

  expect(items[0]).toHaveClass('msts__list-item msts__list-item_disabled');
  expect(items[0]).toHaveTextContent('Qux');

  expect(items[1]).toHaveClass('msts__list-item msts__list-item_disabled');
  expect(items[1]).toHaveTextContent('Quux');

  expect(isChanged).toBeFalsy();
});

test('limit list selectall', async () => {
  let value: Value[] = [];
  const props = {
    showControls: true,
    options: [
      { name: 'Foo', value: 0 },
      { name: 'Bar', value: 1, disabled: true },
      { name: 'Baz', value: 2 },
      { name: 'Qux', value: 3 },
      { name: 'Quux', value: 4 }
    ],
    value: [4],
    limit: 3,
    onChange(newValue: Value[]) {
      value = newValue;
    }
  };
  const { container } = render(<C {...props} />);
  const selectAll = container.querySelectorAll('.msts__control_select-all');
  await userEvent.click(selectAll[0]);
  expect(value).toEqual([0, 2, 4]);
});

test('selectall filtered items only', async () => {
  let value: Value[] = [];
  const props = {
    searchable: true,
    showControls: true,
    options: [
      { name: 'Foo', value: 0 },
      { name: 'Bar', value: 1 },
      { name: 'Baz', value: 2 },
      { name: 'Qux', value: 3 },
      { name: 'Quux', value: 4 }
    ],
    value: [0],
    onChange(newValue: Value[]) {
      value = newValue;
    }
  };
  const { container } = render(<C {...props} />);
  const filters = container.querySelectorAll('.msts__filter-input');
  const selectAll = container.querySelectorAll('.msts__control_select-all');

  await userEvent.type(filters[0], 'ux');
  await userEvent.click(selectAll[0]);

  expect(value).toEqual([0, 3, 4]);
});

test('deselectall filtered items only', async () => {
  let value: Value[] = [];
  const props = {
    searchable: true,
    showControls: true,
    options: [
      { name: 'Foo', value: 0 },
      { name: 'Bar', value: 1 },
      { name: 'Baz', value: 2 },
      { name: 'Qux', value: 3 },
      { name: 'Quux', value: 4 }
    ],
    value: [0, 1, 2, 3, 4],
    onChange(newValue: Value[]) {
      value = newValue;
    }
  };
  const { container } = render(<C {...props} />);
  const filters = container.querySelectorAll('.msts__filter-input');
  const deselectAll = container.querySelectorAll('.msts__control_deselect-all');

  await userEvent.type(filters[1], 'ux');
  await userEvent.click(deselectAll[0]);

  expect(value).toEqual([0, 1, 2]);
});

test('custom headers', () => {
  const props = {
    availableHeader: 'Custom Available',
    selectedHeader: 'Custom Selected'
  };
  const { container } = render(<C {...props} />);

  const headings = container.querySelectorAll('.msts__heading')[0];
  expect(
    headings.querySelectorAll('.msts__side_available')[0]
  ).toHaveTextContent(props.availableHeader);
  expect(
    headings.querySelectorAll('.msts__side_selected')[0]
  ).toHaveTextContent(props.selectedHeader);
});

test('render custom filter component', () => {
  const props = {
    searchable: true,
    filterComponent: (props: FilterProps) => {
      return <div>Custom Filter</div>;
    }
  };

  const { container } = render(<C {...props} />);
  const filters = container.querySelectorAll('.msts__side_filter');
  expect(filters[0]).toHaveTextContent('Custom Filter');
  expect(filters[1]).toHaveTextContent('Custom Filter');
});

test('custom footers', () => {
  const props = {
    availableFooter: 'Custom Available',
    selectedFooter: 'Custom Selected'
  };
  const { container } = render(<C {...props} />);

  const footers = container.querySelectorAll('.msts__footer')[0];
  expect(
    footers.querySelectorAll('.msts__side_available')[0]
  ).toHaveTextContent(props.availableFooter);
  expect(footers.querySelectorAll('.msts__side_selected')[0]).toHaveTextContent(
    props.selectedFooter
  );
});

test('adding and removing items manually', async () => {
  let value: Value[] = [];
  const props = {
    options: [
      { name: 'Foo', value: 0 },
      { name: 'Bar', value: 1 },
      { name: 'Baz', value: 2 }
    ],
    value: [0],
    onChange(newValue: Value[]) {
      console.log(newValue);
      value = newValue;
    }
  };
  const { container } = render(<C {...props} />);
  const body = container.querySelectorAll('.msts__body')[0];
  const availableItems = body
    .querySelectorAll('.msts__side_available')[0]
    .querySelectorAll('.msts__list-item');

  await userEvent.click(availableItems[0]);
  expect(value).toEqual([0, 1]);

  // We have to rerender due to the prop changes
  const newProps = { ...props, value: [0, 1] };
  const { container: newContainer } = render(<C {...newProps} />);
  const newBody = newContainer.querySelectorAll('.msts__body')[0];
  const selectedItems = newBody
    .querySelectorAll('.msts__side_selected')[0]
    .querySelectorAll('.msts__list-item');
  await userEvent.click(selectedItems[1]);

  expect(value).toEqual([1]);
});

test('clear filter with clearable', async () => {
  const props = {
    searchable: true
  };
  const { container } = render(<C {...props} />);

  const filters = container.querySelectorAll('.msts__filter-input');
  await userEvent.type(filters[0], 'ux');
  expect(filters[0]).toHaveValue('ux');

  const clearButton = container.querySelectorAll('.msts__filter-clear');
  await userEvent.click(clearButton[0]);
  expect(filters[0]).toHaveValue('');
});
