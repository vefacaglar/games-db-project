# HowLongToBeat-Inspired Playtime Tracker — Technical Architecture & Task Brief

## 1. Project Intent

Build a **HowLongToBeat-inspired game playtime tracker**, but do **not** copy HowLongToBeat branding, layout, database, wording, or scraped content.

The goal is to create an original application where users can:

- Search games
- View estimated playtimes
- Submit their own playtime data
- Track backlog/completion status
- See aggregated playtime statistics
- Maintain a personal game library

This project should be implemented as a **single repository** with two main folders:

```txt
client/
server/
```

- `client/` contains the Next.js frontend.
- `server/` contains the Node.js backend API, domain logic, application layer, infrastructure layer, and MongoDB access.

---

## 2. Important Legal/Product Constraint

Do **not** scrape or clone HowLongToBeat data.

This project may be inspired by the general concept of community-submitted game completion times, but it must use:

- Manual user submissions
- Original seed data
- Public APIs with proper terms of use
- Admin-created game records
- User-generated contributions

Avoid:

- Same branding
- Same visual identity
- Same data
- Same page structure
- Same copywriting
- Same legally risky naming

---

## 3. Core Product Concept

The app is a community-driven game playtime tracker.

Users submit how long it took them to complete a game under different completion categories.

Main playtime categories:

- Main Story
- Main + Side Content
- Completionist
- Casual / Unstructured
- Abandoned / Dropped

The system aggregates submissions into public estimates.

The public estimate should not be a naive average. It should be calculated with domain rules such as:

- Exclude unapproved submissions
- Separate playtime categories
- Separate platform data when useful
- Calculate average and median
- Detect extreme outliers later
- Show confidence level based on submission count
- Prefer median when sample size is small or values vary heavily

---

## 4. Repository Structure

Use a **single repo** with separated client and server folders.

```txt
playtime-tracker/
  client/
    src/
      app/
        page.tsx
        games/
          page.tsx
          [slug]/
            page.tsx
        submit-playtime/
          page.tsx
        dashboard/
          page.tsx
        admin/
          submissions/
            page.tsx

      components/
        games/
          GameCard.tsx
          GameSearch.tsx
          PlaytimeStatsPanel.tsx
        forms/
          SubmitPlaytimeForm.tsx
        layout/
          Header.tsx
          Footer.tsx

      features/
        games/
          api/
            gameApi.ts
          types/
            gameTypes.ts
          components/
            GameList.tsx
            GameDetail.tsx

        playtime/
          api/
            playtimeApi.ts
          types/
            playtimeTypes.ts
          components/
            PlaytimeSubmissionForm.tsx

        library/
          api/
            libraryApi.ts
          types/
            libraryTypes.ts
          components/
            UserLibrary.tsx

      shared/
        api/
          httpClient.ts
        types/
          ApiResponse.ts
        utils/
          formatHours.ts

    package.json
    next.config.ts
    tsconfig.json
    .env.local

  server/
    src/
      modules/
        games/
          domain/
            Game.ts
            GameId.ts
            GameSlug.ts
            GameProfile.ts
            GamePlaytimeStats.ts
            PlaytimeCategory.ts
            PlaytimeEstimate.ts
            Platform.ts
            Genre.ts

          application/
            SearchGamesUseCase.ts
            GetGameDetailsUseCase.ts
            CreateGameUseCase.ts
            UpdateGameProfileUseCase.ts
            CalculatePlaytimeStatsUseCase.ts

          infrastructure/
            MongoGameRepository.ts
            MongoGameMapper.ts
            GameMongoSchema.ts

          presentation/
            gameDtos.ts
            gameRoutes.ts
            gameController.ts

        playtime/
          domain/
            PlaytimeSubmission.ts
            PlaytimeSubmissionId.ts
            PlaytimeSubmissionStatus.ts
            CompletionType.ts
            PlaytimeHours.ts

          application/
            SubmitPlaytimeUseCase.ts
            ApprovePlaytimeSubmissionUseCase.ts
            RejectPlaytimeSubmissionUseCase.ts
            ListPendingSubmissionsUseCase.ts

          infrastructure/
            MongoPlaytimeSubmissionRepository.ts
            MongoPlaytimeSubmissionMapper.ts
            PlaytimeSubmissionMongoSchema.ts

          presentation/
            playtimeDtos.ts
            playtimeRoutes.ts
            playtimeController.ts

        users/
          domain/
            User.ts
            UserId.ts
            UserGameStatus.ts

          application/
            AddGameToLibraryUseCase.ts
            UpdateUserGameStatusUseCase.ts
            GetUserLibraryUseCase.ts

          infrastructure/
            MongoUserRepository.ts
            MongoUserGameLibraryRepository.ts

          presentation/
            userRoutes.ts
            userController.ts

        shared/
          domain/
            Result.ts
            DomainError.ts
            Entity.ts
            ValueObject.ts

          application/
            UseCase.ts

          infrastructure/
            mongo/
              mongoClient.ts
              mongoDb.ts
            config/
              env.ts

          presentation/
            errorHandler.ts
            validateRequest.ts

      app.ts
      server.ts
      routes.ts

    package.json
    tsconfig.json
    .env

  package.json
  README.md
```

