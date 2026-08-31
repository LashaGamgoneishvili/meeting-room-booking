import { useState, type FormEvent } from "react";
import type { Booking, Employee, Room } from "../../types";
import { getBookingValidationError } from "../../utils/bookingValidation";

interface BookingFormProps {
  bookings: Booking[];
  employees: Employee[];
  rooms: Room[];
  initialBooking?: Booking;
  onSubmit: (booking: Booking) => void;
  onCancel: () => void;
}

function toDateTimeLocalValue(value: string): string {
  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function BookingForm({
  bookings,
  employees,
  rooms,
  initialBooking,
  onSubmit,
  onCancel,
}: BookingFormProps) {
  const [title, setTitle] = useState(initialBooking?.title ?? "");
  const [roomId, setRoomId] = useState(initialBooking?.roomId ?? "");
  const [organizerId, setOrganizerId] = useState(
    initialBooking?.organizerId ?? "",
  );
  const [attendeeIds, setAttendeeIds] = useState<string[]>(() => {
    const initialAttendeeIds = initialBooking?.attendeeIds ?? [];
    const initialOrganizerId = initialBooking?.organizerId;

    if (
      initialOrganizerId &&
      !initialAttendeeIds.includes(initialOrganizerId)
    ) {
      return [...initialAttendeeIds, initialOrganizerId];
    }

    return initialAttendeeIds;
  });
  const [startAt, setStartAt] = useState(
    initialBooking ? toDateTimeLocalValue(initialBooking.startAt) : "",
  );
  const [endAt, setEndAt] = useState(
    initialBooking ? toDateTimeLocalValue(initialBooking.endAt) : "",
  );
  const [status, setStatus] = useState<Booking["status"]>(
    initialBooking?.status ?? "confirmed",
  );
  const [description, setDescription] = useState(
    initialBooking?.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const selectedRoom = rooms.find((room) => room.id === roomId);

  function changeOrganizer(nextOrganizerId: string): void {
    setOrganizerId(nextOrganizerId);

    setAttendeeIds((currentIds) => {
      const nextIds = currentIds.filter(
        (employeeId) => employeeId !== organizerId,
      );

      if (nextOrganizerId === "") {
        return nextIds;
      }

      return Array.from(new Set([...nextIds, nextOrganizerId]));
    });
  }

  function toggleAttendee(employeeId: string): void {
    setAttendeeIds((currentIds) =>
      currentIds.includes(employeeId)
        ? currentIds.filter((id) => id !== employeeId)
        : [...currentIds, employeeId],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError("Enter a valid start and end time.");
      return;
    }

    const trimmedDescription = description.trim();

    const candidate: Booking = {
      id: initialBooking?.id ?? crypto.randomUUID(),
      title: title.trim(),
      roomId,
      organizerId,
      attendeeIds,
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
      status,
      description: trimmedDescription === "" ? undefined : trimmedDescription,
    };

    const validationError = getBookingValidationError(
      candidate,
      rooms,
      bookings,
    );

    if (validationError !== null) {
      setError(validationError);
      return;
    }

    setError(null);
    onSubmit(candidate);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-950">
          {initialBooking ? "Edit booking" : "Create booking"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the meeting details and select its participants.
        </p>
      </div>

      {error !== null && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Room</span>
          <select
            required
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} · capacity {room.capacity}
              </option>
            ))}
          </select>
          {selectedRoom && (
            <span className="mt-1 block text-xs text-slate-500">
              {selectedRoom.location}
            </span>
          )}
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Organizer</span>
          <select
            required
            value={organizerId}
            onChange={(event) => changeOrganizer(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select an organizer</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Starts</span>
          <input
            type="datetime-local"
            required
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Ends</span>
          <input
            type="datetime-local"
            required
            value={endAt}
            onChange={(event) => setEndAt(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as Booking["status"])
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Description
          </span>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700">
          Attendees
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => {
            const isOrganizer = employee.id === organizerId;
            const isSelected = attendeeIds.includes(employee.id);

            return (
              <label
                key={employee.id}
                className={[
                  "flex items-start gap-3 rounded-lg border border-slate-200 p-3",
                  isOrganizer
                    ? "cursor-not-allowed bg-slate-50 opacity-60"
                    : "cursor-pointer hover:bg-slate-50",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  disabled={isOrganizer}
                  checked={isSelected}
                  onChange={() => toggleAttendee(employee.id)}
                  className="mt-1 size-4 accent-indigo-600"
                />

                <span>
                  <span className="block text-sm font-medium text-slate-700">
                    {employee.name}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {employee.email}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 cursor-pointer"
        >
          {initialBooking ? "Save changes" : "Create booking"}
        </button>
      </div>
    </form>
  );
}

export default BookingForm;
