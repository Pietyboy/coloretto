import { CardColors, CardType } from './constants';

export type TCard = {
    count: number;
    color: typeof CardColors[keyof typeof CardColors];
    type: typeof CardType[keyof typeof CardType];
}