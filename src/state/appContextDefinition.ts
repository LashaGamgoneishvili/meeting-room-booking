import { createContext, useContext, type ReactNode } from "react";
import type { AppState } from "./appReducer";
import type { Booking } from "../types";

interface AppContextValue {
  state: AppState;
  createBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (bookingId: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
export interface AppProviderProps {
  children: ReactNode;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("useAppContext must be used inside an AppProvider");
  }

  return context;
}
