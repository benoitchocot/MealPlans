# Foodtrack Backend

Backend API for Jow clone - A meal planning and grocery management application.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the values as needed.

4. **Start PostgreSQL with Docker:**
   ```bash
   cd ..
   docker-compose up -d postgres
   ```

5. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

6. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

7. **Start the development server:**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 📦 Available Scripts

- `npm run start:dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm test` - Run unit tests
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🐳 Docker

### Run with Docker Compose (Full Stack)

```bash
docker-compose up --build
```

This will start both PostgreSQL and the backend API.

### Run only PostgreSQL

```bash
docker-compose up -d postgres
```

## 📚 API Documentation

### Authentication Endpoints

#### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```bash
GET /auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### User Endpoints

#### Get Current User
```bash
GET /users/me
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Current User
```bash
PATCH /users/me
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### Get User Settings
```bash
GET /users/me/settings
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update User Settings
```bash
PATCH /users/me/settings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "householdSize": 4,
  "defaultMealsPerWeek": 7,
  "dietPreferences": ["VEGETARIAN"],
  "toolsAvailable": ["oven", "microwave", "blender"],
  "difficultyPreference": "EASY",
  "maxPrepTime": 30
}
```

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM.

### Database Schema

Key models:
- **Users** - User accounts and authentication
- **UserSettings** - User preferences for meal planning
- **Recipes** - Recipe information
- **Ingredients** - Ingredient catalog
- **MealPlans** - Weekly meal plans
- **ShoppingLists** - Generated shopping lists
- **GroceryProducts** - Leclerc Drive product catalog

### Prisma Commands

```bash
# Create a new migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🏗️ Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── auth/              # Authentication module
│   ├── users/             # Users module
│   ├── prisma/            # Prisma service
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── test/                  # E2E tests
├── .env.example           # Environment variables template
├── Dockerfile             # Docker configuration
└── package.json           # Dependencies
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3001` |

## 📝 License

MIT
