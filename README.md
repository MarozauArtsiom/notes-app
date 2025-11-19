# Notes App MVP - Tech Stack & Dependency Selection

This document outlines the technology stack and dependency choices for the Notes MVP feature.

## Tech Stack Utilization

Each chosen technology serves a specific purpose in our Notes MVP:

- **NestJS**: Provides a robust, modular architecture for the backend API
- **TypeScript**: Adds type safety and improved developer experience
- **class-validator**: Validates incoming request payloads for data integrity
- **uuid**: Generates unique identifiers for each note
- **@nestjs/config**: Manages configuration through environment variables
- **Next.js**: Provides server-side rendering and client-side interactivity
- **React**: Drives our component-based UI
- **Tailwind CSS**: Styles our application with utility-first CSS
- **Clsx**: Conditionally combines CSS classes for dynamic styling
- **Native Fetch**: Handles all HTTP communication between frontend and backend
- **Concurrently**: Runs both our backend and frontend development servers simultaneously

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the project root:

```
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

For the frontend, create a `.env` file in the `frontend` directory:

```
API_BASE_URL=http://localhost:4000
```

## Implementation Structure

The application follows a client-server architecture:

- **Backend**: NestJS server handling REST API for notes
- **Frontend**: Next.js application with React components
- **Storage**: In-memory storage (for MVP only)

The project structure is organized as follows:
```
notes-app/
├── backend/
│   ├── src/               # NestJS source code
│   │   ├── notes/         # Notes module
│   │   │   ├── dto/       # Data transfer objects
│   │   │   ├── entities/  # Data entities
│   │   │   ├── notes.controller.ts
│   │   │   ├── notes.service.ts
│   │   │   └── notes.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/              # E2E tests
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript configuration
├── frontend/
│   ├── components/        # React components
│   ├── lib/               # API client and utilities
│   ├── pages/             # Next.js pages
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── .env               # Environment variables
├── package.json           # Root dependencies (concurrently)
└── README.md              # This documentation
```

## Development Guide

To start the development environment:

1. Install dependencies: `npm run install:all`
2. Create a `.env` file based on the example above
3. Create a `frontend/.env` file based on the example above
4. Run both frontend and backend: `npm run dev`
5. Access the application at `http://localhost:3000`

The backend API will be available at `http://localhost:4000`.

## Backend API Endpoints

The Notes API provides the following endpoints:

- `POST /notes` - Create a new note
- `GET /notes` - Retrieve all notes
- `GET /notes/:id` - Retrieve a specific note by ID
- `PUT /notes/:id` - Update a specific note by ID
- `DELETE /notes/:id` - Delete a specific note by ID

## Frontend API Client

The frontend includes a centralized API client module (`frontend/lib/notes-api.ts`) that provides:

- Type-safe Note interface
- getAllNotes(): Fetch all notes
- getNote(id): Fetch a single note
- createNote(data): Create a new note
- updateNote(id, data): Update a note
- deleteNote(id): Delete a note

The client uses `API_BASE_URL` environment variable to construct all URLs, making it easy to switch between environments.

## Running Tests

To run the backend API tests:

```bash
cd backend
npm test
```

To run e2e tests:

```bash
cd backend
npm run test:e2e
```

To run tests in watch mode:

```bash
cd backend
npm run test:watch
```

## Backend Dependencies (In Scope)

These dependencies will be actively used for implementing the Notes feature:

- **@nestjs/common** - Core NestJS functionality
- **@nestjs/core** - NestJS core module
- **@nestjs/platform-express** - Express.js integration
- **@nestjs/config** - Configuration management
- **class-validator** - Request payload validation
- **class-transformer** - Object transformation
- **reflect-metadata** - Metadata reflection
- **rxjs** - Reactive programming
- **uuid** - Unique ID generation

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
- **@nestjs/cli** - NestJS command line interface
- **jest, ts-jest, supertest** - Testing frameworks

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

## Conclusion

By carefully selecting only the essential dependencies for our Notes MVP, we've created a solid foundation that:

1. Uses proven technologies (NestJS, Next.js, React, Tailwind CSS)
2. Minimizes bundle size and attack surface
3. Reduces maintenance overhead
4. Provides clear separation of concerns
5. Standardizes on native fetch for HTTP requests
6. Implements proper validation with class-validator
7. Follows modern development practices with TypeScript

All future Notes-related work should adhere to these technology choices to maintain consistency and simplicity.