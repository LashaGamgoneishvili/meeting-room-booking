import { useState } from "react";
import { useSearchParams } from "react-router";
import { useAppContext } from "../state/appContextDefinition";
import BookingForm from "../components/bookings/BookingForm";
import type { Booking } from "../types";
import ConfirmDialog from "../components/common/ConfirmDialog";

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const BOOKINGS_PER_PAGE = 5;

function BookingsPage() {
  const { state, createBooking, updateBooking, deleteBooking } =
    useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const isCreating = searchParams.get("mode") === "create";
  const editingBookingId = searchParams.get("edit");

  const editingBooking = state.bookings.find(
    (booking) => booking.id === editingBookingId,
  );

  const searchQuery = searchParams.get("q") ?? "";
  const roomParameter = searchParams.get("room");
  const statusParameter = searchParams.get("status");

  const selectedRoomId =
    roomParameter !== null &&
    state.rooms.some((room) => room.id === roomParameter)
      ? roomParameter
      : "";

  const selectedStatus =
    statusParameter === "confirmed" || statusParameter === "cancelled"
      ? statusParameter
      : "";

  const pageParameter = Number(searchParams.get("page"));

  const requestedPage =
    Number.isInteger(pageParameter) && pageParameter > 0 ? pageParameter : 1;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredBookings = state.bookings
    .filter((booking) => {
      const room = state.rooms.find((item) => item.id === booking.roomId);
      const organizer = state.employees.find(
        (employee) => employee.id === booking.organizerId,
      );

      const matchesSearch =
        normalizedQuery === "" ||
        [
          booking.title,
          booking.description ?? "",
          room?.name ?? "",
          organizer?.name ?? "",
          organizer?.email ?? "",
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesRoom =
        selectedRoomId === "" || booking.roomId === selectedRoomId;

      const matchesStatus =
        selectedStatus === "" || booking.status === selectedStatus;

      return matchesSearch && matchesRoom && matchesStatus;
    })
    .sort(
      (firstBooking, secondBooking) =>
        Date.parse(firstBooking.startAt) - Date.parse(secondBooking.startAt),
    );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE),
  );

  const currentPage = Math.min(requestedPage, totalPages);
  const firstBookingIndex = (currentPage - 1) * BOOKINGS_PER_PAGE;

  const paginatedBookings = filteredBookings.slice(
    firstBookingIndex,
    firstBookingIndex + BOOKINGS_PER_PAGE,
  );

  function updateFilter(name: "q" | "room" | "status", value: string): void {
    const nextParameters = new URLSearchParams(searchParams);

    if (value === "") {
      nextParameters.delete(name);
    } else {
      nextParameters.set(name, value);
    }

    nextParameters.delete("page");

    setSearchParams(nextParameters, {
      replace: true,
    });
  }

  function updatePage(page: number): void {
    const nextParameters = new URLSearchParams(searchParams);

    if (page <= 1) {
      nextParameters.delete("page");
    } else {
      nextParameters.set("page", String(page));
    }

    setSearchParams(nextParameters);
  }

  function openCreateForm(): void {
    const nextParameters = new URLSearchParams(searchParams);
    nextParameters.delete("edit");
    nextParameters.set("mode", "create");
    setSearchParams(nextParameters);
  }

  function openEditForm(bookingId: string): void {
    const nextParameters = new URLSearchParams(searchParams);
    nextParameters.delete("mode");
    nextParameters.set("edit", bookingId);
    setSearchParams(nextParameters);
  }

  function closeBookingForm(): void {
    const nextParameters = new URLSearchParams(searchParams);
    nextParameters.delete("mode");
    nextParameters.delete("edit");

    setSearchParams(nextParameters, {
      replace: true,
    });
  }

  function handleCreateBooking(booking: Booking): void {
    createBooking(booking);
    closeBookingForm();
  }

  function handleUpdateBooking(booking: Booking): void {
    updateBooking(booking);
    closeBookingForm();
  }

  function handleDeleteBooking(): void {
    if (bookingToDelete === null) {
      return;
    }

    deleteBooking(bookingToDelete.id);

    if (editingBookingId === bookingToDelete.id) {
      closeBookingForm();
    }

    setBookingToDelete(null);
  }

  return (
    <section className="space-y-8" aria-labelledby="bookings-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Management</p>
          <h1
            id="bookings-heading"
            className="mt-1 text-3xl font-bold tracking-tight text-slate-950"
          >
            Bookings
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review and manage meeting room reservations.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          New booking
        </button>
      </div>

      {isCreating ? (
        <BookingForm
          key="create"
          bookings={state.bookings}
          employees={state.employees}
          rooms={state.rooms}
          onSubmit={handleCreateBooking}
          onCancel={closeBookingForm}
        />
      ) : editingBooking ? (
        <BookingForm
          key={editingBooking.id}
          bookings={state.bookings}
          employees={state.employees}
          rooms={state.rooms}
          initialBooking={editingBooking}
          onSubmit={handleUpdateBooking}
          onCancel={closeBookingForm}
        />
      ) : null}

      <ConfirmDialog
        open={bookingToDelete !== null}
        title={
          bookingToDelete === null
            ? "Delete booking?"
            : `Delete "${bookingToDelete.title}"?`
        }
        description="This booking will be permanently removed."
        confirmLabel="Delete booking"
        destructive
        onConfirm={handleDeleteBooking}
        onCancel={() => setBookingToDelete(null)}
      />
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">
          Search
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Title, room, or organizer"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Room
          <select
            value={selectedRoomId}
            onChange={(event) => updateFilter("room", event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All rooms</option>
            {state.rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Status
          <select
            value={selectedStatus}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="font-semibold text-slate-950">No bookings found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Create a booking to reserve a meeting room.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {paginatedBookings.map((booking) => {
              const room = state.rooms.find(
                (item) => item.id === booking.roomId,
              );

              const organizer = state.employees.find(
                (employee) => employee.id === booking.organizerId,
              );

              return (
                <li
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2
                        className={[
                          "text-lg font-semibold",
                          booking.status === "cancelled"
                            ? "text-slate-500 line-through"
                            : "text-slate-950",
                        ].join(" ")}
                      >
                        {booking.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-600">
                        <time dateTime={booking.startAt}>
                          {dateTimeFormatter.format(new Date(booking.startAt))}
                        </time>
                        <span> to </span>
                        <time dateTime={booking.endAt}>
                          {dateTimeFormatter.format(new Date(booking.endAt))}
                        </time>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
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

                      <button
                        type="button"
                        onClick={() => openEditForm(booking.id)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingToDelete(booking)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <dl className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Room
                      </dt>
                      <dd className="mt-1 text-sm text-slate-700">
                        {room?.name ?? "Unknown room"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Organizer
                      </dt>
                      <dd className="mt-1 text-sm text-slate-700">
                        {organizer?.name ?? "Unknown organizer"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Attendees
                      </dt>
                      <dd className="mt-1 text-sm text-slate-700">
                        {booking.attendeeIds.length}
                      </dd>
                    </div>
                  </dl>

                  {booking.description && (
                    <p className="mt-5 text-sm text-slate-600">
                      {booking.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <nav
            aria-label="Bookings pagination"
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-slate-600">
              Showing {firstBookingIndex + 1}–
              {Math.min(
                firstBookingIndex + BOOKINGS_PER_PAGE,
                filteredBookings.length,
              )}{" "}
              of {filteredBookings.length} bookings
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => updatePage(currentPage - 1)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-2 text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => updatePage(currentPage + 1)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </nav>
        </>
      )}
    </section>
  );
}

export default BookingsPage;
