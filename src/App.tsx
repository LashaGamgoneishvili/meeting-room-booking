import "./App.css";
import { useAppContext } from "./state/appContextDefinition";

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
      <h1>Meeting Room Booking</h1>
      <p>Rooms: {state.rooms.length}</p>
      <p>Employees: {state.employees.length}</p>
      <p>Booking: {state.bookings.length}</p>
    </main>
  );
}

export default App;
