import { CARD_WIDTH, GAP, HALF_SCREEN_RATIO } from "./constants";

export const computeTickerCount = () => {
    if (typeof window === 'undefined') {
      return 3;
    }
    const availableWidth = window.innerWidth * HALF_SCREEN_RATIO;
    return Math.max(1, Math.floor(availableWidth / (CARD_WIDTH + GAP)));
  };