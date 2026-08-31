import { Route, Routes } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import CalendarPage from "./pages/CalendarPage";
import BookingsPage from "./pages/BookingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAppContext } from "./state/appContextDefinition";

function App() {
  const { state } = useAppContext();

  if (state.status === "idle" || state.status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div role="status" aria-live="polite" className="text-center">
          <div
            aria-hidden="true"
            className="mx-auto size-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"
          />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading application data...
          </p>
        </div>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <section className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-600">Unable to load</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">
            Application data could not be loaded
          </h1>
          <p role="alert" className="mt-3 text-sm text-slate-600">
            {state.error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Reload page
          </button>
        </section>
      </main>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="rooms/:roomId" element={<RoomsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
