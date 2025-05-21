# ByteBrush Links
A modern link shortener and redirect management system built with Next.js 14, Prisma, and TypeScript.

> [!CAUTION]
> ByteBrush Links is not yet ready for production use and is only public at this stage for transparency. Please check back in a few days for an official release :D 

![Dashboard Preview](./public/bytebrush/preview.png)

## Features

- ⚡️ Create and manage shortened links with custom slugs
- 🎨 Customizable OpenGraph metadata for social media sharing
- 📈 Track link visits and analytics
- 🔒 Secure authentication system with role-based access control
- 🌐 Database-driven configuration system
- 🎭 Beautiful UI with Framer Motion animations
- 📱 Fully responsive design for all devices
- 🌙 Dark mode by default

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Animations**: Framer Motion
- **Form Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bblinks.git
   cd bblinks
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables by creating a `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/bblinks"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   INITIAL_ADMIN_EMAIL="admin@example.com"
   INITIAL_ADMIN_PASSWORD="securepassword"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configuration
- `/prisma` - Prisma schema and migrations
- `/public` - Static assets

## Dynamic Configuration

ByteBrush Links uses a database-driven configuration system that allows you to customize the application without changing code. All settings are stored in the database and can be managed through the admin interface:

- Site name and branding
- Domain settings
- Access controls
- UI appearance
- Default link behavior

## User Roles

- **User**: Can create and manage their own links
- **Admin**: Can manage all links and users
- **Superadmin**: Full access to all features and settings

## ❓ Support

> [!IMPORTANT]
> For support, feature requests, or bug reports, please:
> 1. Check the [GitHub Issues](https://github.com/ByteBrushStudios/bbl/issues)
> 2. Join our [Discord Server](https://discord.gg/Vv2bdC44Ge)
> 3. Email us [hey@bytebrush.dev](mailto:hey@bytebrush.dev)

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

## Credits

Created with ❤️ by [ByteBrush Studios](https://bytebrush.dev)
