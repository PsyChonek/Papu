export const paymentData = (iban: string, amount: number, message: string, variableSymbol: string) => `SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK*MSG:${message}*X-VS:${variableSymbol}*`;
