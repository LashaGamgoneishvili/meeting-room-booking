# Meeting Room Booking

A responsive meeting room booking application built with React and TypeScript. It allows users to review room availability, browse daily and weekly schedules, and manage bookings without a backend.

## Features

- Dashboard with booking and room availability summaries
- Responsive room list and room detail views
- Daily and weekly calendar views
- URL-backed calendar date and view selection
- Booking search, filtering, and URL-backed pagination
- Create, edit, cancel, and delete bookings
- Room capacity and scheduling conflict validation
- Persistent booking changes using local storage
- Responsive navigation and layouts
- Accessible deletion confirmation dialog

## Technology

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Browser local storage

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```

## Application Routes

| Route            | Description               |
| ---------------- | ------------------------- |
| `/`              | Dashboard                 |
| `/rooms`         | Room list                 |
| `/rooms/:roomId` | Selected room details     |
| `/calendar`      | Daily and weekly calendar |
| `/bookings`      | Booking management        |

Calendar state is stored in the URL using `date` and `view` query parameters.

Booking search, room filters, status filters, pagination, and create or edit state are also represented using URL query parameters.

## Data and Persistence

Initial rooms, employees, and bookings are loaded from JSON files in `public/data`.

Booking data is copied to local storage on the first visit. Creating, editing, cancelling, or deleting a booking updates local storage so changes remain after a page refresh.

The local storage key is:

```text
meeting-room-booking:bookings:v1
```

Clearing this key restores the initial bookings from the JSON seed on the next page load.

## Booking Rules

- A booking must have a title, room, organizer, start time, and end time.
- The end time must be later than the start time.
- The organizer is included in the attendee list.
- The total attendee count cannot exceed room capacity.
- Confirmed bookings for the same room cannot overlap.
- Back-to-back bookings are allowed.
- Cancelled bookings do not reserve a room or create scheduling conflicts.

## Date and Time Handling

Date and time inputs use the browser’s local time zone. Booking timestamps are stored as ISO strings and formatted for the user’s locale when displayed.

## Project Structure

```text
public/data                 Initial JSON data
src/components              Reusable UI components
src/pages                   Route-level pages
src/services                Data loading and persistence
src/state                   Shared application state
src/utils                   Date and booking validation utilities
src/types.ts                Shared TypeScript models
```

## Assumptions

- The application has no authentication or backend.
- Rooms and employees are read-only.
- Booking changes are stored only in the current browser.
- All attendees, including the organizer, count toward room capacity.
- A cancelled booking remains visible until it is explicitly deleted.
