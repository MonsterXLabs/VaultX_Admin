<!-- README.md -->

![tw-banner](https://github.com/thirdweb-example/vite-starter/assets/57885104/cfe2164b-b50b-4d8e-aaaa-31331da2d647)


<h1 align="center">VaultX Admin</h1>

<!-- Dynamic badges -->
<p align="center">

  <!-- Stars -->
  <img alt="GitHub Repo stars"
       src="https://img.shields.io/github/stars/MonsterXLabs/VaultX_Admin?style=social">

  <!-- Forks -->
  <img alt="GitHub forks"
       src="https://img.shields.io/github/forks/MonsterXLabs/VaultX_Admin?style=social">

  <!-- Open Pull Requests -->
  <img alt="GitHub pull requests"
       src="https://img.shields.io/github/issues-pr/MonsterXLabs/VaultX_Admin?color=blue">

  <!-- Open Issues -->
  <img alt="GitHub issues"
       src="https://img.shields.io/github/issues/MonsterXLabs/VaultX_Admin?color=yellow">

</p>

---

## 🚀 Introduction
**VaultX Admin** is a modern, responsive admin dashboard for the VaultX ecosystem.  
Built with **Vite + React 18**, **TypeScript**, and **Tailwind CSS**, it delivers lightning‑fast development workflows and a clean component architecture.  
The repo also includes a Jest test harness and Prettier rules for consistent code quality.

---

## 📋 Requirements
| Tool | Minimum Version | Why Needed |
| ---- | --------------- | ---------- |
| **Node.js** | ≥ 18 | executes Vite dev server & build |
| **Yarn** | ≥ 1.22 | dependency management & scripts |
| **Vite** | 5.x (comes via deps) | next‑gen bundler for dev & prod |
| **TypeScript** | 5.x | strict typing for React components |
| **Tailwind CSS** | 3.x | utility‑first styling |
| **dotenv** | – | load env variables for API endpoints, etc. |

> **Environment vars:** Copy `.env.example` (if present) to `.env` and adjust API keys / endpoints as required.

---

## 🛠 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/MonsterXLabs/VaultX_Admin.git
cd VaultX_Admin
```
# 2. Install peer deps (inside your project)
```bash
yarn dev          # Visit http://localhost:5173/ by default
yarn build        # Outputs to dist/
yarn preview      # Serves dist/ on a local web server
yarn test         # Single run
yarn test:watch   # Watch mode

```

# 3. Configure your environment
Add your Coinbase OnRamp publishable key somewhere in your app (e.g., .env, Next.js public runtime config, etc.).


# 📁 Directory Structure
```bash
VaultX_Admin/
│
├── public/                 # Static assets
│
├── src/                    # Application source code
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable React components
│   ├── pages/              # Route‑level components
│   └── main.tsx            # App entry point
│
├── tests/                  # Jest test files
│
├── index.html              # HTML template for Vite
├── tailwind.config.js      # Tailwind theme & plugins
├── postcss.config.js       # PostCSS pipeline
├── vite.config.ts          # Vite configuration
├── jest.config.ts          # Jest + ts‑jest setup
├── tsconfig.json           # TypeScript project config
├── package.json            # Scripts & dependencies
└── README.md               # ← you are here

```

# 💡 Tips & Customisation
Theming: Extend colors, fonts, or enable dark mode in tailwind.config.js.

Path aliases: Modify vite.config.ts (e.g., @/ → src/) for cleaner imports.

Linting/Formatting: Use yarn lint and Prettier (.prettierrc) to keep code consistent.

CI/CD: Add a GitHub Action that runs yarn build && yarn test to keep PRs green.

Testing: Jest is pre‑configured with ts-jest; write tests in tests/ and run via yarn test.

# 🤝 Contributing
Fork the repository

Create a feature branch: git checkout -b my-new-feature

Commit your changes: git commit -m 'Add some feature'

Push to the branch: git push origin my-new-feature

Open a pull request 🚀

Please run yarn lint && yarn test before submitting PRs.


# 👨‍💻 Developed By
Made with ❤️ by MonsterXLabs
