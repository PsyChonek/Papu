export const defaultDigits = 2;

export const formatFloat = (x: number, digits = defaultDigits) => Number(x).toFixed(digits);
