export type SelectOption<TValue extends number | string = string> = {
  label: string;
  value: TValue;
};
