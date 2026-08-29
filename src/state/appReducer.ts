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

    default:
      return state;
  }
}
