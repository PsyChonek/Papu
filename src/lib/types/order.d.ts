import type { ObjectId } from 'mongodb';
import { Participant } from './participant';

export interface Order {
	_id: ObjectId | string;
	ownerID: ObjectId | string | null;
	key: string;
	date: string;
	other: number;
	discount: number;
	participants: Participant[];
}
