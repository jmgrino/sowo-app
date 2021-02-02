export interface CalEvent {
	id?: string;
	name: string;
	eventDate: Date;
	hours: string;
	prize: number;
	book: boolean;
	photoUrl?: string;
	booked?: boolean;
	attendants?: number;
}

export interface Booking {
	eventId: string;
	userId: string;
}
