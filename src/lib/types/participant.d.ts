/*
    Participant interface, used for the participant list
    participant is a user added to split the bill

	id / _id: id is used for the client, _id is used for the database, it is stupid but it works
*/

import type { ObjectId } from 'mongodb';

export interface Participant {
	_id: ObjectId | string;
	user: User | null;
	name: string;
	items: ParticipantItem[];
	total: number;
	nonDiscountedTotal: number;
	variableSymbol: string;
	isToImageExport: boolean;
}

/* Participant Item, represents an item in the participant's order  */
export interface ParticipantItem {
	_id: ObjectId | string;
	price?: number | null;
}
