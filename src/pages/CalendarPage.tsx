import { useAppContext } from "../state/appContextDefinition";
import { useSearchParams } from "react-router";
type CalendarView = "day" | "week";

const calendarViews: CalendarView[] = ["day", "week"];

const dateHeadingFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
});

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

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shiftLocalDate(value: string, numberOfDays: number): string {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + numberOfDays);
  return formatLocalDate(date);
}

function getStartOfWeek(value: string): Date {
  const date = new Date(`${value}T00:00:00`);
  const daysSinceMonday = (date.getDay() + 6) % 7;

  date.setDate(date.getDate() - daysSinceMonday);
  return date;
}

function isValidDateValue(value: string | null): value is string {
  if (value === null || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return formatLocalDate(date) === value;
}

function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useAppContext();

  const dateParameter = searchParams.get("date");
  const selectedDate = isValidDateValue(dateParameter)
    ? dateParameter
    : formatLocalDate(new Date());

  const view: CalendarView =
    searchParams.get("view") === "week" ? "week" : "day";

  const selectedDay = new Date(`${selectedDate}T00:00:00`);

  const selectedDayBookings = state.bookings
    .filter(
      (booking) => formatLocalDate(new Date(booking.startAt)) === selectedDate,
    )
    .sort(
      (firstBooking, secondBooking) =>
        Date.parse(firstBooking.startAt) - Date.parse(secondBooking.startAt),
    );

  const weekStart = getStartOfWeek(selectedDate);

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    const dateValue = formatLocalDate(date);

    const bookings = state.bookings
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
      bookings,
    };
  });

  function updateCalendarState(nextDate: string, nextView: CalendarView): void {
    const nextParameters = new URLSearchParams(searchParams);
    nextParameters.set("date", nextDate);
    nextParameters.set("view", nextView);
    setSearchParams(nextParameters);
  }

  function updateDate(nextDate: string): void {
    if (isValidDateValue(nextDate)) {
      updateCalendarState(nextDate, view);
    }
  }

  function moveSelectedDate(direction: -1 | 1): void {
    const numberOfDays = view === "week" ? 7 : 1;

    updateCalendarState(
      shiftLocalDate(selectedDate, numberOfDays * direction),
      view,
    );
  }

  function goToToday(): void {
    updateCalendarState(formatLocalDate(new Date()), view);
  }

  return (
    <section className="space-y-8" aria-labelledby="calendar-heading">
      <div>
        <p className="text-sm font-semibold text-indigo-600">Schedule</p>
        <h1
          id="calendar-heading"
          className="mt-1 text-3xl font-bold tracking-tight text-slate-950"
        >
          Calendar
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Review room bookings by day or week.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div>
            <label
              htmlFor="calendar-date"
              className="block text-sm font-medium text-slate-700"
            >
              Selected date
            </label>
            <input
              id="calendar-date"
              type="date"
              value={selectedDate}
              onChange={(event) => updateDate(event.target.value)}
              className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-label={view === "day" ? "Previous day" : "Previous week"}
              onClick={() => moveSelectedDate(-1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Today
            </button>

            <button
              type="button"
              aria-label={view === "day" ? "Next day" : "Next week"}
              onClick={() => moveSelectedDate(1)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Next
            </button>
          </div>
        </div>

        <div
          className="inline-flex self-start rounded-lg bg-slate-100 p-1 sm:self-auto"
          role="group"
          aria-label="Calendar view"
        >
          {calendarViews.map((calendarView) => {
            const isActive = calendarView === view;

            return (
              <button
                key={calendarView}
                type="button"
                aria-pressed={isActive}
                onClick={() => updateCalendarState(selectedDate, calendarView)}
                className={[
                  "rounded-md px-4 py-2 text-sm font-semibold capitalize transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600",
                  isActive
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-950",
                ].join(" ")}
              >
                {calendarView}
              </button>
            );
          })}
        </div>
      </div>

      {view === "day" ? (
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
                const room = state.rooms.find(
                  (item) => item.id === booking.roomId,
                );

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
      ) : (
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
                    <p className="px-4 py-6 text-sm text-slate-400">
                      No bookings
                    </p>
                  ) : (
                    <ul className="space-y-3 p-3">
                      {day.bookings.map((booking) => {
                        const room = state.rooms.find(
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
                                {timeFormatter.format(
                                  new Date(booking.startAt),
                                )}
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
      )}
    </section>
  );
}

export default CalendarPage;
