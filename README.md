# ByteBrush Links (BBL)

ByteBrush Links (BBL) is an open-source redirection and metadata preview platform developed and maintained by ByteBrush Studios. The service allows users to create custom short links (e.g., `https://aka.bytebrush.dev/service`) that redirect to external destinations with full support for Open Graph (OG) previews.

## Features

- **Custom Short Links**: Create and manage short links with custom slugs
- **Open Graph Previews**: Add custom metadata for better social media sharing experiences
- **Admin Dashboard**: View link statistics and manage links through an admin interface
- **Discord Authentication**: Secure admin access with Discord OAuth
- **Responsive UI**: Modern, mobile-friendly user interface

## Tech Stack

- **Framework**: Next.js App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Discord provider
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- PostgreSQL database
- Discord application (for OAuth)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/bytebrush/bblinks.git
cd bblinks
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your:
- PostgreSQL connection string
- Discord OAuth credentials
- NextAuth secret

4. Set up the database:

```bash
bun setup
# or manually:
bun prisma db push
bun prisma generate
```

5. Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Configuration

Edit `src/lib/config.ts` to customize:
- Site name and domain
- Legal information
- Admin Discord IDs

```typescript
export const config = {
  siteName: "ByteBrush Links",
  domain: "https://aka.bytebrush.dev",
  legalAddress: "Your Legal Address",
  supportEmail: "your-email@example.com",
  discordServer: "https://discord.gg/your-discord",
  adminDiscordIDs: [
    "your_discord_id_here"
  ]
}
```

## Usage

### Creating a Link

1. Sign in with Discord (admin only)
2. Navigate to the Admin Dashboard
3. Click "Create New Link"
4. Enter a slug, target URL, and optional metadata
5. Click "Create Link"

### Managing Links

1. Navigate to the Admin Dashboard
2. Click "Manage Links"
3. Edit or delete existing links

## Deployment

This application can be deployed on any Node.js-compatible platform that supports Next.js applications:

- Vercel
- Netlify
- Railway
- Self-hosted (Docker, etc.)

Make sure to set up your environment variables on your hosting platform.

## Support

For support, please contact us at [support@bytebrush.dev](mailto:support@bytebrush.dev) or join our [Discord server](https://discord.gg/Vv2bdC44Ge).

## License

This project is open source and available under the MIT License.
