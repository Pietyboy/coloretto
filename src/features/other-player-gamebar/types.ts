import { CardColors, CardType } from "../player-gamebar/constants";

export type TCard = {
    count: number;
    color: typeof CardColors[keyof typeof CardColors];
    type: typeof CardType[keyof typeof CardType];
}