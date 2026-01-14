export const generateNotificationId = () => {
  const cryptoWithUuid = globalThis.crypto as (Crypto & { randomUUID?: () => string }) | undefined;
  if (cryptoWithUuid?.randomUUID) {
    return cryptoWithUuid.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

