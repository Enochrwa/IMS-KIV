# Kivu IMS Frontend Container App

A modern, scalable Inventory Management System built with React, TypeScript, and Micro-Frontend architecture.

## Contributor Guide

Start with `AGENTS.md` for repository conventions, workflows, and local setup tips tailored to this project.

## 🚀 Features

### Core Features
- **Multi-Language Support** - English and Kinyarwanda with i18next
- **Dark/Light Theme** - Comprehensive theme system with auto-detection
- **Real-time Notifications** - In-app notifications with browser notifications
- **Role-based Access Control** - Super Admin, Store Admin, Manager, Employee roles
- **Multi-store Support** - Manage multiple stores from a single interface
- **Responsive Design** - Mobile-first design with Material-UI

### Advanced Features
- **Micro-Frontend Architecture** - Modular, scalable frontend architecture
- **Global Audit Log System** - Track all user actions and system events
- **Enhanced Error Handling** - Comprehensive error boundaries and user-friendly error pages
- **Environment Configuration** - Flexible configuration for different environments
- **User Profile Management** - Complete user profile and preferences management

### Technical Features
- **TypeScript** - Full type safety and better developer experience
- **React Router v7** - Modern routing with data loading
- **Material-UI v6** - Modern, accessible UI components
- **Redux Toolkit** - State management with RTK Query
- **Module Federation** - Dynamic micro-frontend loading
- **PWA Ready** - Progressive Web App capabilities

## Getting Started

### Using environment variables with .npmrc

Modify your .npmrc

```
@kivunova:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_FE_COMMON_TOKEN}
```

Load the token locally: Before running npm install, you'll need to load the token. 

One time command: ask for PAT TOKEN

```
export GH_FE_COMMON_TOKEN=YOUR_PAT_TOKEN
```

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

## Local development notes

- Copy `.env.local.example` to `.env.local` and update values if needed:

```bash
cp .env.local.example .env.local
```

- The project depends on a shared package `@kivunova/kivufrontendcommon` which is included as a local file dependency during development. If you cloned the common package to `../kivufrontendcommon`, npm install will pick it up automatically.

- To work on the common package locally, use one of these approaches:

  1. Local file dependency (already configured):
     - Clone `kivufrontendcommon` to the same parent directory as this repo (`../kivufrontendcommon`).
     - Run `npm install` from this project — it will use the local folder.

  2. npm link (alternative):
     - In the `kivufrontendcommon` folder run:
       ```bash
       npm install
       npm run build
       sudo npm link
       ```
     - In this repo run:
       ```bash
       npm link @kivunova/kivufrontendcommon
       ```
     - Note: global linking may require elevated permissions on macOS; the file: approach avoids permission prompts.

- If you publish changes to the common package to the GitHub Package Registry or npm, bump the version in the common package, then run `npm install` in this repo to update.
