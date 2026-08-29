import type { Room, Employee, Booking } from "../types";

const url = `${import.meta.env.BASE_URL}data`;

export async function getRooms(): Promise<Room[]> {
  const response = await fetch(`${url}/rooms.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch rooms: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${url}/employees.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

export async function getBookings(): Promise<Booking[]> {
  const response = await fetch(`${url}/bookings.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch bookings: ${response.status}`);
  }
  const data = await response.json();

  return data;
}
