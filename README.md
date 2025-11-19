# Notes App MVP - Tech Stack & Dependency Selection

This document outlines the technology stack and dependency choices for the Notes MVP feature.

## Tech Stack Utilization

Each chosen technology serves a specific purpose in our Notes MVP:

- **Express.js**: Powers our REST API with routing for CRUD operations on notes
- **CORS**: Enables communication between our frontend and backend during development
- **Dotenv**: Manages configuration through environment variables
- **UUID**: Generates unique identifiers for each note
- **Zod**: Validates incoming request payloads for data integrity
- **Next.js**: Provides server-side rendering and client-side interactivity
- **React**: Drives our component-based UI
- **Tailwind CSS**: Styles our application with utility-first CSS
- **Clsx**: Conditionally combines CSS classes for dynamic styling
- **Native Fetch**: Handles all HTTP communication between frontend and backend
- **Concurrently**: Runs both our backend and frontend development servers simultaneously

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the project root:

```
PORT=3001
NODE_ENV=development
```

## Implementation Structure

The application follows a client-server architecture:

- **Backend**: Express.js server handling REST API for notes
- **Frontend**: Next.js application with React components
- **Storage**: In-memory storage (for MVP only)

The project structure is organized as follows:
```
notes-app/
├── backend/
│   └── server.js      # Express API server
├── frontend/
│   ├── components/    # React components
│   └── pages/         # Next.js pages
├── package.json       # Dependencies and scripts
└── README.md          # This documentation
```

## Development Guide

To start the development environment:

1. Install dependencies: `npm install`
2. Create a `.env` file based on the example above
3. Run both frontend and backend: `npm run dev`
4. Access the application at `http://localhost:3000`

The backend API will be available at `http://localhost:3001`.

## Backend Dependencies (In Scope)

These dependencies will be actively used for implementing the Notes feature:

- **express** - HTTP server and routing for the Notes API
- **cors** - CORS configuration to allow the frontend to call backend in development
- **dotenv** - Configuration via environment variables (e.g., ports, allowed origin)
- **uuid** - Generating unique IDs for notes
- **zod** - Request payload validation and schema definition

## Frontend Dependencies (In Scope)

These dependencies will be actively used for implementing the Notes feature:

- **next** - Application framework (routing + rendering)
- **react, react-dom** - UI framework
- **tailwindcss, postcss, autoprefixer** - Styling framework
- **clsx** - Optional helper for dynamic className composition
- **Native fetch** - For HTTP calls to backend (no need for axios)

## Tooling Dependencies (In Scope)

These dependencies support the development workflow:

- **concurrently** - Run backend and Next.js dev server in parallel
- **typescript, @types/*** - For types and developer experience
- **nodemon** - For auto-restarting the backend during development

## Explicitly Out-of-Scope Dependencies

These dependencies are present in the project but will NOT be used for the Notes MVP:

### Database & Storage
- mongoose
- sqlite3
- cloudinary
- express-fileupload
- browserify-fs

### Auth/Security
- bcryptjs
- jsonwebtoken
- jwt-decode
- jwt-encode

### Payments/External Services
- razorpay
- paytmchecksum
- @sendgrid/mail
- ethers

### Time Helpers
- date-fns
- dayjs

### UI Libraries
- @radix-ui/*
- cmdk
- vaul
- embla-carousel-react
- react-day-picker
- input-otp
- lucide-react
- sonner
- recharts
- next-themes
- miragejs
- mockman-js

### HTTP Clients
- axios (we standardize on native fetch)

### Legacy/Other
- request

## Acceptance Criteria

1. ✅ Dependencies used for Notes feature are documented
2. ✅ Out-of-scope dependencies are explicitly marked
3. ✅ All subsequent Notes-related work aligns with this tech stack decision

This minimal, focused tech stack ensures we can implement the Notes MVP without introducing unnecessary complexity or dependencies.

## Conclusion

By carefully selecting only the essential dependencies for our Notes MVP, we've created a solid foundation that:

1. Uses proven technologies (Express, Next.js, React, Tailwind CSS)
2. Minimizes bundle size and attack surface
3. Reduces maintenance overhead
4. Provides clear separation of concerns
5. Standardizes on native fetch for HTTP requests
6. Implements proper validation with Zod
7. Follows modern development practices

All future Notes-related work should adhere to these technology choices to maintain consistency and simplicity.