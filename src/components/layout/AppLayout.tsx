import { NavLink, Outlet } from "react-router";

const navigationItems = [
  { label: "Dashboard", to: "/" },
  { label: "Rooms", to: "/rooms" },
  { label: "Calendar", to: "/calendar" },
  { label: "Bookings", to: "/bookings" },
];

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <NavLink
            to="/"
            className="flex items-center gap-3 font-semibold tracking-tight focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              MR
            </span>
            <span>Meeting Room Booking</span>
          </NavLink>

          <nav
            className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:pb-0"
            aria-label="Primary navigation"
          >
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