---

## 5. Recommended Tech Stack

## Client

- Next.js
- React
- TypeScript
- Tailwind CSS
- App Router
- Client-side API calls to the backend server
- Optional server-side rendering for public game pages later

## Server

- Node.js
- TypeScript
- Express, Fastify, or Hono
- MongoDB
- Lightweight DDD
- Repository pattern
- Use case/application layer
- Zod validation

Recommended backend framework:

```txt
Fastify or Express
```

For a free LLM coding agent, **Express may be safer** because most models generate more predictable Express code.

---

## 6. Architecture Style

Use **lightweight DDD**, not over-engineered enterprise DDD.

The goal is separation of concerns, not ceremony.

### Rules

- `client/` must not contain domain logic.
- `client/` must not access MongoDB directly.
- `client/` talks to `server/` through HTTP API.
- `server/` owns business logic.
- `server/` owns MongoDB access.
- Controllers/routes must stay thin.
- Business logic must stay in application/domain layers.
- Mongo-specific code must stay in infrastructure.
- Do not put business rules inside UI components.
- Do not put business rules inside route handlers.
- Use TypeScript strict mode.
- Avoid unnecessary abstractions.
- Avoid generic names like `helper`, `manager`, or vague `service`.
- Prefer use-case names that describe actions.

---

## 7. Backend Layer Responsibilities

## Domain Layer

Contains core business concepts and rules.

Should not import:

- Express
- Fastify
- MongoDB
- React
- Next.js
- HTTP libraries

Examples:

```txt
Game
GameSlug
PlaytimeSubmission
PlaytimeHours
PlaytimeEstimate
GamePlaytimeStats
```

---

## Application Layer

Contains use cases.

Examples:

```txt
SearchGamesUseCase
SubmitPlaytimeUseCase
ApprovePlaytimeSubmissionUseCase
CalculatePlaytimeStatsUseCase
```

Use cases may depend on repository interfaces, not concrete Mongo classes.

---

## Infrastructure Layer

Contains technical implementation.

Examples:

```txt
MongoGameRepository
MongoPlaytimeSubmissionRepository
MongoUserRepository
mongoClient
env
```

---

## Presentation Layer

Contains API routes, controllers, DTOs, request validation, and response mapping.

Examples:

```txt
gameRoutes
gameController
playtimeRoutes
playtimeController
gameDtos
```

Rules:

- Controllers should call use cases.
- Controllers should not calculate stats directly.
- Controllers should not contain Mongo queries directly.
- Controllers should map request/response only.

---

## 8. Frontend Responsibilities

The frontend should focus on:

