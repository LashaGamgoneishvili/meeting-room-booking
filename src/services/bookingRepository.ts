import type { Booking } from "../types";
import { getBookings as fetchInitialBookings } from "./dataService";

const STORAGE_KEY = "meeting-room-booking:bookings:v1";

export async function loadBookings(): Promise<Booking[]> {
  const storageBooking = localStorage.getItem(STORAGE_KEY);

  if (storageBooking !== null) {
    const parsed: unknown = JSON.parse(storageBooking);

    if (!Array.isArray(parsed)) {
      throw new Error("Stored bookings data is invalid: expected an array.");
    }

    return parsed as Booking[];
  }

  const bookings = await fetchInitialBookings();

  saveBookings(bookings);

  return bookings;
}

export function saveBookings(bookings: Booking[]): void {
  const data = JSON.stringify(bookings);

  localStorage.setItem(STORAGE_KEY, data);
}
