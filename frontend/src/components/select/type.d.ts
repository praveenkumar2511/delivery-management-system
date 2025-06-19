export type ComboboxType = {
  placeholder?: string;
  value?: Array;
  setValue?: any;
  list?: Array<ListType>;
  noDataMessage?: string;
  searchOff?: boolean;
  className?: string;
  disabled?: boolean;
  contentClassName?: string;
  icon?: any;
  iconClassname?: string;
  dropDownIcon?: boolean;
  onKeyDown?: any;
  tabIndex?: any;
  clearFunction?: any;
  isCancelable?: boolean;
};

type ListType = {
  label: string;
  value: any;
  colorCode?: string;
};
