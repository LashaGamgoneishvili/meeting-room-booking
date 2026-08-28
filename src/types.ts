export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  title: string;
  roomId: string;
  organizerId: string;
  attendeeIds: string[];
  startAt: string;
  endAt: string;
  status: "confirmed" | "cancelled";
  description?: string;
}
