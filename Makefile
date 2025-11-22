.PHONY: all install dev build test test-run test-coverage typecheck lint preview clean help

# Default target - sets up everything and starts dev server
all: install dev

# Install dependencies
install:
	@echo " Installing dependencies..."
	pnpm install

# Start development server
dev:
	@echo " Starting development server..."
	pnpm dev

# Build for production
build:
	@echo "Building for production..."
	pnpm build

# Run tests in watch mode
test:
	@echo "Running tests in watch mode..."
	pnpm test

# Run tests once
test-run:
	@echo "Running tests..."
	pnpm test:run

# Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	pnpm test:coverage

# Type check
typecheck:
	@echo "Running type check..."
	pnpm typecheck

# Lint
lint:
	@echo "Running linter..."
	pnpm lint

# Preview production build
preview:
	@echo "Previewing production build..."
	pnpm preview

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist node_modules/.tmp

# Show help
help:
	@echo "GitHub Explorer - Available commands:"
	@echo ""
	@echo "  make          - Install dependencies and start dev server"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Start development server"
	@echo "  make build    - Build for production"
	@echo "  make test     - Run tests in watch mode"
	@echo "  make test-run - Run tests once"
	@echo "  make test-coverage - Run tests with coverage report"
	@echo "  make typecheck - Run TypeScript type checking"
	@echo "  make lint     - Run ESLint"
	@echo "  make preview  - Preview production build"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make help     - Show this help message"
