# Contributing to ByteBrush Links

Thank you for considering contributing to ByteBrush Links! This document outlines the process for contributing to the project and how to report issues.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for ByteBrush Links. Following these guidelines helps maintainers understand your report and reproduce the issue.

Before creating bug reports, please check [existing issues](https://github.com/bytebrush/bblinks/issues) as you might find out that the issue has already been reported or resolved.

**When you are creating a bug report, please include as many details as possible:**

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps to reproduce the problem** with as much detail as possible.
* **Provide specific examples** to demonstrate the steps.
* **Describe the behavior you observed after following the steps** and why you consider it to be a problem.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots** that show you following the described steps and clearly demonstrate the problem.
* **Include your environment information**: What version of Node.js, Bun, and browser are you using?

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for ByteBrush Links, including completely new features and minor improvements to existing functionality.

**When you are creating an enhancement suggestion, please include as many details as possible:**

* **Use a clear and descriptive title** for the issue.
* **Provide a step-by-step description of the suggested enhancement** with as much detail as possible.
* **Provide specific examples to demonstrate the steps** or point to similar features in other applications.
* **Describe the current behavior and explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most ByteBrush Links users.

### Pull Requests

* Fill in the required template
* Follow the style guidelines
* Document new code based on the project's documentation style
* Include tests for your changes
* Link to any related issues
* Update any relevant documentation

When submitting a pull request, please ensure:

1. You've followed the coding standards mentioned above
2. You've updated documentation where necessary
3. You've added tests if you're adding functionality
4. Your changes don't break existing functionality
5. Your branch is up to date with the main repository

## Project Structure

The project follows the Next.js App Router structure. For a detailed breakdown of the directories and files, please see [STRUCTURE.md](STRUCTURE.md). This will help you understand where to place your contributions.

## Development Workflow

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/bblinks.git`
3. Create a new branch for your feature: `git checkout -b feature/amazing-feature`
4. Install dependencies: `bun install`
5. Configure your environment: Copy `.env.example` to `.env` and fill in the required values
6. Set up your database: `bun setup` (or run the Prisma commands individually)
7. Make your changes and add tests if applicable
8. Run tests and ensure all pass
9. Update documentation as needed
10. Commit your changes: `git commit -m 'Add amazing feature'`
11. Push to the branch: `git push origin feature/amazing-feature`
12. Open a pull request

### Coding Standards

* Follow the existing code style in the project
* Write meaningful commit messages
* Keep your changes focused on a single task
* Add unit tests for new functionality where applicable
* Document your code with JSDoc comments
* Ensure your code passes linting checks: `bun lint`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Make your changes
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request

## Style Guidelines

### Code Style

* Use Prettier and ESLint as configured in the project
* Follow the existing code style
* Write clear, readable code with descriptive variable names

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

## License

By contributing to ByteBrush Links, you agree that your contributions will be licensed under the project's [AGPL-3.0 License](LICENSE).
