import type { ObjectId } from 'mongodb';
import { Participant } from './participant';

export interface Order {
	_id: ObjectId | null;
	ownerID: ObjectId | null | string;
	key: string;
	date: string;
	other: number;
	discount: number;
	participants: Participant[];
}
