import { useEffect, useReducer } from "react";
import { appReducer, initialAppState } from "./appReducer";

import { getRooms, getEmployees } from "../services/dataService";
import { loadBookings, saveBookings } from "../services/bookingRepository";
import { AppContext, type AppProviderProps } from "./appContextDefinition";
import type { Booking } from "../types";

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  useEffect(() => {
    if (state.status === "ready") {
      saveBookings(state.bookings);
    }
  }, [state.bookings, state.status]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      dispatch({
        type: "loadStarted",
      });

      try {
        const [rooms, employees, bookings] = await Promise.all([
          getRooms(),
          getEmployees(),
          loadBookings(),
        ]);

        if (cancelled) {
          return;
        }

        dispatch({
          type: "loadSucceeded",
          payload: {
            rooms,
            employees,
            bookings,
          },
        });
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load application data.";

        dispatch({
          type: "loadFailed",
          payload: message,
        });
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  function createBooking(booking: Booking): void {
    dispatch({
      type: "bookingCreated",
      payload: booking,
    });
  }

  function updateBooking(booking: Booking): void {
    dispatch({
      type: "bookingUpdated",
      payload: booking,
    });
  }

  function deleteBooking(bookingId: string): void {
    dispatch({
      type: "bookingDeleted",
      payload: bookingId,
    });
  }

  return (
    <AppContext
      value={{
        state,
        createBooking,
        updateBooking,
        deleteBooking,
      }}
    >
      {children}
    </AppContext>
  );
}
