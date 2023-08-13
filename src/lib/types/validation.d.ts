export interface Validation {
    errors: ValidationError[]
    isValid: boolean
}

export interface ValidationError {
    text: string;
    type: string;
}