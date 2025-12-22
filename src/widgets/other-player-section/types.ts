import { TCard } from '../../features/player-gamebar/types';
import { TPlayerHand } from "../../store/types";

export type TOtherPlayer = {
    cards: TCard[];
    isCurrentTurn: boolean;
    isTurnAvailable: boolean;
    playerHand: null | TPlayerHand[];
    playerId: null | number;
    playerName: null | string;
}