- Page rendering
- Forms
- Search UI
- API calls
- Loading/error states
- Simple view models
- Display formatting

The frontend should not:

- Calculate public playtime estimates
- Decide submission approval rules
- Access MongoDB
- Duplicate backend validation rules beyond basic form validation

Frontend API files should call backend endpoints:

```txt
client/src/features/games/api/gameApi.ts
client/src/features/playtime/api/playtimeApi.ts
client/src/features/library/api/libraryApi.ts
```

Example:

```ts
export async function searchGames(query: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games?query=${query}`);
  if (!response.ok) {
    throw new Error("Failed to search games");
  }
  return response.json();
}
```

---

## 9. Core Domain Model

## Game

Represents a game entry.

Suggested fields:

```ts
type Game = {
  id: GameId;
  slug: GameSlug;
  title: string;
  description?: string;
  releaseDate?: Date;
  platforms: Platform[];
  genres: Genre[];
  coverImageUrl?: string;
  developer?: string;
  publisher?: string;
  createdAt: Date;
  updatedAt: Date;
};
```

Business rules:

- Slug must be unique.
- Title is required.
- Game can exist without playtime data.
- Game profile should be editable by admin/moderator.
- Game should not depend on user-submitted playtime records directly.

---

## PlaytimeSubmission

Represents one user's submitted completion time.

Suggested fields:

```ts
type PlaytimeSubmission = {
  id: PlaytimeSubmissionId;
  gameId: GameId;
  userId?: UserId;
  category: PlaytimeCategory;
  platform?: Platform;
  hours: number;
  minutes?: number;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: UserId;
};
```

Business rules:

- Submitted hours must be greater than 0.
- Extremely high values may be flagged for moderation.
- New submissions should be pending by default unless MVP skips moderation.
- Only approved submissions should affect public playtime estimates.
- Category is required.
- Platform is optional but useful.

---

## PlaytimeCategory

Initial categories:

```ts
enum PlaytimeCategory {
  MainStory = "main_story",
  MainPlusSides = "main_plus_sides",
  Completionist = "completionist",
  Casual = "casual",
  Dropped = "dropped"
}
```

Notes:

- `Dropped` should not be included in normal completion estimates unless shown separately.
- `Casual` may be useful but should not distort main estimates.

---

## GamePlaytimeStats

Represents calculated aggregate statistics for a game.

Suggested fields:

```ts
type GamePlaytimeStats = {
  gameId: GameId;
  mainStory?: PlaytimeEstimate;
  mainPlusSides?: PlaytimeEstimate;
  completionist?: PlaytimeEstimate;
  casual?: PlaytimeEstimate;
  lastCalculatedAt: Date;
};
```

---

## PlaytimeEstimate

```ts
type PlaytimeEstimate = {
  category: PlaytimeCategory;
  averageHours: number;
  medianHours: number;
  minHours: number;
  maxHours: number;
  submissionCount: number;
  confidence: "low" | "medium" | "high";
};
```

Confidence rule suggestion:

```txt
0 submissions     -> unavailable
1-4 submissions   -> low
5-19 submissions  -> medium
20+ submissions   -> high
```

---

## UserGameStatus

Tracks a user's relationship with a game.

Suggested statuses:

```ts
enum UserGameStatus {
  Wishlist = "wishlist",
  Backlog = "backlog",
  Playing = "playing",
  Completed = "completed",
  Dropped = "dropped"
}
```

---

## 10. MongoDB Collections

## games

```json
{
  "_id": "ObjectId",
  "slug": "fallout-4",
  "title": "Fallout 4",
  "description": "Original description written by this app/admin/user.",
  "releaseDate": "2015-11-10T00:00:00.000Z",
  "platforms": ["pc", "playstation", "xbox"],
  "genres": ["rpg", "open_world"],
  "coverImageUrl": "...",
  "developer": "Bethesda Game Studios",
  "publisher": "Bethesda Softworks",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Indexes:

```txt
unique index on slug
text index on title
optional index on genres
optional index on platforms
```

---

## playtime_submissions

```json
{
  "_id": "ObjectId",
  "gameId": "ObjectId",
  "userId": "ObjectId or null",
  "category": "main_story",
  "platform": "pc",
  "hours": 42.5,
  "notes": "Played casually with some side quests.",
  "status": "pending",
  "createdAt": "...",
  "reviewedAt": null,
  "reviewedBy": null
}
```

Indexes:

```txt
index on gameId
index on status
compound index on gameId + status + category
optional index on userId
```

---

## game_playtime_stats

Can be stored as a cached projection.

```json
{
  "_id": "ObjectId",
  "gameId": "ObjectId",
  "mainStory": {
    "averageHours": 25.4,
    "medianHours": 24,
    "minHours": 18,
    "maxHours": 36,
    "submissionCount": 24,
    "confidence": "high"
  },
  "mainPlusSides": {
    "averageHours": 54.2,
    "medianHours": 52,
    "minHours": 35,
    "maxHours": 90,
    "submissionCount": 18,
    "confidence": "medium"
  },
  "completionist": {
    "averageHours": 117.5,
    "medianHours": 110,
    "minHours": 80,
    "maxHours": 180,
    "submissionCount": 9,
    "confidence": "medium"
  },
  "lastCalculatedAt": "..."
}
```

---

## user_game_library

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "gameId": "ObjectId",
  "status": "playing",
  "personalRating": 9,
  "personalNotes": "Want to finish DLC later.",
  "startedAt": "...",
  "completedAt": null,
  "updatedAt": "..."
}
```

Indexes:

```txt
compound unique index on userId + gameId
index on userId
index on status
```

---

## 11. API Route Suggestions

Backend server should expose these routes.

## Public

```txt
GET    /api/games
GET    /api/games/:slug
POST   /api/playtime-submissions
```

## User

```txt
GET    /api/me/library
POST   /api/me/library
PATCH  /api/me/library/:gameId
DELETE /api/me/library/:gameId
```

## Admin

```txt
GET    /api/admin/submissions
POST   /api/admin/submissions/:id/approve
POST   /api/admin/submissions/:id/reject
POST   /api/admin/games
PATCH  /api/admin/games/:id
```

---

## 12. UI Pages

## MVP Pages

```txt
client/src/app/
  page.tsx
  games/
    page.tsx
    [slug]/
      page.tsx
  submit-playtime/
    page.tsx
  dashboard/
    page.tsx
  admin/
    submissions/
      page.tsx
