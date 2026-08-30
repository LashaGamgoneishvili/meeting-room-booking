import type { Booking, Room } from "../../types";
import { formatLocalDate } from "../../utils/date";

interface DayCalendarViewProps {
  bookings: Booking[];
  rooms: Room[];
  selectedDate: string;
}

const dateHeadingFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

function DayCalendarView({
  bookings,
  rooms,
  selectedDate,
}: DayCalendarViewProps) {
  const selectedDay = new Date(`${selectedDate}T00:00:00`);

  const selectedDayBookings = bookings
    .filter(
      (booking) => formatLocalDate(new Date(booking.startAt)) === selectedDate,
    )
    .sort(
      (firstBooking, secondBooking) =>
        Date.parse(firstBooking.startAt) - Date.parse(secondBooking.startAt),
    );

  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      aria-labelledby="daily-calendar-heading"
    >
      <div className="border-b border-slate-200 px-6 py-5">
        <h2
          id="daily-calendar-heading"
          className="text-lg font-semibold text-slate-950"
        >
          {dateHeadingFormatter.format(selectedDay)}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {selectedDayBookings.length}{" "}
          {selectedDayBookings.length === 1 ? "booking" : "bookings"}
        </p>
      </div>

      {selectedDayBookings.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-slate-500">
          No bookings scheduled for this date.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {selectedDayBookings.map((booking) => {
            const room = rooms.find((item) => item.id === booking.roomId);

            return (
              <li
                key={booking.id}
                className="grid gap-3 px-6 py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <p className="text-sm font-medium text-slate-600">
                  <time dateTime={booking.startAt}>
                    {timeFormatter.format(new Date(booking.startAt))}
                  </time>
                  <span> to </span>
                  <time dateTime={booking.endAt}>
                    {timeFormatter.format(new Date(booking.endAt))}
                  </time>
                </p>

                <div>
                  <h3
                    className={[
                      "font-semibold",
                      booking.status === "cancelled"
                        ? "text-slate-500 line-through"
                        : "text-slate-950",
                    ].join(" ")}
                  >
                    {booking.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {room?.name ?? "Unknown room"} -{" "}
                    {booking.attendeeIds.length} attendees
                  </p>
                </div>

                <span
                  className={[
                    "w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize",
                    booking.status === "confirmed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  {booking.status}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default DayCalendarView;
