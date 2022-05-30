import {Option} from './ColumnSelect.types';

export function filterBy(option:Option, filter:string): boolean {
  return option.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
}
