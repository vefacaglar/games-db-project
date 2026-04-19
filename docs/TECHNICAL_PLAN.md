# Games Database - Technical Plan

## Architecture Overview

Monorepo yapısı:
```
games-db/
├── client/     # Next.js frontend
├── server/     # Node.js backend
└── docs/       # Documentation
```

---

## Tech Stack

| Tier | Technology |
|------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS 4 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Package Manager | npm |

---

## Database Models

### User
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Game
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  genre: String,
  platform: [String],
  playTime: Number (saat cinsinden),
  coverImage: String (URL),
  rating: Number (0-10),
  createdBy: ObjectId (ref: User),
  updatedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### List (Koleksiyon)
```javascript
{
  _id: ObjectId,
  name: String (required),
  user: ObjectId (ref: User, required),
  games: [ObjectId] (ref: Game),
  createdAt: Date,
  updatedAt: Date
}
```

### Review (Yorum)
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  game: ObjectId (ref: Game, required),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Kullanıcı kayıt |
| POST | /api/auth/login | Giriş |
| GET | /api/auth/me | Profil bilgi |

### Games
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/games | Tüm oyunlar (filter/pagination) |
| GET | /api/games/:id | Tek oyun detay |
| POST | /api/games | Yeni oyun (auth) |
| PUT | /api/games/:id | Güncelle (auth) |
| DELETE | /api/games/:id | Sil (auth) |

### Lists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/lists | Kullanıcın listeleri |
| POST | /api/lists | Yeni liste |
| PUT | /api/lists/:id | Güncelle |
| DELETE | /api/lists/:id | Sil |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reviews/:gameId | Oyunun yorumları |
| POST | /api/reviews | Yeni yorum |
| DELETE | /api/reviews/:id | Sil |

---

## Frontend Pages

| Route | Page |
|-------|------|
| / | Ana sayfa (oyun listesi) |
| /games/[id] | Oyun detay |
| /games/new | Yeni oyun ekle |
| /games/[id]/edit | Oyun düzenle |
| /login | Giriş |
| /register | Kayıt |
| /profile | Profil |

---

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/games-db
JWT_SECRET=your-secret-key
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Architecture Principles

### DDD (Domain-Driven Design)

```
server/
├── src/
│   ├── domain/           # Business logic & entities
│   │   ├── entities/     # Domain models
│   │   ├── repositories/ # Data access interfaces
│   │   └── services/     # Domain services
│   ├── application/      # Use cases & orchestration
│   │   ├── dto/          # Data transfer objects
│   │   └── useCases/     # Application用例
│   ├── infrastructure/   # External concerns
│   │   ├── config/       # Configurations
│   │   ├── database/    # MongoDB connection
│   │   └── repositories/ # Repository implementations
│   └── presentation/    # API routes & controllers
│       ├── controllers/ # Route handlers
│       ├── middleware/  # Auth, validation
│       └── routes/      # Express routes
```

### SOLID Principles

| Principle | Application |
|-----------|-------------|
| **S**ingle Responsibility | Her class/function tek bir iş yapar |
| **O**pen/Closed | Extension'a açık, modification'a kapalı |
| **L**iskov Substitution | Interfaces imzaları korur |
| **I**nterface Segregation | Büyük interface yerine küçük, spesifik |
| **D**ependency Inversion | Abstractions'a bağlı, concrete'e değil |

---

## Development Commands

```bash
# Root - tüm projeleri install
npm install

# Server
cd server && npm run dev

# Client
cd client && npm run dev
```