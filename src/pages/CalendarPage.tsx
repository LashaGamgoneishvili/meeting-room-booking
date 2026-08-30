import { useSearchParams } from "react-router";
import { useAppContext } from "../state/appContextDefinition";
import DayCalendarView from "../components/calendar/DayCalendarView";
import {
  formatLocalDate,
  isValidDateValue,
  shiftLocalDate,
} from "../utils/date";
import WeekCalendarView from "../components/calendar/WeekCalendarView";

type CalendarView = "day" | "week";

const calendarViews: CalendarView[] = ["day", "week"];

function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useAppContext();

  const dateParameter = searchParams.get("date");
  const selectedDate = isValidDateValue(dateParameter)
    ? dateParameter
    : formatLocalDate(new Date());

  const view: CalendarView =
    searchParams.get("view") === "week" ? "week" : "day";

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
        <DayCalendarView
          bookings={state.bookings}
          rooms={state.rooms}
          selectedDate={selectedDate}
        />
      ) : (
        <WeekCalendarView
          bookings={state.bookings}
          rooms={state.rooms}
          selectedDate={selectedDate}
        />
      )}
    </section>
  );
}

export default CalendarPage;
