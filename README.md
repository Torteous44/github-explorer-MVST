# GitHub Explorer

A React application for exploring GitHub user profiles and repositories. Search for any GitHub user to view their profile information and browse through their public repositories with filtering capabilities.

## Features

- **User Search**: Search for any GitHub user by username
- **Profile Display**: View user profile including avatar, bio, location, and stats
- **Repository List**: Browse all public repositories sorted by last update
- **Filtering**: Filter repositories by name or programming language
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful handling of API errors and rate limits

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI primitives
- **Vitest** - Testing framework

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/torteous44/github-explorer-MVST
cd github-explorer-MVST

# Install and start dev server
make
```

That's it! The app will be available at `http://localhost:5173`

### Manual Setup

If you prefer not to use Make:

```bash
pnpm install
pnpm dev
```

### Build

```bash
make build      # or: pnpm build
make preview    # or: pnpm preview
```

## Testing

The project uses Vitest with React Testing Library for testing.

```bash
make test           # Run tests in watch mode
make test-run       # Run tests once
make test-coverage  # Run tests with coverage report
```

Or using pnpm directly:

```bash
pnpm test
pnpm test:run
pnpm test:coverage
```

### Test Structure

```
src/
├── api/
│   └── github.test.ts      # API layer tests
├── hooks/
│   └── useGithubUserRepos.test.ts  # Hook tests
└── utils/
    └── githubFilters.test.ts       # Utility function tests
```

## Project Structure

```
src/
├── api/                    # API layer
│   └── github.ts           # GitHub API wrapper
├── components/             # React components
│   ├── ErrorMessage.tsx
│   ├── IndeterminateProgress.tsx
│   ├── LanguageDropdown.tsx
│   ├── RepoFilters.tsx
│   ├── RepoSection.tsx
│   ├── SearchSection.tsx
│   ├── UserProfile.tsx
│   ├── animate-ui/         # UI primitives (vendor)
│   └── ui/                 # Base UI components
├── hooks/                  # Custom React hooks
│   └── useGithubUserRepos.ts
├── lib/                    # Utility libraries
│   └── utils.ts
├── utils/                  # Helper functions
│   └── githubFilters.ts
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```

## Scripts

| Make Command | pnpm Command | Description |
|--------------|--------------|-------------|
| `make` | - | Install deps and start dev server |
| `make install` | `pnpm install` | Install dependencies |
| `make dev` | `pnpm dev` | Start development server |
| `make build` | `pnpm build` | Build for production |
| `make preview` | `pnpm preview` | Preview production build |
| `make test` | `pnpm test` | Run tests in watch mode |
| `make test-run` | `pnpm test:run` | Run tests once |
| `make test-coverage` | `pnpm test:coverage` | Run tests with coverage |
| `make typecheck` | `pnpm typecheck` | Run TypeScript type checking |
| `make lint` | `pnpm lint` | Run ESLint |
| `make clean` | - | Clean build artifacts |
| `make help` | - | Show available commands |

## API Rate Limits

This application uses the GitHub REST API without authentication, which has a rate limit of 60 requests per hour. For higher limits, you can add a GitHub personal access token.

## Future Improvements

- [ ] **Authentication**: Add GitHub OAuth for higher API rate limits
- [ ] **Caching**: Implement request caching with React Query or SWR
- [ ] **Pagination**: Add infinite scroll for users with many repositories
- [ ] **Repository Details**: Expand to show more repo info (contributors, issues, etc.)
- [ ] **Favorites**: Allow users to bookmark favorite profiles
- [ ] **Dark Mode**: Add theme toggle support
- [ ] **Storybook**: Add component documentation with Storybook
- [ ] **E2E Tests**: Add Playwright or Cypress for end-to-end testing
- [ ] **GraphQL API**: Migrate to GitHub GraphQL API (v4) for more efficient queries
