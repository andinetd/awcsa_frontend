<h1 align="center">
  🏛️ AWCSA — Addis Women, Children & Social Affairs Management System
</h1>

<p align="center">
  A modern, full-featured government management platform for Women, Children, and Social Affairs services.
  <br />
  Built with <strong>Next.js 15</strong>, <strong>React 19</strong>, and <strong>TypeScript</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.4.1-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20AM-green" alt="Internationalization" />
  <img src="https://img.shields.io/badge/License-Private-red" alt="License" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Modules](#-modules)
- [Role-Based Access Control](#-role-based-access-control)
- [Internationalization](#-internationalization)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [CI/CD](#-cicd)

---

## 🌐 Overview

**AWCSA** (Addis Women, Children & Social Affairs) is a comprehensive government digital platform designed to manage and streamline the operations of the Women, Children, and Social Affairs Bureau. The system serves multiple stakeholder types — government employees, applicants, and care center facilities — through a unified, role-aware web interface.

The platform covers everything from **adoption case management** and **child welfare tracking** to **social rehabilitation**, **women's affairs**, **edir management**, and **citizen complaint handling** — all accessible in both **English** and **Amharic**.

---

## ✨ Features

- 🔐 **JWT-based Authentication** with automatic token expiration handling
- 🛡️ **Role-Based Access Control (RBAC)** enforced at the middleware level
- 🌍 **Bilingual Support** — English (`en`) and Amharic (`am`) via `next-intl`
- 📊 **Interactive Dashboards** with analytics and charts (Recharts)
- 📋 **Data Tables** with sorting, filtering, and pagination (TanStack Table)
- 📝 **Form Validation** using React Hook Form + Zod schemas
- 🖼️ **PDF Viewer** for document review
- 📂 **File Upload** with drag-and-drop support (React Dropzone)
- 🔔 **Toast Notifications** (Sonner)
- 🌙 **Dark/Light Mode** support (next-themes)
- 🤖 **Google reCAPTCHA v3** integration for public forms
- 📅 **Date Picker** (React Day Picker)
- 🎠 **Image & Testimonial Carousels** on the public landing page
- ⚙️ **CMS-driven Landing Page** manageable from the super admin panel
- 💾 **System Backups** and **Audit Logs** (super admin)
- 📱 **Responsive Design** for all screen sizes

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (New York style) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Server State** | [TanStack Query v5](https://tanstack.com/query/latest) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Tables** | [TanStack Table v8](https://tanstack.com/table/latest) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Internationalization** | [next-intl](https://next-intl-docs.vercel.app/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Carousel** | [Embla Carousel](https://www.embla-carousel.com/) |
| **Auth** | JWT via cookies (`jwt-decode`, `js-cookie`) |
| **PDF Viewing** | [@pdf-viewer/react](https://www.npmjs.com/package/@pdf-viewer/react) |
| **File Upload** | [React Dropzone](https://react-dropzone.js.org/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Process Manager** | [PM2](https://pm2.keymetrics.io/) |

---

## 📁 Project Structure

```
awcsa-frontend/
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml   # CI/CD auto-deploy pipeline
├── messages/                     # i18n translation files
│   ├── en.json                   # English translations
│   └── am.json                   # Amharic translations
├── public/                       # Static assets
├── src/
│   ├── app/
│   │   └── [locale]/             # Locale-aware routing
│   │       ├── (defaults)/       # Public-facing pages (login, register, etc.)
│   │       ├── (modules)/        # Protected application modules
│   │       ├── layout.tsx        # Root layout with providers
│   │       ├── page.tsx          # Public landing page
│   │       └── globals.css       # Global styles
│   ├── api/                      # Raw API request functions
│   ├── components/               # Reusable React components
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── custom/               # Custom application components
│   │   ├── dashboard/            # Dashboard-specific components
│   │   └── shared/               # Shared layout components
│   ├── hooks/                    # Custom React hooks (per domain)
│   ├── i18n/                     # next-intl routing configuration
│   ├── layout/                   # Page layout components (Navbar, Footer, etc.)
│   ├── lib/                      # Shared utilities (cn, etc.)
│   ├── schemas/                  # Zod validation schemas
│   ├── services/                 # API service layer
│   ├── stores/                   # Zustand global state stores
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions & configurations
│       ├── routePermissions.ts   # RBAC route guard config
│       ├── sidebar-config.ts     # Per-role sidebar navigation
│       ├── sidebar-helpers.ts    # Sidebar utility functions
│       └── app-route.ts          # App route constants
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

---

## 🧩 Modules

The application is organized into role-specific modules, each accessible under `/[locale]/(modules)/`:

### 👶 Children Affairs / Adoption
Manages the full lifecycle of child adoption and welfare:
- **Dashboard** — overview statistics and recent activity
- **Children Registry** — register, view, and manage child profiles
- **Care Centers** — manage registered care center facilities
- **Adoption Requests** — track and process adoption applications
- **Home Visits** — schedule and record home visit assessments
- **Adera & Assisted Homes** *(in development)*

### 🤝 Social Affairs
Handles social welfare programs:
- **Edir Management** — register and manage community Edir associations
- **Elderly & Disabled Persons** — track beneficiaries, support services, training sessions, and job placements
- **Social Dashboard** — summary analytics for social programs

### 👩 Women's Affairs
Dedicated module for women's empowerment services:
- **Women's Dashboard** — KPIs and program overviews
- **Women List** — registry of registered women beneficiaries
- **Support Services** — manage services provided to women
- **Women Associations** *(in development)*

### 🏛️ Bureau Head
Cross-departmental oversight portal:
- Unified dashboard with cross-module views (Adoption, Social Affairs, Women, Complaints)
- Sub-city management and reporting

### 🛠️ Super Admin
Full system administration:
- **Dashboard** — system-wide health and usage metrics
- **User Management** — create, update, deactivate users and assign roles
- **Audit Logs** — full activity trail across all system events
- **Backups** — trigger and manage system data backups
- **General Settings** — configure system-wide parameters
- **Landing Page CMS** — manage hero banners, gallery, services, partners, testimonials

### 🏠 Care Centers Portal
For registered child care facility operators:
- Child management within the care center
- Monthly reporting
- Document submissions

### 👤 Applicant Portal
Self-service portal for citizens:
- Submit adoption applications
- Track application status
- Submit and track complaints

---

## 🔐 Role-Based Access Control

Access to all protected routes is enforced server-side via **Next.js middleware** using JWT claims. The system supports three account types:

| Account Type | Description |
|---|---|
| `EMPLOYEE` | Government staff assigned to a department |
| `CLIENT` | Citizens accessing the applicant portal |
| `CHILD_CARE_FACILITY` | Registered care center operators |

Employee accounts are further restricted by **department role**:

| Department Role | Access Scope |
|---|---|
| `SYSTEM` | Full access (Super Admin, Bureau Head, all modules) |
| `CHILDREN_AFFAIRS` | Adoption module, Care Centers Portal |
| `SOCIAL_AFFAIRS` | Social Affairs module (Edir, Elderly & Disabled) |
| `WOMEN_AFFAIRS` | Women's Affairs module |
| `EDIR` | Social Affairs — Edir section |

> Unauthorized access attempts are redirected to a dedicated `/unauthorized` page. Expired or missing tokens are redirected to `/login` with the token cookie cleared.

---

## 🌍 Internationalization

The application supports **English** and **Amharic** out of the box using [`next-intl`](https://next-intl-docs.vercel.app/).

- All routes are prefixed with the locale: `/en/...` or `/am/...`
- Default locale is **English** (`en`)
- Translation files are located in `messages/en.json` and `messages/am.json`
- Language switching is available from the navigation bar

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **npm**, **pnpm**, or **yarn**
- Access to the backend API server

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd awcsa-frontend

# Install dependencies
npm install
# or
pnpm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at **[http://localhost:3001](http://localhost:3001)**.

> ⚠️ The dev server runs on port **3001** (not the default 3000) to avoid conflicts with the backend API.

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root and configure the following:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://your-api-server.com/api

# Google reCAPTCHA v3 site key (for public forms)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

---

## 📜 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Build the production bundle |
| `npm run start` | Start production server on port 3001 |
| `npm run lint` | Run ESLint checks |

---

## 🚢 Deployment

The application is designed to be deployed on a **Linux server** managed with **PM2**.

```bash
# Build the application
npm run build

# Start with PM2
pm2 start npm --name awcsa-frontend -- start
pm2 save

# Or restart an existing instance
pm2 restart awcsa-frontend
```

---

## ⚙️ CI/CD

Automated deployments are configured via **GitHub Actions** (`.github/workflows/deploy-frontend.yml`).

**Trigger:** Any push to the `dev` branch automatically:
1. Pulls the latest code to the production server via SSH
2. Installs dependencies (`npm install`)
3. Builds the production bundle (`npm run build`)
4. Restarts the PM2 process

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `HOST` | IP address or hostname of the deployment server |
| `USERNAME` | SSH login username |
| `SSHKEY` | Private SSH key for authentication |

---

## 📄 License

This project is proprietary software developed for the **Addis Ababa Women, Children, and Social Affairs Bureau**. All rights reserved. Unauthorized distribution or reproduction is prohibited.
