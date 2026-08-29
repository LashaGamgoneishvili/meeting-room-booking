import { createContext, useContext, type ReactNode } from "react";
import type { AppState } from "./appReducer";

interface AppContextValue {
  state: AppState;
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
