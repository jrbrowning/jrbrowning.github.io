# GitHub Developer Insights Dashboard

A modern, interactive dashboard built with **React**, **Vite**, **TailwindCSS**, and **shadcn/ui**, for visualizing GitHub contribution over time.

**Live Site**: [jrbrowning.github.io](https://jrbrowning.github.io)

## Motivation

Designed to primarily be a fast local development site for prototyping and iterating, This tool is for developers who want to introspect (and maybe publish) on their GitHub history journey.

If you'd like to create your own version of your journey, head over to [`GitHubHero`](https://github.com/jrbrowning/GitHubHero) to generate a `github-static-transformed.json` data set using GitHub CLI and the GraphQL endpoint.

Then fork this repo, drop that file into the `\public` folder, edit any details to personalize for your liking, and follow the [Build and Preview your site](#build-and-preview-your-site) steps below.

## ✨ Features

- 🔀 **Sankey visualization**: Year-over-year language flow
- 📊 **Contribution summary**: Commits, PRs, issues, and reviews by year
- 🏷️ **Repo language breakdown**: Language composition per repo/year
- 🎛️ **Interactive filtering**: Select top N languages
- ⚛️ **Framework**: React 19 + Vite 7
- 🎨 **Styling**: TailwindCSS, shadcn/ui, Framer Motion, Lucide Icons
- 📈 **Charts**: Plotly.js, Recharts
- 🌓 Responsive, dark mode compatible design using `shadcn/ui`

## Scripts

Development mode:

```bash
# Start dev server
npm run start

# Clean and reinstall deps
npm run rebuild
```

## Git Commit Workflow

This project uses **Commitizen** for conventional commit messages. To launch the commit interface:

```bash
npm run commit
```

## Build and Preview your site.

Build a static version of the repo into the `/docs`

```bash
npm run gh-page-build
```

Preview the site using a light weight local server (reads content from the `/docs`, where vite reads from `/`)

```bash
npm run gh-page-preview
```

## Turn your data into your own github page

1. Go to your repo on GitHub.
2. Navigate to: Settings → Pages
3. Under Source, choose:
   • Branch: main
   • Folder: /docs
4. Click Save.

## Main Project Structure

```
├── docs/                   # Static site output for GitHub Pages
├── app/                    # Application source code (App.tsx, Charts)
├── components/             # Reusable React components from shadcn
├── lib/                    # Utility functions and libraries
├── .github/                # GitHub workflows and configuration
├── commitlint.config.js    # Commitlint configuration
├── package.json            # Project metadata and dependencies
├── tsconfig.json
└── vite.config.ts
```

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 7](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Plotly.js](https://plotly.com/javascript/)
- [Recharts](https://recharts.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Commitizen](https://commitizen-tools.github.io/commitizen/)
- [Husky](https://typicode.github.io/husky/)
- [gh-pages](https://www.npmjs.com/package/gh-pages)
- [ThemeProvider (custom)](https://ui.shadcn.com/docs/dark-mode)

## 🤖🧠 Credits

Built mostly by AI (Claude 3.7/4.0 Sonnet, OpenAI GPT-4o/4.1, MS VSCode CoPilot) with human direction and decision making.

Human director [Jeff Browning](https://github.com/jrbrowning) — who is powered by curiosity and coffee ☕.
