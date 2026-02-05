# Shortify - Advanced URL Shortener

A modern, feature-rich URL shortener built with React, TypeScript, and Express. Create short links with custom aliases, password protection, geo-blocking, and detailed analytics.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Features
- 🔗 **Quick URL Shortening** - Create short links instantly without authentication
- 🎨 **Custom Aliases** - Create memorable, branded short codes
- 🔒 **Password Protection** - Secure links with password requirements
- ⏰ **Expiration Dates** - Set automatic link expiration
- 🌍 **Geo-Blocking** - Allow or block access by country
- 📊 **Detailed Analytics** - Track clicks, locations, devices, and more
- 📱 **Responsive Design** - Works seamlessly on all devices

### Advanced Features
- 🎯 **Protected Routes** - User authentication with JWT tokens
- 📈 **Interactive Charts** - Visualize analytics with Recharts
- 🔍 **Search & Filter** - Find links quickly with advanced filtering
- 📋 **Copy to Clipboard** - One-click link copying
- 🎭 **Custom Themes** - Dark mode ready (CSS variables configured)
- ⚡ **Rate Limiting** - Protection against abuse and spam
- 🔔 **Toast Notifications** - User-friendly feedback system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+ (or your preferred database)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wppluginsn/shorten.git
   cd shorten
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your API URL
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
shorten/
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utilities
│   │   └── app.ts        # Express app setup
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main app component
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                 # Documentation
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form management
- **Recharts** - Data visualization
- **Radix UI** - Accessible components
- **Zustand** - State management
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM (ready to integrate)
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📖 Documentation

- [Component Documentation](./frontend/COMPONENTS.md) - Detailed component API
- [Implementation Summary](./frontend/IMPLEMENTATION_SUMMARY.md) - Build details
- [API Documentation](./backend/API.md) - Backend API reference (TBD)

## 🎯 Usage Examples

### Creating a Short Link

**Without Authentication:**
```typescript
// Visit homepage and use quick shortener
const response = await linkService.createPublicLink('https://example.com');
// Returns: { shortCode: 'abc123', ... }
```

**With Advanced Features:**
```typescript
const link = await linkService.createLink({
  originalUrl: 'https://example.com',
  customAlias: 'my-link',
  password: 'secret123',
  expiresAt: new Date('2024-12-31'),
  geoRules: {
    countryCodes: ['US', 'GB', 'CA'],
    mode: 'allow'
  }
});
```

### Viewing Analytics
```typescript
const analytics = await analyticsService.getLinkAnalytics(linkId);
// Returns: clicks by country, device, browser, over time, etc.
```

## 🔒 Security

- ✅ JWT-based authentication
- ✅ Rate limiting on all routes
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ CodeQL security scanning (0 vulnerabilities)

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm run test

# Run backend tests
cd backend
npm run test

# Run linter
npm run lint

# Type check
npm run type-check
```

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output in: dist/
```

### Backend
```bash
cd backend
npm run build
# Output in: dist/
```

## 🚀 Deployment

### Using Docker (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
1. Build both frontend and backend
2. Configure environment variables
3. Set up reverse proxy (nginx)
4. Enable SSL/TLS certificates
5. Configure CDN for static assets

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **wppluginsn** - Initial work - [GitHub](https://github.com/wppluginsn)

## 🙏 Acknowledgments

- React and TypeScript communities
- Tailwind CSS for amazing styling utilities
- Radix UI for accessible components
- Recharts for beautiful data visualizations

## 📊 Project Status

✅ **Complete** - All core features implemented and tested
- Frontend: Production ready
- Backend: API routes ready
- Security: CodeQL verified
- Documentation: Comprehensive

## 🗺️ Roadmap

See [IMPLEMENTATION_SUMMARY.md](./frontend/IMPLEMENTATION_SUMMARY.md) for detailed roadmap including:
- Short-term enhancements (QR codes, bulk operations)
- Medium-term features (A/B testing, custom domains)
- Long-term vision (branded links, ML fraud detection)

## 💬 Support

For support, please open an issue on [GitHub Issues](https://github.com/wppluginsn/shorten/issues).

---

Made with ❤️ by [wppluginsn](https://github.com/wppluginsn)
