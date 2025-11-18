# Nexus Backend API

> **Production-ready REST API for Nexus IDE platform**

Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

---

## 🚀 Features

- ✅ **Authentication** - JWT-based auth with OAuth support (GitHub, Discord)
- ✅ **User Management** - Profile, onboarding, password change
- ✅ **Contact System** - Contact forms, newsletter, waitlist
- ✅ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **Database** - Prisma ORM with PostgreSQL
- ✅ **TypeScript** - Full type safety
- ✅ **Error Handling** - Centralized error handling
- ✅ **Audit Logs** - Track all user actions
- ✅ **Email Ready** - Email service integration ready

---

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **yarn**

---

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nexus"

# JWT
JWT_SECRET=your-super-secret-key-here

# OAuth (optional for MVP)
GITHUB_CLIENT_ID=your_github_id
DISCORD_CLIENT_ID=your_discord_id
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Server will run on `http://localhost:3001`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Prisma client
│   │   └── env.ts        # Environment variables
│   │
│   ├── controllers/      # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── contact.controller.ts
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # JWT authentication
│   │   ├── validation.ts # Input validation
│   │   └── errorHandler.ts
│   │
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── contact.routes.ts
│   │
│   ├── utils/            # Utility functions
│   │   ├── jwt.ts        # JWT helpers
│   │   └── password.ts   # Password hashing
│   │
│   └── index.ts          # Main server file
│
├── prisma/
│   └── schema.prisma     # Database schema
│
├── tests/                # Test files
├── .env.example          # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| PUT | `/api/users/onboarding` | Save onboarding data | Yes |
| POST | `/api/users/change-password` | Change password | Yes |
| DELETE | `/api/users/account` | Delete account | Yes |

### Contact & Newsletter

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form | No |
| POST | `/api/contact/newsletter/subscribe` | Subscribe to newsletter | No |
| POST | `/api/contact/newsletter/unsubscribe` | Unsubscribe | No |
| POST | `/api/contact/waitlist` | Join waitlist | No |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

---

## 📝 API Examples

### Sign Up

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "clx...",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": null,
    "createdAt": "2025-11-18T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Profile (Authenticated)

```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Onboarding

```bash
curl -X PUT http://localhost:3001/api/users/onboarding \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "fullstack",
    "languages": ["typescript", "python", "rust"],
    "theme": "dark",
    "aiProvider": "gemini"
  }'
```

### Submit Contact Form

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "type": "general",
    "message": "I have a question about Nexus..."
  }'
```

---

## 🗄️ Database Schema

### User Table
- `id` - Unique identifier (cuid)
- `email` - User email (unique)
- `name` - Full name
- `password` - Hashed password (nullable for OAuth)
- `githubId`, `discordId` - OAuth IDs
- `role`, `languages`, `theme`, `aiProvider` - Onboarding data
- `hasCompletedOnboarding` - Boolean flag
- `isActive`, `emailVerified` - Account status
- `createdAt`, `updatedAt`, `lastLoginAt` - Timestamps

### Other Tables
- **Session** - JWT session tokens
- **ApiKey** - API keys for users
- **ContactMessage** - Contact form submissions
- **Newsletter** - Newsletter subscribers
- **WaitlistEntry** - Waitlist entries
- **AuditLog** - User action logs

---

## 🔒 Security Features

1. **Password Hashing** - bcrypt with 12 rounds
2. **JWT Authentication** - Secure token-based auth
3. **Rate Limiting** - 100 requests per 15 minutes
4. **Input Validation** - express-validator
5. **Helmet** - Security headers
6. **CORS** - Configurable origins
7. **Audit Logging** - Track all user actions
8. **SQL Injection Protection** - Prisma ORM

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t nexus-backend .
```

### Run Container

```bash
docker run -p 3001:3001 \
  -e DATABASE_URL="your_db_url" \
  -e JWT_SECRET="your_secret" \
  nexus-backend
```

### Docker Compose

```bash
docker-compose up -d
```

---

## 📊 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| NODE_ENV | Environment (development/production) | No | development |
| PORT | Server port | No | 3001 |
| DATABASE_URL | PostgreSQL connection string | Yes | - |
| JWT_SECRET | Secret for JWT signing | Yes | - |
| JWT_EXPIRES_IN | Token expiration | No | 7d |
| GITHUB_CLIENT_ID | GitHub OAuth ID | No | - |
| DISCORD_CLIENT_ID | Discord OAuth ID | No | - |
| SMTP_HOST | Email server host | No | - |
| CORS_ORIGIN | Allowed CORS origin | No | http://localhost:3000 |

---

## 🚀 Deployment

### Vercel

The backend can be deployed to Vercel as serverless functions. See `vercel.json` for configuration.

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

### Heroku

```bash
# Create app
heroku create nexus-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

### AWS / DigitalOcean

Use the Docker image for easy deployment on any VPS.

---

## 🔧 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql postgresql://user:password@localhost:5432/nexus
```

### Prisma Migration Issues

```bash
# Reset database
npm run prisma:reset

# Generate client
npm run prisma:generate
```

### Port Already in Use

```bash
# Change PORT in .env
PORT=3002
```

---

## 📖 API Documentation

Full API documentation is available at `/api/docs` when running in development mode.

Or view the [Postman Collection](./docs/postman-collection.json).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 📞 Support

- **Email**: dev@nexus-ide.dev
- **Discord**: https://discord.gg/nexus-ide
- **Issues**: GitHub Issues

---

**Built with ❤️ by the Nexus team**

*Powering the future of code editing* 🚀
