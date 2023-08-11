/*
    Participant interface, used for the participant list

    participant is a user added to split the bill
*/

export interface Participant {
    user: User | null;
    name: string;
    total: number;
    nonDiscountedTotal: number;
    qrCodeData: string | null;
}
