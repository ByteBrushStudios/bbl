# ByteBrush Links - Self-Hosted Link Management Platform

ByteBrush Links is a modern, self-hosted link management platform that allows you to create and manage branded short links with your own domain. It includes powerful features like custom metadata for social media previews, analytics, and team collaboration.

![ByteBrush Links Dashboard](public/docs/dashboard-preview.png)

## Features

- 🔗 **Custom Short Links**: Create branded short links with your own domain
- 🖼️ **Rich Metadata**: Add titles, descriptions, and images for social media previews
- 📊 **Analytics**: Track link performance with built-in analytics
- 👥 **Team Collaboration**: Invite team members to manage links together
- 🔒 **Access Control**: Role-based permissions (Admin, User)
- 🌐 **Domain Restrictions**: Limit access to specific email domains
- 🚀 **Fast & Lightweight**: Optimized for performance
- 🎨 **Customizable**: Configure to match your brand
- 🔧 **Self-Hosted**: Full control over your data and infrastructure

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Docker for containerized deployment

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ByteBrushStudios/bbl.git
   cd bbl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your configuration

4. Set up the database:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. Build and start the application:
   ```bash
   npm run build
   npm start
   ```

### Docker Deployment

```bash
docker-compose up -d
```

## Configuration

ByteBrush Links is designed to be highly configurable. All settings are stored in the database and can be configured through environment variables or the admin panel.

### Core Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `siteName` | Name of your link service | ByteBrush Links |
| `domain` | Your service's domain | https://aka.bytebrush.dev |
| `company` | Your company name | ByteBrush Studios |
| `supportEmail` | Support email address | support@bytebrush.dev |
| `allowedDomains` | List of allowed email domains | ["bytebrush.dev"] |
| `enableBasePages` | Enable public landing pages | true |

### Link Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `redirectDelay` | Delay in seconds before redirecting | 0 |
| `trackingPixelEnabled` | Enable tracking pixel for analytics | true |
| `defaultLinkActive` | Default status for new links | true |

## Authentication

Authentication is handled via NextAuth.js. You can configure various auth providers in the `.env` file.

Currently supported authentication methods:
- Credentials (email/password)

## Development

```bash
# Run development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

Made with ❤️ by [ByteBrush Studios](https://bytebrush.dev)
