# RetailIQ – AI-Powered Retail Analytics & Demand Forecasting System

RetailIQ is an enterprise-grade SaaS web application engineered for modern multi-channel retail operations, inventory management, demand forecasting, customer analytics, and business intelligence.

---

## 🚀 Technology Stack

- **Framework**: React.js 18 (JavaScript, ES Modules)
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS & Tailwind Animate
- **Design System**: Shadcn UI architecture & design tokens
- **Data Visualizations**: Recharts
- **Routing**: React Router DOM v6
- **Forms & Validation**: React Hook Form with Zod schemas
- **Icons**: Lucide React
- **HTTP Client**: Axios with interceptors (ready for NestJS JWT auth)

---

## 📁 Project Architecture & Folder Structure

```
d:/RetailIQ/
├── Aimodel/                  # Legacy/future ML research & datasets
├── dist/                     # Optimized production bundle
├── public/
│   └── favicon.svg           # Branded vector icon
├── src/
│   ├── assets/               # Static assets & images
│   ├── components/
│   │   ├── common/           # Button, Card, Badge, Input, Select, Modal, Drawer, etc.
│   │   ├── dashboard/        # StatCard, KPI indicators
│   │   ├── layout/           # Sidebar, Navbar, PageHeader
│   │   └── tables/           # DataTable with sorting, pagination & empty states
│   ├── contexts/
│   │   └── AuthContext.jsx   # Authentication context & role switcher
│   ├── data/                 # Realistic mock datasets (products, orders, customers, etc.)
│   ├── layouts/
│   │   ├── AuthLayout.jsx    # Split-screen SaaS authentication layout
│   │   └── DashboardLayout.jsx # Collapsible responsive dashboard shell
│   ├── pages/
│   │   ├── auth/             # LoginPage, RegisterPage
│   │   ├── categories/       # CategoryListPage (CRUD, product count)
│   │   ├── churn/            # CustomerChurnPage (ML-ready classification UI)
│   │   ├── common/           # NotFoundPage (404)
│   │   ├── customers/        # CustomerListPage (CRUD, lifetime value, details drawer)
│   │   ├── dashboard/        # DashboardPage (4 Recharts, KPIs, low stock, audit)
│   │   ├── forecasting/      # DemandForecastingPage (ML-ready regression UI)
│   │   ├── inventory/        # InventoryPage (Stock-in/out, adjustments, audit log)
│   │   ├── orders/           # OrderListPage & CreateOrderPage (interactive cart builder)
│   │   ├── reports/          # ReportsPage (Sales, inventory, customer reports & CSV export)
│   │   ├── sales/            # SalesAnalyticsPage (Recharts trends, category share)
│   │   ├── settings/         # SettingsPage (Profile, security, notifications, display)
│   │   └── users/            # UserManagementPage (Admin-only RBAC, invites, status)
│   ├── services/
│   │   ├── api.js            # Axios client with baseURL & JWT bearer interceptors
│   │   ├── authService.js    # Auth service with persistent session & role presets
│   │   ├── productService.js # Product CRUD service
│   │   ├── orderService.js   # Order CRUD & fulfillment service
│   │   ├── customerService.js# Customer lifecycle service
│   │   └── ...               # Category, inventory, analytics, user, report services
│   ├── utils/
│   │   ├── cn.js             # Tailwind class merging utility
│   │   ├── formatters.js     # Currency, number, date & percentage formatting
│   │   └── csv.js            # Universal client-side CSV table export
│   ├── validations/
│   │   └── index.js          # Zod validation schemas for all forms
│   ├── App.jsx               # Centralized router & role protection
│   ├── index.css             # Design tokens & CSS variables
│   └── main.jsx              # React DOM entrypoint
├── .env                      # Environment variables (VITE_API_BASE_URL)
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔑 Demo Access & Role Presets

The login page contains 1-click preset buttons for immediate testing:

1. **Admin (Full Access)**
   - **Email**: `admin@retailiq.io`
   - **Password**: `password123`
   - **Privileges**: Full access including User Management & RBAC assignments.

2. **Store Manager**
   - **Email**: `manager@retailiq.io`
   - **Password**: `password123`
   - **Privileges**: Catalog management, Stock In/Out operations, Order creation.

3. **Sales Analyst**
   - **Email**: `analyst@retailiq.io`
   - **Password**: `password123`
   - **Privileges**: Dashboard analytics, Sales trends, Reports & CSV exports.

*Note: Roles can also be switched dynamically at runtime using the role pill at the bottom of the sidebar!*

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The application will start at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔌 Future Backend & ML Integration Guide

### NestJS Backend Integration
- `src/services/api.js` is already configured with `VITE_API_BASE_URL`.
- Simply replace mock service methods in `src/services/*Service.js` with direct `api.get()` / `api.post()` calls.
- JWT Bearer tokens are automatically captured and injected into every outbound request.

### Python FastAPI ML Integration
- **Demand Forecasting (`/forecasting`)**: Ready to receive payload `{ store_id, product_id, horizon_days }` and render regression predictions + confidence intervals.
- **Customer Churn (`/churn`)**: Ready to ingest classification probabilities and display high/medium/low attrition risk cohorts.
