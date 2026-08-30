import { useAppContext } from "../state/appContextDefinition";
import { Link } from "react-router";

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function isSameLocalDay(firstDate: Date, secondDate: Date): boolean {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function DashboardPage() {
  const { state } = useAppContext();
  const now = new Date();
  const nowTime = now.getTime();

  const confirmedBookings = state.bookings.filter(
    (booking) => booking.status === "confirmed",
  );

  const todaysBookings = confirmedBookings.filter((booking) =>
    isSameLocalDay(new Date(booking.startAt), now),
  );

  const occupiedRoomIds = new Set(
    confirmedBookings
      .filter(
        (booking) =>
          Date.parse(booking.startAt) <= nowTime &&
          nowTime < Date.parse(booking.endAt),
      )
      .map((booking) => booking.roomId),
  );

  const availableRoomCount = state.rooms.length - occupiedRoomIds.size;

  const upcomingBookings = confirmedBookings
    .filter((booking) => Date.parse(booking.startAt) > nowTime)
    .sort(
      (firstBooking, secondBooking) =>
        Date.parse(firstBooking.startAt) - Date.parse(secondBooking.startAt),
    );

  const nextBookings = upcomingBookings.slice(0, 5);

  const summaryItems = [
    {
      label: "Today's bookings",
      value: todaysBookings.length,
      description: "Confirmed meetings scheduled today",
    },
    {
      label: "Rooms available now",
      value: availableRoomCount,
      description: "Rooms without an active booking",
    },
    {
      label: "Upcoming bookings",
      value: upcomingBookings.length,
      description: "Confirmed meetings scheduled later",
    },
  ];

  return (
    <section className="space-y-8" aria-labelledby="dashboard-heading">
      <div>
        <p className="text-sm font-semibold text-indigo-600">Overview</p>
        <h1
          id="dashboard-heading"
          className="mt-1 text-3xl font-bold tracking-tight text-slate-950"
        >
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Current meeting room and booking activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryItems.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-sm font-medium text-slate-600">{item.label}</h2>
            <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              {item.value}
            </p>
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
          </article>
        ))}
      </div>

      <section
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        aria-labelledby="upcoming-heading"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2
              id="upcoming-heading"
              className="text-lg font-semibold text-slate-950"
            >
              Upcoming bookings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              The next confirmed meetings.
            </p>
          </div>

          <Link
            to="/bookings"
            className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            View all
          </Link>
        </div>

        {nextBookings.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            No upcoming bookings.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {nextBookings.map((booking) => {
              const room = state.rooms.find(
                (item) => item.id === booking.roomId,
              );

              return (
                <li
                  key={booking.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-medium text-slate-950">
                      {booking.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {room
                        ? `${room.name} - ${room.location}`
                        : "Room unavailable"}
                    </p>
                  </div>

                  <time
                    dateTime={booking.startAt}
                    className="shrink-0 text-sm font-medium text-slate-600"
                  >
                    {dateTimeFormatter.format(new Date(booking.startAt))}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </section>
  );
}

export default DashboardPage;
