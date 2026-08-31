import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      aria-labelledby="not-found-heading"
    >
      <p className="text-sm font-semibold text-indigo-600">404</p>

      <h1
        id="not-found-heading"
        className="mt-2 text-3xl font-bold tracking-tight text-slate-950"
      >
        Page not found
      </h1>

      <p className="mt-3 max-w-md text-sm text-slate-600">
        The page you requested does not exist or may have been moved.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        Return to dashboard
      </Link>
    </section>
  );
}

export default NotFoundPage;
