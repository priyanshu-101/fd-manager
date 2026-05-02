# Vaultwise — FD & Insurance Manager

A production-grade React + Vite + Tailwind web application to manage Fixed Deposits and Insurance policies with maturity alerts.

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool & dev server
- **TypeScript** — Type safety
- **Tailwind CSS v3** — Utility-first styling
- **Zustand** — Lightweight state management (persisted to localStorage)
- **React Router v6** — Client-side routing
- **Recharts** — Portfolio pie chart
- **date-fns** — Date utilities
- **lucide-react** — Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable base components (Button, Input, Modal, Badge, etc.)
│   ├── layout/       # Sidebar, Layout wrapper
│   ├── fd/           # FD-specific components (FDCard, FDForm)
│   ├── insurance/    # Insurance components (InsuranceCard, InsuranceForm)
│   └── dashboard/    # Dashboard widgets (AlertsBanner, PortfolioChart, UpcomingList)
├── hooks/
│   └── useAlerts.ts  # Computed maturity alerts hook
├── pages/
│   ├── DashboardPage.tsx
│   ├── FDPage.tsx
│   └── InsurancePage.tsx
├── store/
│   └── index.ts      # Zustand store with localStorage persistence
├── types/
│   └── index.ts      # TypeScript interfaces
└── utils/
    └── index.ts      # Date helpers, formatters, calculators
```

## Features

- ✅ Add / Edit / Delete Fixed Deposits with full details
- ✅ Add / Edit / Delete Insurance Policies
- ✅ Auto-calculated maturity amounts (compound interest)
- ✅ Maturity alerts: 🔴 Critical (≤30 days) · 🟡 Warning (≤90 days) · 🟢 Active
- ✅ Premium due date alerts
- ✅ Portfolio overview with pie chart
- ✅ Upcoming maturities sorted by date
- ✅ Data persisted in localStorage (no backend needed)
- ✅ Fully responsive dark-themed UI
