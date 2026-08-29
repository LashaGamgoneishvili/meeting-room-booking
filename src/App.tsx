import { Route, Routes } from "react-router";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import { useAppContext } from "./state/appContextDefinition";
import RoomsPage from "./pages/RoomsPage";
import CalendarPage from "./pages/CalendarPage";
import BookingsPage from "./pages/BookingsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { state } = useAppContext();

  if (state.status === "idle" || state.status === "loading") {
    return (
      <main>
        <p>Loading application data...</p>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main>
        <p role="alert">{state.error}</p>
      </main>
    );
  }
  return (
    <main>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}

export default App;
