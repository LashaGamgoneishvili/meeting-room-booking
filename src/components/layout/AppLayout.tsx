import { NavLink, Outlet } from "react-router";

function AppLayout() {
  return (
    <>
      <header>
        <NavLink to="/">Meeting Room Booking</NavLink>

        <nav aria-label="Primary navigation">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/rooms">Rooms</NavLink>
          <NavLink to="/calendar">Calendar</NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;
