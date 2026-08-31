import type { Booking, Room } from "../types";

export function getBookingValidationError(
  candidate: Booking,
  rooms: Room[],
  existingBookings: Booking[],
): string | null {
  if (candidate.title.trim() === "") {
    return "Title is required.";
  }

  const room = rooms.find((item) => item.id === candidate.roomId);

  if (room === undefined) {
    return "Select a valid room.";
  }

  if (candidate.organizerId === "") {
    return "Select an organizer.";
  }

  const uniqueAttendeeIds = new Set(candidate.attendeeIds);

  if (uniqueAttendeeIds.size !== candidate.attendeeIds.length) {
    return "An attendee cannot be selected more than once.";
  }

  if (!uniqueAttendeeIds.has(candidate.organizerId)) {
    return "The organizer must be included in the attendees.";
  }

  const startTime = Date.parse(candidate.startAt);
  const endTime = Date.parse(candidate.endAt);

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return "Enter a valid start and end time.";
  }

  if (endTime <= startTime) {
    return "The end time must be after the start time.";
  }

  const participantCount = uniqueAttendeeIds.size;

  if (participantCount > room.capacity) {
    return `${room.name} has capacity for ${room.capacity} people.`;
  }

  if (candidate.status === "confirmed") {
    const hasConflict = existingBookings.some((booking) => {
      if (
        booking.id === candidate.id ||
        booking.roomId !== candidate.roomId ||
        booking.status !== "confirmed"
      ) {
        return false;
      }

      const existingStartTime = Date.parse(booking.startAt);
      const existingEndTime = Date.parse(booking.endAt);

      return startTime < existingEndTime && endTime > existingStartTime;
    });

    if (hasConflict) {
      return "This room already has a confirmed booking during that time.";
    }
  }

  return null;
}
