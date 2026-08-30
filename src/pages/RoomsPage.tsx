import { Link, useParams } from "react-router";
import { useAppContext } from "../state/appContextDefinition";

function RoomsPage() {
  const { state } = useAppContext();
  const { roomId } = useParams();
  const selectedRoom = state.rooms.find((room) => room.id === roomId);

  return (
    <section className="space-y-8" aria-labelledby="rooms-heading">
      <div>
        <p className="text-sm font-semibold text-indigo-600">Workspace</p>
        <h1
          id="rooms-heading"
          className="mt-1 text-3xl font-bold tracking-tight text-slate-950"
        >
          Rooms
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Compare room capacity, location, and amenities.
        </p>
      </div>

      {roomId !== undefined && selectedRoom === undefined ? (
        <section
          className="rounded-2xl border border-red-200 bg-red-50 p-6"
          role="alert"
        >
          <h2 className="text-lg font-semibold text-red-900">Room not found</h2>
          <p className="mt-2 text-sm text-red-700">
            The requested room does not exist.
          </p>
          <Link
            to="/rooms"
            className="mt-4 inline-block text-sm font-semibold text-red-800 underline underline-offset-4"
          >
            Back to rooms
          </Link>
        </section>
      ) : selectedRoom ? (
        <section
          className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6"
          aria-labelledby="selected-room-heading"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Room details
              </p>
              <h2
                id="selected-room-heading"
                className="mt-1 text-2xl font-bold text-slate-950"
              >
                {selectedRoom.name}
              </h2>
            </div>

            <Link
              to="/rooms"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Close details
            </Link>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Location
              </dt>
              <dd className="mt-1 font-medium text-slate-950">
                {selectedRoom.location}
              </dd>
            </div>

            <div className="rounded-xl bg-white p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Capacity
              </dt>
              <dd className="mt-1 font-medium text-slate-950">
                {selectedRoom.capacity} people
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-950">Amenities</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {selectedRoom.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-md bg-white px-3 py-1.5 text-sm text-slate-700"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.rooms.map((room) => {
          const isSelected = room.id === roomId;

          return (
            <li key={room.id}>
              <Link
                to={`/rooms/${room.id}`}
                aria-current={isSelected ? "page" : undefined}
                className={[
                  "group block h-full rounded-2xl border bg-white p-6 shadow-sm transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
                  isSelected
                    ? "border-indigo-600 ring-1 ring-indigo-600"
                    : "border-slate-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950 group-hover:text-indigo-700">
                      {room.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {room.location}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {room.capacity} seats
                  </span>
                </div>

                <ul
                  className="mt-5 flex flex-wrap gap-2"
                  aria-label={`${room.name} amenities`}
                >
                  {room.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-sm font-semibold text-indigo-600">
                  {isSelected ? "Selected" : "View details"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default RoomsPage;
