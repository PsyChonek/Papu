export const paymentData = (iban: string, amount: number, message: string) => `SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK*MSG:${message}`;
