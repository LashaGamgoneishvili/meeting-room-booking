import type { Booking, Room } from "../../types";
import { formatLocalDate, getStartOfWeek } from "../../utils/date";

interface WeekCalendarViewProps {
  bookings: Booking[];
  rooms: Room[];
  selectedDate: string;
}

const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

function WeekCalendarView({
  bookings,
  rooms,
  selectedDate,
}: WeekCalendarViewProps) {
  const weekStart = getStartOfWeek(selectedDate);

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    const dateValue = formatLocalDate(date);

    const dayBookings = bookings
      .filter(
        (booking) => formatLocalDate(new Date(booking.startAt)) === dateValue,
      )
      .sort(
        (firstBooking, secondBooking) =>
          Date.parse(firstBooking.startAt) - Date.parse(secondBooking.startAt),
      );

    return {
      date,
      dateValue,
      bookings: dayBookings,
    };
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid min-w-[70rem] grid-cols-7 divide-x divide-slate-200">
        {weekDays.map((day) => {
          const isSelected = day.dateValue === selectedDate;

          return (
            <section
              key={day.dateValue}
              className="min-h-80"
              aria-labelledby={`week-day-${day.dateValue}`}
            >
              <div
                className={[
                  "border-b border-slate-200 px-4 py-4",
                  isSelected ? "bg-indigo-50" : "bg-slate-50",
                ].join(" ")}
              >
                <p
                  className={[
                    "text-xs font-semibold uppercase tracking-wide",
                    isSelected ? "text-indigo-600" : "text-slate-500",
                  ].join(" ")}
                >
                  {weekdayFormatter.format(day.date)}
                </p>

                <h2
                  id={`week-day-${day.dateValue}`}
                  className="mt-1 font-semibold text-slate-950"
                >
                  {shortDateFormatter.format(day.date)}
                </h2>
              </div>

              {day.bookings.length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-400">No bookings</p>
              ) : (
                <ul className="space-y-3 p-3">
                  {day.bookings.map((booking) => {
                    const room = rooms.find(
                      (item) => item.id === booking.roomId,
                    );

                    return (
                      <li
                        key={booking.id}
                        className={[
                          "rounded-xl border p-3",
                          booking.status === "confirmed"
                            ? "border-indigo-200 bg-indigo-50"
                            : "border-slate-200 bg-slate-50",
                        ].join(" ")}
                      >
                        <p className="text-xs font-semibold text-slate-600">
                          <time dateTime={booking.startAt}>
                            {timeFormatter.format(new Date(booking.startAt))}
                          </time>
                          <span> - </span>
                          <time dateTime={booking.endAt}>
                            {timeFormatter.format(new Date(booking.endAt))}
                          </time>
                        </p>

                        <h3
                          className={[
                            "mt-2 text-sm font-semibold",
                            booking.status === "cancelled"
                              ? "text-slate-500 line-through"
                              : "text-slate-950",
                          ].join(" ")}
                        >
                          {booking.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {room?.name ?? "Unknown room"}
                        </p>

                        <p className="mt-2 text-xs font-medium capitalize text-slate-500">
                          {booking.status}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default WeekCalendarView;
