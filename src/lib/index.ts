export const defaultDigits = 2;

export const formatFloat = (x: number, digits = defaultDigits) => Number(x).toFixed(digits);

export const arraySum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
