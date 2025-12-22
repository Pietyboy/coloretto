export type CreateGameFormValues = {
  gameName: string;
  maxSeatsCount: number;
  nickname: string;
  turnTime: number;
};

export type SelectOption<TValue extends number | string = number> = {
  label: string;
  value: TValue;
};
