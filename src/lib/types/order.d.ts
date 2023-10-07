import type { ObjectId } from 'mongodb';
import { Participant } from './participant';

export interface Order {
	_id?: ObjectId;
	key: string;
	date: string;
	total: number;
	other: number;
	discount: number;
	participants: Participant[];
}
