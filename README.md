# User Manager

A modern Next.js application for managing user data with a clean, responsive interface and comprehensive CRUD operations.

## Features

- **User Management**: Create, read, update, and delete users
- **Status Control**: Toggle user status between active and inactive
- **Role Management**: Assign roles (Admin, Manager, User) to users
- **Modern UI**: Clean, responsive design with custom CSS styling
- **Type Safety**: Full TypeScript implementation with strict typing
- **Code Quality**: ESLint, Commitlint, and Husky for code standards
- **Automated Releases**: Standard-version for changelog and versioning

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Custom CSS with modern design patterns
- **Code Quality**: ESLint, Commitlint, Husky
- **Version Management**: Standard-version
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

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

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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
│   └── page.tsx           # Main user management page
├── data/                  # Data layer
│   └── defaultUsers.ts    # Default user data
├── types/                 # TypeScript type definitions
│   └── user.ts           # User interface and enums
├── .husky/               # Git hooks
├── .versionrc.json       # Standard-version configuration
├── commitlint.config.js  # Commit message linting
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## User Interface

The application provides a comprehensive user management interface with:

- **User Table**: Display all users with their details
- **Add User Form**: Create new users with validation
- **Edit User Form**: Update existing user information
- **Status Toggle**: Switch between active/inactive status
- **Delete Confirmation**: Safe user deletion with confirmation

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
