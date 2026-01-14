# Contributing to Rosports

Thank you for your interest in contributing to Rosports!

## Getting Started

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/your-username/rosports.git`
3. Install dependencies: `npm install`
4. Set up environment variables: Copy `.env.example` to `.env.local` and add your API keys.

## Development Workflow

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes.
3. Ensure code quality:
   - Run linter: `npm run lint`
   - Run formatter: `npm run format`
   - Run tests: `npm test`
4. Commit your changes. We use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add new feature`
   - `fix: fix a bug`
   - `docs: update documentation`
   - `style: formatting changes`
   - `refactor: code refactoring`
   - `test: add tests`
   - `chore: maintenance tasks`

## Pull Requests

1. Push your branch: `git push origin feature/my-feature`
2. Open a Pull Request against the `main` branch.
3. Ensure CI checks pass.

## Code Style

- We use ESLint and Prettier.
- Please follow the existing code style.
