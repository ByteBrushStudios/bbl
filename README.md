# ByteBrush Links (BBL)

ByteBrush Links (BBL) is an open-source redirection and metadata preview platform developed and maintained by ByteBrush Studios. The service allows users to create custom short links (e.g., `https://aka.bytebrush.dev/service`) that redirect to external destinations with full support for Open Graph (OG) previews.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

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

## Project Structure

For a detailed breakdown of the project structure, please see [STRUCTURE.md](STRUCTURE.md).

## Getting Started

### Prerequisites

- Node.js 18+ and [Bun](https://bun.sh/) (recommended package manager)
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

Required environment variables:
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bblinks"

# Next Auth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

For Windows users, you can generate a secure NEXTAUTH_SECRET with PowerShell:
```powershell
[Convert]::ToBase64String((New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes(32))
```

For Unix-based systems:
```bash
openssl rand -base64 32
```

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
- Homepage visibility
- GitHub repository URL

```typescript
export const siteConfig = {
  siteName: "ByteBrush Links",
  domain: "https://aka.bytebrush.dev",
  legalAddress: "Your Legal Address",
  supportEmail: "your-email@example.com",
  discordServer: "https://discord.gg/your-discord",
  adminDiscordIDs: [
    "your_discord_id_here"
  ],
  // When enableHomepage is false, users are redirected to sign-in or admin dashboard
  enableHomepage: true,
  // GitHub repository URL for the open-source project
  githubRepo: "https://github.com/YourOrg/bblinks"
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

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up required environment variables
3. Deploy with default Next.js settings

### Self-Hosted with Docker

1. Create a Dockerfile in the root directory:

```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM oven/bun:1-slim as runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

CMD ["bun", "prisma", "generate", "&&", "bun", "start"]
EXPOSE 3000
```

2. Build and run the Docker container:

```bash
docker build -t bytebrush-links .
docker run -p 3000:3000 --env-file .env bytebrush-links
```

### Other Platforms

- Netlify: Use the Netlify adapter for Next.js
- Railway: Deploy directly from GitHub with environment variable configuration

Make sure to set up your environment variables on your hosting platform.

## Support

For support, please contact us at [support@bytebrush.dev](mailto:support@bytebrush.dev) or join our [Discord server](https://discord.gg/Vv2bdC44Ge).

## Contributing

We welcome contributions to ByteBrush Links! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE). This means:

- You can use, modify, and distribute this software
- If you modify the software, you must disclose the source code
- If you run a modified version on a server and allow users to interact with it, you must make your modifications available
- Any derivative work must also be licensed under AGPL-3.0

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework used
- [Prisma](https://prisma.io/) - ORM for database access
- [NextAuth.js](https://next-auth.js.org/) - Authentication library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

For more details, see the [LICENSE](LICENSE) file or visit the [AGPL-3.0 license page](https://www.gnu.org/licenses/agpl-3.0.en.html).
