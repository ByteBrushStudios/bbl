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
  - `api/` - API routes
    - `links/` - Links API endpoints
  - `auth/` - Authentication-related pages
- `src/lib/` - Shared libraries and utilities
  - `config.ts` - Application configuration
  - `prisma.ts` - Prisma client instance
- `src/types/` - TypeScript type definitions

## Key Files

- `auth.ts` - NextAuth.js configuration
- `middleware.ts` - Next.js middleware for handling routes

## Database Schema

The project uses Prisma with PostgreSQL. The main models are:

- `User` - User accounts (admin users)
- `Link` - Short links with their destinations and metadata
- `Visit` - Analytics data for link visits

## Routing Structure

- `/` - Homepage
- `/[slug]` - Shortened link redirection
- `/admin` - Admin dashboard
- `/admin/links` - Link management
- `/admin/links/create` - Create new link
- `/admin/links/[id]/edit` - Edit existing link
- `/admin/links/[id]/delete` - Delete link confirmation
- `/api/links` - Links API
- `/auth/signin` - Sign in page

## Authentication Flow

Authentication is handled through NextAuth.js with Discord as the OAuth provider. Only users with Discord IDs listed in the `adminDiscordIDs` array in `config.ts` are granted admin access.
