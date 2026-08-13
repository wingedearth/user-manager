# User Manager

A Next.js application for managing users, backed by [united-api](https://github.com/wingedearth/united-api)'s GraphQL API (which in turn talks to `users-service`). Provides authentication and comprehensive user CRUD, including role management.

## Features

- **Authentication**: Email/password login against united-api; session persisted in `localStorage`
- **User Management**: Create, read, update, and delete users via united-api
- **Role Management**: Promote/demote users between `user` and `admin` roles
- **Modern UI**: Clean, responsive design with custom CSS styling
- **Type Safety**: Full TypeScript implementation with strict typing
- **Code Quality**: ESLint, Commitlint, and Husky for code standards
- **Automated Releases**: Standard-version for changelog and versioning

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Backend**: GraphQL API via [united-api](https://github.com/wingedearth/united-api) (plain `fetch`-based client, no GraphQL client library)
- **Styling**: Custom CSS with modern design patterns
- **Testing**: Vitest, Testing Library
- **Code Quality**: ESLint, Commitlint, Husky
- **Version Management**: Standard-version
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm
- A reachable united-api instance (local or deployed) with a valid `users-service` backing it

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wingedearth/user-manager.git
cd user-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server against a united-api instance:
```bash
npm run dev:local   # united-api running locally at http://localhost:4000/graphql
npm run dev:remote  # deployed united-api instance
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser and log in with credentials that exist in the target `users-service`

### Environment Variables

The app talks to united-api via `NEXT_PUBLIC_UNITED_API_URL`. This is set automatically by the `dev:local`/`dev:remote` and `build:local`/`build:remote` scripts below. See `.env.example` if you need to run `next dev`/`next build` directly instead.

## Available Scripts

### Development
- `npm run dev` - Start development server (`NEXT_PUBLIC_UNITED_API_URL` must already be set)
- `npm run dev:local` - Start development server pointed at a local united-api (`http://localhost:4000/graphql`)
- `npm run dev:remote` - Start development server pointed at the deployed united-api instance
- `npm run build` / `build:local` / `build:remote` - Build for production, same URL variants as above
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing
- `npm run test` - Run the test suite once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with the Vitest UI
- `npm run test:coverage` - Run tests with coverage report

### Release Management
- `npm run release` - Automatic version bump and changelog
- `npm run release:patch` - Force patch version (1.0.0 → 1.0.1)
- `npm run release:minor` - Force minor version (1.0.0 → 1.1.0)
- `npm run release:major` - Force major version (1.0.0 → 2.0.0)

## Project Structure

```
user-manager/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main user management page (auth-gated)
├── components/            # Shared React components
│   └── LoginForm.tsx      # Email/password login form
├── lib/                   # Client-side data layer
│   ├── graphqlClient.ts   # Thin fetch-based GraphQL client
│   ├── session.ts         # localStorage-backed token/user persistence
│   └── api/               # GraphQL calls against united-api
│       ├── auth.ts        # login
│       └── users.ts       # getUsers, createUser, updateUser, deleteUser, promoteUser, demoteUser
├── types/                 # TypeScript type definitions
│   └── user.ts           # User, Role, and input types matching united-api's schema
├── __tests__/             # Vitest + Testing Library tests, mirrors source layout
├── .env.example           # Documents NEXT_PUBLIC_UNITED_API_URL
├── .husky/               # Git hooks
├── .versionrc.json       # Standard-version configuration
├── commitlint.config.js  # Commit message linting
├── next.config.js        # Next.js configuration
├── vitest.config.ts      # Vitest configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## User Interface

The application provides a comprehensive user management interface with:

- **Login Screen**: Email/password sign-in, shown when no session is stored
- **User Table**: Display all users fetched from united-api
- **Add User Form**: Create new users with validation
- **Edit User Form**: Update existing user information; changing role triggers promote/demote
- **Delete Confirmation**: Safe user deletion with confirmation
- **Logout**: Clears the stored session and returns to the login screen

## Development Workflow

### Commit Standards

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Code Quality

- **Pre-commit**: Runs linting before commits
- **Commit-msg**: Validates commit message format
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/new-feature`
3. Make your changes following the coding standards
4. Commit using conventional commits: `git commit -m "feat: add new feature"`
5. Push to your branch: `git push origin feat/new-feature`
6. Create a Pull Request

## License

This project is licensed under UNLICENSED - see the package.json file for details.

## Author

Andrew A. Anissi
