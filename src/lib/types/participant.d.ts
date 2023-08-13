/*
    Participant interface, used for the participant list

    participant is a user added to split the bill
*/

export interface Participant {
    id: string,
    user: User | null;
    name: string;
    total: number;
    nonDiscountedTotal: number;
}
