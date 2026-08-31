import type { Room, Employee, Booking } from "../types";

export interface AppState {
  rooms: Room[];
  employees: Employee[];
  bookings: Booking[];
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
}

export const initialAppState: AppState = {
  rooms: [],
  employees: [],
  bookings: [],
  status: "idle",
  error: null,
};

export type AppAction =
  | {
      type: "loadStarted";
    }
  | {
      type: "loadSucceeded";
      payload: {
        rooms: Room[];
        employees: Employee[];
        bookings: Booking[];
      };
    }
  | {
      type: "loadFailed";
      payload: string;
    }
  | {
      type: "bookingCreated";
      payload: Booking;
    }
  | {
      type: "bookingUpdated";
      payload: Booking;
    }
  | {
      type: "bookingDeleted";
      payload: string;
    };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "loadStarted":
      return {
        ...state,
        status: "loading",
        error: null,
      };

    case "loadSucceeded":
      return {
        rooms: action.payload.rooms,
        employees: action.payload.employees,
        bookings: action.payload.bookings,
        status: "ready",
        error: null,
      };

    case "loadFailed":
      return {
        ...state,
        status: "error",
        error: action.payload,
      };

    case "bookingCreated":
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      };

    case "bookingUpdated":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload.id ? action.payload : booking,
        ),
      };

    case "bookingDeleted":
      return {
        ...state,
        bookings: state.bookings.filter(
          (booking) => booking.id !== action.payload,
        ),
      };

    default:
      return state;
  }
}
