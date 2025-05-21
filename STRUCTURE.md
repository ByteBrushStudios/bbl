# Project Structure

ByteBrush Links (BBL) follows a standard Next.js 14+ App Router structure. This document outlines the key directories and files to help developers understand the project organization.

## Top-Level Directories

- `prisma/` - Database schema and migrations
- `public/` - Static assets served at the root path
- `scripts/` - Setup and utility scripts
- `src/` - Source code for the application

## Source Structure

- `src/app/` - Next.js App Router files
  - `page.tsx` - Home page
  - `[slug]/` - Dynamic route for shortened links
  - `admin/` - Admin dashboard routes
    - `links/` - Link management pages
    - `profile/` - User profile settings
    - `settings/` - System settings management
  - `api/` - API routes
    - `links/` - Links API endpoints
    - `settings/` - Settings API endpoints
  - `auth/` - Authentication-related pages
- `src/components/` - Reusable UI components
  - `layouts/` - Layout components (admin, auth)
  - `providers/` - Context providers
  - `static/` - Static components like Header and Footer
  - `ui/` - UI primitives and shared components
- `src/hooks/` - Custom React hooks (including useSettings)
- `src/lib/` - Shared libraries and utilities
  - `settings.ts` - Database-driven settings management
  - `prisma.ts` - Prisma client instance
- `src/actions/` - Server actions for data mutations

## Key Files

- `auth.ts` - NextAuth.js configuration
- `middleware.ts` - Next.js middleware for handling routes

## Database Schema

The project uses Prisma with PostgreSQL. The main models are:

- `User` - User accounts (admin users)
- `Link` - Short links with their destinations and metadata
- `Visit` - Analytics data for link visits
- `Setting` - Key-value store for application settings

## Configuration System

The application uses a database-driven configuration system:

- Settings are stored in the database in the `Setting` table
- Default values are defined in `src/lib/settings.ts`
- The `useSettings` hook provides client-side access to settings
- Server-side access is available through the `getSettings` function

## Authentication Flow

Authentication is now handled via credentials-based authentication with email/password:

1. User emails are validated against the allowedDomains setting
2. Initial admin account is created during database seeding
3. Role-based permissions control access to admin features

## Styling and UI

- Tailwind CSS for styling
- Framer Motion for animations
- Custom components with responsive design
- Dark mode by default
