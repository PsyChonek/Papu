/*
    Participant interface, used for the participant list

    participant is a user added to split the bill
*/

export interface Participant {
	id: string;
	user: User | null;
	name: string;
	items: ParticipantItem[];
	total: number;
	nonDiscountedTotal: number;
}

/* ParicipantItem, represents an item in the participant's order  */
export interface ParticipantItem {
	id: String;
	price?: number | null;
}
