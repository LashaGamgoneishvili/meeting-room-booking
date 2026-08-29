import { useEffect, useReducer } from "react";
import { appReducer, initialAppState } from "./appReducer";

import { getRooms, getEmployees } from "../services/dataService";
import { loadBookings } from "../services/bookingRepository";
import { AppContext, type AppProviderProps } from "./appContextDefinition";

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

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

  return <AppContext value={{ state }}>{children}</AppContext>;
}
