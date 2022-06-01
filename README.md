# React-Column-Select
[![codecov](https://codecov.io/gh/huner2/react-column-select/branch/master/graph/badge.svg?token=8CTYCAPB0G)](https://codecov.io/gh/huner2/react-column-select)
![Build](https://github.com/huner2/react-column-select/actions/workflows/build.yml/badge.svg)
![npm](https://img.shields.io/npm/v/@huner2/react-column-select)


This package is a fork of [react-multiselect-two-sides](https://github.com/VovanR/react-multiselect-two-sides) with a few changes.

## Differences from react-multiselect-two-sides
This package is a typescript conversion, thus types are exported and visible in bundles.

Peer-dependencies have been updated to use recent versions of React.

Tests have been rewritten using modern testing frameworks.

The API is a little bit stricter due to the new Typescript types.

## Preview
![Preview](https://github.com/huner2/react-column-select/raw/master/preview.png)

## Install
`npm install @huner2/react-column-select`

## Example
```js
import React from 'react';
import createRoot from 'react-dom/client'
import ColumnSelect from '@huner2/react-column-select'

const App = () => {
    const options = [
        {name: 'Foo', value: 0},
        {name: 'Bar', value: 1},
        {name: 'Baz', value: 2, disabled: true},
        {name: 'Qux', value: 3},
        {name: 'Quux', value: 4},
        {name: 'Corge', value: 5},
        {name: 'Grault', value: 6},
        {name: 'Garply', value: 7},
        {name: 'Waldo', value: 8},
        {name: 'Fred', value: 9},
        {name: 'Plugh', value: 10},
        {name: 'Xyzzy', value: 11},
        {name: 'Thud', value: 12}
    ]
    const [value, setValue] = React.useState([0, 3, 9]);

    return (
        <ColumnSelect
            className="msts_theme_example"
            availableHeader="Available"
            availableFooter={`Available ${options.length - value.length}`}
            selectedHeader="Selected"
            selectedFooter={`Selected ${value.length}`}
            showControls
            searchable
            onChange={v => setValue(v)}
        />
    );
}

const root = createRoot(document.getElementById("root"));
root.render(App);
```

## Props
Note: all props are `optional` but operation would be limited if you did not supply options or a value.

+ [availableFooter](#availablefooter)
+ [availableHeader](#availableheader)
+ [className](#classname)
+ [clearFilterText](#clearfiltertext)
+ [clearable](#clearable)
+ [deselectAllText](#deselectalltext)
+ [disabled](#disabled)
+ [filterBy](#filterby)
+ [filterComponent](#filtercomponent)
+ [highlight](#highlight)
+ [limit](#limit)
+ [onChange](#onchange)
+ [options](#options)
+ [placeholder](#placeholder)
+ [searchable](#searchable)
+ [selectAllText](#selectalltext)
+ [selectedFooter](#selectedfooter)
+ [selectedHeader](#selectedheader)
+ [showControls](#showcontrols)
+ [value](#value)

## &nbsp;

### availableFooter
`React.ReactNode`

Used to provide a custom footer for the available column.

### availableHeader
`React.ReactNode`

Used to provide a custom header for the available column.

### className
`string`

Used to provide a custom classname to the container component.

### clearFilterText
`string`

Used to provide a custom label for the filter clear button.

### clearable
`boolean`

Used to toggle the clear button for the filter.

### deselectAllText
`string`

Used to provide a custom label for the deselect all button.

### disabled
`boolean`

Used to determine whether the value can be changed (readonly).

### filterBy
```
Value := string | number
Option := {
    name := string
    value := Value
    disabled? := boolean
    highlight? := boolean
}

filterBy := (option: Option, filter: string) => boolean
```

Used to provide a custom filter function.  The provided function should accept an `option` object and a `string` filter and return a `boolean`.

The return value determines whether or not the option will be included in the results (i.e. true will show the option).

### filterComponent
```
FilterProps := {
    clearFilterText := string
    clearable := boolean
    disabled := boolean
    onChange := (filter: string) => void
    placeholder := string
    value := string
}

filterComponent := {
    React.FunctionComponent<FilterProps> |
        React.ComponentClass<FilterProps>
}
```

Used to provide a custom filter component.

The component should accept an object that conforms to `FilterProps`.  Whenever the value changes, onChange should be called to propagate back to the ColumnSelect component.

The component can be either a functional component or a class component.

### highlight
```
Value := string | number

hightlight := Value[]
```

Used to provide a list of values that should be highlighted, regardless of column.

### limit
`number`

Limit controls the allowed number of selected items.

### onChange
```
Value := string | number

onChange := (options: Value[]) => void
```
onChange is called with the new array of selected values on any change.

### options
```
Value := string | number

Option := {
    name := string
    value := Value
    disabled? := boolean
    highlight? := boolean
}

Options := Option[]
```
Options is the list of options that should be available.  Name is the label that will be displayed in the columns.  Disabled and highlight are both optional and can be enabled per-option to disable or highlight an option.

### placeholder
`string`

Used to customize the placeholder string in the filter inputs.

### searchable
`boolean`

Used to toggle filters on or off.

### selectAllText
`string`

Used to customize the label for the select all button.

### selectedFooter
`React.ReactNode`

Used to customize the footer on the selected column.

### selectedHeader
`React.ReactNode`

Used to customize the header on the selected column.

### showControls
`boolean`

Used to toggle control buttons on or off.

### value
```
Value := string | number

value := Value[]
```

Used to specify what options are selected