```

Page behavior:

```txt
/
  Landing page with search and popular/recent games

/games
  Searchable game list

/games/[slug]
  Game detail page
  Shows playtime estimates
  Shows platforms/genres
  Allows playtime submission

/submit-playtime
  Manual submission page

/dashboard
  User library/backlog page

/admin/submissions
  Admin moderation page
```

---

## 13. MVP Scope

The MVP should be deliberately small.

## Must Have

- Game list
- Game detail page
- Manual playtime submission
- Average/median playtime calculation
- Search
- Basic user backlog
- Admin approval screen
- Seed data

## Should Have

- Platform field
- Genre filtering
- Confidence labels
- Basic moderation state
- Basic validation

## Can Wait

- Steam import
- IGDB/RAWG import
- Recommendations
- Public user profiles
- Complex analytics
- Social features
- Comments
- Reviews
- Advanced admin roles

---

## 14. Suggested Development Tasks

# Phase 1 — Repository Setup

## Task 1.1 — Create Root Repo

Create root repository structure:

```txt
playtime-tracker/
  client/
  server/
  package.json
  README.md
```

Acceptance criteria:

- Repo has separate `client` and `server` folders.
- Root README explains how to run both apps.
- Root package can optionally include scripts for running both apps.

Suggested root scripts:

```json
{
  "scripts": {
    "dev:client": "npm --prefix client run dev",
    "dev:server": "npm --prefix server run dev",
    "dev": "concurrently "npm run dev:server" "npm run dev:client""
  }
}
```

---

## Task 1.2 — Create Next.js Client

Create Next.js app inside:

```txt
client/
```

Use:

- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Strict TypeScript

Acceptance criteria:

- Client runs locally.
- Basic home page renders.
- `NEXT_PUBLIC_API_URL` is used for backend calls.

---

## Task 1.3 — Create Node.js Server

Create Node.js backend inside:

```txt
server/
```

Use:

- TypeScript
- Express or Fastify
- Zod
- MongoDB driver or Mongoose
- Nodemon/tsx for local dev

Acceptance criteria:

- Server runs locally.
- Health check endpoint exists:

```txt
GET /api/health
```

- Server reads config from `.env`.
- CORS is configured for the client URL.

---

## Task 1.4 — Add MongoDB Connection

Create shared MongoDB infrastructure in server:

```txt
server/src/modules/shared/infrastructure/mongo/mongoClient.ts
server/src/modules/shared/infrastructure/mongo/mongoDb.ts
server/src/modules/shared/infrastructure/config/env.ts
```

Acceptance criteria:

- Mongo connection is centralized.
- Environment variables are validated.
- No controller directly creates raw Mongo clients.

---

# Phase 2 — Backend Domain Layer

## Task 2.1 — Create Game Domain Model

Create:

```txt
server/src/modules/games/domain/Game.ts
server/src/modules/games/domain/GameId.ts
server/src/modules/games/domain/GameSlug.ts
server/src/modules/games/domain/Platform.ts
server/src/modules/games/domain/Genre.ts
```

Acceptance criteria:

- Game requires title and slug.
- Slug validation exists.
- Domain model does not import MongoDB.

---

## Task 2.2 — Create Playtime Domain Model

Create:

```txt
server/src/modules/playtime/domain/PlaytimeSubmission.ts
server/src/modules/playtime/domain/PlaytimeSubmissionId.ts
server/src/modules/playtime/domain/PlaytimeSubmissionStatus.ts
server/src/modules/playtime/domain/PlaytimeCategory.ts
server/src/modules/playtime/domain/PlaytimeHours.ts
```

Acceptance criteria:

- Hours must be greater than zero.
- Category is required.
- New submission defaults to pending.
- Domain model does not import MongoDB.

---

## Task 2.3 — Create Playtime Stats Domain Logic

Create:

```txt
server/src/modules/games/domain/GamePlaytimeStats.ts
server/src/modules/games/domain/PlaytimeEstimate.ts
server/src/modules/games/domain/CalculatePlaytimeStats.ts
```

Acceptance criteria:

- Calculates average.
- Calculates median.
- Calculates min/max.
- Calculates confidence.
- Excludes rejected/pending submissions.
- Separates categories.

---

# Phase 3 — Backend Infrastructure Layer

## Task 3.1 — Create Mongo Game Repository

Create:

```txt
server/src/modules/games/infrastructure/MongoGameRepository.ts
server/src/modules/games/infrastructure/MongoGameMapper.ts
server/src/modules/games/infrastructure/GameMongoSchema.ts
```

Acceptance criteria:

- Can create game.
- Can find game by slug.
- Can search games by title.
- Can list games with pagination.
- Mongo documents are mapped to domain objects.

---

## Task 3.2 — Create Mongo Playtime Submission Repository

Create:

```txt
server/src/modules/playtime/infrastructure/MongoPlaytimeSubmissionRepository.ts
server/src/modules/playtime/infrastructure/MongoPlaytimeSubmissionMapper.ts
server/src/modules/playtime/infrastructure/PlaytimeSubmissionMongoSchema.ts
```

Acceptance criteria:

- Can create submission.
- Can list submissions by game.
- Can list pending submissions.
- Can approve/reject submission.
- Can fetch approved submissions for stats calculation.

---

# Phase 4 — Backend Application Layer

## Task 4.1 — Implement SearchGamesUseCase

Acceptance criteria:

- Accepts query string.
- Returns paginated results.
- Does not expose Mongo documents directly.
- Uses repository interface.

---

## Task 4.2 — Implement GetGameDetailsUseCase

Acceptance criteria:

- Returns game by slug.
- Includes cached or calculated playtime stats.
- Returns clear not-found error.

---

## Task 4.3 — Implement SubmitPlaytimeUseCase

Acceptance criteria:

- Validates game exists.
- Validates category.
- Validates hours.
- Creates pending submission.
- Returns submission result DTO.

---

## Task 4.4 — Implement Moderation Use Cases

Create:

```txt
ApprovePlaytimeSubmissionUseCase.ts
RejectPlaytimeSubmissionUseCase.ts
ListPendingSubmissionsUseCase.ts
```

Acceptance criteria:

- Admin can list pending submissions.
- Admin can approve submission.
- Admin can reject submission.
- Approved submission triggers stats recalculation or marks stats as stale.

---

# Phase 5 — Backend API Routes

## Task 5.1 — Public Game Routes

Create:

```txt
GET /api/games
GET /api/games/:slug
```

Acceptance criteria:

- Route handlers/controllers are thin.
- Routes call use cases.
- Errors are returned consistently.

---

## Task 5.2 — Playtime Submission Route

Create:

```txt
POST /api/playtime-submissions
```

Acceptance criteria:

- Accepts game ID or slug.
- Accepts category/platform/hours/notes.
- Calls `SubmitPlaytimeUseCase`.
- Does not contain business logic in the route.

---

## Task 5.3 — Admin Routes

Create:

```txt
GET  /api/admin/submissions
POST /api/admin/submissions/:id/approve
POST /api/admin/submissions/:id/reject
```

Acceptance criteria:

- Routes call moderation use cases.
- Basic placeholder admin guard exists.
- Business logic is not inside route handlers.

---

# Phase 6 — Client API Layer

## Task 6.1 — Add Shared HTTP Client

Create:

```txt
client/src/shared/api/httpClient.ts
```

Acceptance criteria:

- Uses `NEXT_PUBLIC_API_URL`.
- Handles JSON responses.
- Handles failed responses consistently.

---

## Task 6.2 — Add Feature API Files

Create:

```txt
client/src/features/games/api/gameApi.ts
client/src/features/playtime/api/playtimeApi.ts
client/src/features/library/api/libraryApi.ts
```

Acceptance criteria:

- Game pages use `gameApi.ts`.
- Playtime forms use `playtimeApi.ts`.
- No component hardcodes raw endpoint logic repeatedly.

---

# Phase 7 — Client UI

## Task 7.1 — Landing Page

Acceptance criteria:

- Shows project name.
- Shows search box.
- Shows recently added games or seed games.
- Links to game detail pages.

---

## Task 7.2 — Game List Page

Acceptance criteria:

- Search games.
- Display title, platforms, genres.
- Link each game to detail page.

---

## Task 7.3 — Game Detail Page

Acceptance criteria:

- Shows title, description, platform, genre.
- Shows playtime estimates by category.
- Shows confidence.
- Has link/button to submit playtime.

---

## Task 7.4 — Submit Playtime Form

Acceptance criteria:

- Select game.
- Select category.
- Enter hours.
- Optional platform.
- Optional notes.
- Submits to server API.
- Shows validation errors.

---

## Task 7.5 — Admin Submission Review Page

Acceptance criteria:

- Lists pending submissions.
- Shows game, category, hours, platform, notes.
- Approve button.
- Reject button.
- Updates list after action.

---

# Phase 8 — Seed Data

## Task 8.1 — Add Seed Script

Create seed script in server:

```txt
server/src/scripts/seed.ts
```

Seed:

- Games
- Platforms
- Genres
- Example approved submissions
- Example pending submissions

Acceptance criteria:

- Can run seed locally.
- Does not use HowLongToBeat data.
- Uses original placeholder data or publicly safe sample entries.

---

# Phase 9 — Quality Pass

## Task 9.1 — Add Validation

Add validation using Zod or equivalent.

Acceptance criteria:

- API input is validated.
- UI forms validate user input.
- Domain still enforces important invariants.

---

## Task 9.2 — Add Error Handling

Acceptance criteria:

- Not found errors are clean.
- Validation errors are clean.
- Unexpected errors are not leaked directly to client.

---

## Task 9.3 — Refactor for Consistency

Acceptance criteria:

- No direct DB calls from controllers.
- No business logic in UI.
- Use cases are named clearly.
- Repository methods are explicit.
- TypeScript strict errors are fixed.

---

## 15. Suggested Agent Instructions

When giving this project to an LLM coding agent, use this instruction block:

```txt
You are implementing a HowLongToBeat-inspired playtime tracker.

Do not copy HowLongToBeat data, branding, UI, or wording.

Use a single repository with two folders:
- client/
- server/

client/:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Talks to server through HTTP API
- Does not access MongoDB
- Does not contain domain/business logic

server/:
- Node.js
- TypeScript
- Express or Fastify
- MongoDB
- Lightweight DDD
- Domain/application/infrastructure/presentation separation

Rules:
- Client must call server API.
- Server owns all business logic.
- Server owns all MongoDB access.
- Controllers/routes must call use cases only.
- Business logic belongs in domain/application layers.
- MongoDB code belongs in infrastructure.
- React components must not directly access MongoDB.
- Use TypeScript strict mode.
- Avoid over-engineering.
- Avoid generic helper/manager classes.
- Keep MVP small and working.
- Build incrementally.

Start with:
1. Root repo setup
2. client/ Next.js app
3. server/ Node.js API
4. Mongo connection
5. Domain models
6. Repositories
7. Use cases
8. API routes
9. Client API layer
10. UI pages
11. Seed data
12. Validation and quality pass
```

---

## 16. Risks

## Risk 1 — Over-engineering

DDD can become too heavy for a small app.

Mitigation:

- Keep domain models simple.
- Do not create abstractions before they are needed.
- Prefer clear use cases over complex frameworks.

---

## Risk 2 — Free LLM Losing Architecture

Free models may start clean, then gradually collapse logic into controllers or components.

Mitigation:

- Repeat architecture rules in every major prompt.
- Ask for one phase at a time.
- Review diffs after every step.
- Keep task scope small.

---

## Risk 3 — Legal/Data Issues

Scraping HLTB-like data could be risky.

Mitigation:

- Do not scrape.
- Use manual submissions.
- Use original seed data.
- Use permitted public APIs only.

---

## Risk 4 — Bad Playtime Statistics

Naive averages can be misleading.

Mitigation:

- Calculate median.
- Track submission count.
- Show confidence.
- Exclude pending/rejected submissions.
- Consider outlier detection later.

---

## 17. Future Features

Possible v2/v3 features:

- Steam library import
- IGDB import
- RAWG import
- Personal completion analytics
- Similar games
- Recommendation engine
- Public user profiles
- Completion calendar
- Backlog difficulty estimator
- Time-to-clear backlog estimator
- Yearly gaming summary
- Game collections
- DLC support
- Edition/version support
- Platform-specific estimates
- Difficulty-specific estimates
- Review/rating system
- Moderator reputation system
- User submission reliability score

---

## 18. Good MVP Definition

A successful MVP is not a full HLTB replacement.

A successful MVP is:

- Users can browse games.
- Users can submit playtime.
- Admin can approve/reject submissions.
- Public game pages show estimated playtimes.
- Users can track their backlog.
- The codebase remains understandable and extensible.

Keep the first version small.
