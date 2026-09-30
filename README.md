# TRANST — Full-Stack E-Commerce Platform

A production-ready, full-stack botanical e-commerce application built with **Django REST Framework** (Backend) and **React + Redux Toolkit** (Frontend). Designed with a clean architectural foundation, robust JWT authentication, server-authoritative cart and ordering mechanisms, atomic transaction guarantees, and a cohesive botanical visual identity.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture & Structure](#project-architecture--structure)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
  - [Backend Setup (Django + DRF)](#backend-setup-django--drf)
  - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
  - [Database Configuration (PostgreSQL / SQLite)](#database-configuration-postgresql--sqlite)
- [REST API Reference](#rest-api-reference)
  - [Authentication & Users](#authentication--users)
  - [Products](#products)
  - [Shopping Cart](#shopping-cart)
  - [Orders & Checkout](#orders--checkout)
- [State Management (Redux Toolkit)](#state-management-redux-toolkit)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Deployment Preparation](#deployment-preparation)
  - [Frontend (Vercel)](#frontend-vercel)
  - [Backend (Render / Railway / WSGI)](#backend-render--railway--wsgi)
- [Brand Identity & Design System](#brand-identity--design-system)
- [Author & Assignment Specification](#author--assignment-specification)

---

## Overview

**Transt** is an organic, botanical lifestyle e-commerce store. The platform provides an end-to-end customer journey—from catalog discovery, multi-faceted filtering, and dynamic cart operations to secure checkout, atomic stock decrementation, and immutable order history receipts.

---

## Key Features

1. **Authentication & Authorization:**
   - Stateless JWT authentication (`access` & `refresh` tokens via `rest_framework_simplejwt`).
   - Secure token storage, Axios request interceptors, and automatic token refresh handling.
   - Protected client routes (`/checkout`, `/orders`, `/orders/:id`).

2. **Catalog & Discovery:**
   - 45 realistic botanical skincare and lifestyle items across 7 distinct categories.
   - Instant search by title/description, category filtering, and client/server-side sorting.
   - High-fidelity product details with image galleries, stock counters, and specifications.

3. **Server-Authoritative Cart:**
   - Database-persisted user shopping carts.
   - Real-time stock validation (prevents over-ordering and race conditions).
   - Quantity increments, decrements, item deletion, and cart clearing.
   - Duplicate addition handling (merges quantities automatically).

4. **Atomic Checkout & Orders:**
   - Atomic database transactions (`transaction.atomic()`) for order placement.
   - Automatic inventory deduction upon successful placement.
   - Historical price snapshot freezing: line items retain purchase price (`product_price`) regardless of future catalog price changes.
   - Strict cross-tenant data isolation: users cannot view or manipulate orders belonging to other accounts.

5. **Botanical Design System:**
   - Warm earthy aesthetic: Botanical Green (`#2f604b`), Warm Cream (`#f5f2eb`), Parcel Beige (`#e2c6a2`), Forest Dark (`#1a372b`).
   - Fully responsive across desktop (1440px+), tablet (768px-1024px), and mobile viewports (360px-480px).

---

## Tech Stack

### Frontend
- **Framework:** React 18 (Vite build tool)
- **Routing:** React Router v6
- **State Architecture:** Redux Toolkit (`createSlice`, `createAsyncThunk`) + React-Redux
- **Styling:** Tailwind CSS + Custom Botanical Design System
- **Icons:** Lucide React
- **HTTP Client:** Axios (with centralized request/response interceptors)

### Backend
- **Framework:** Python 3.11+ / Django 5.2
- **API Engine:** Django REST Framework (DRF)
- **Authentication:** `djangorestframework-simplejwt`
- **Database:** PostgreSQL (production ready) / SQLite (development default)
- **CORS Handling:** `django-cors-headers`
- **Static Assets:** WhiteNoise + Gunicorn

---

## Project Architecture & Structure

```
C:\Assignment\ecomm\
├── backend/
│   ├── config/               # Project settings, WSGI/ASGI, base URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── wsgi.py
│   ├── users/                # Authentication, User profiles, JWT
│   ├── products/             # Catalog models, serializers, seed command
│   ├── cart/                 # Cart, CartItems models and views
│   ├── orders/               # Orders, OrderItems, atomic checkout
│   ├── staticfiles/          # Collected static assets for WhiteNoise
│   ├── manage.py
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile              # Gunicorn web worker definition
│   ├── build.sh              # Deployment build script
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── assets/brand/     # Transt logos and visual assets
│   ├── src/
│   │   ├── components/common/# Reusable UI (Navbar, Footer, ProductCard, etc.)
│   │   ├── layouts/          # MainLayout, AuthLayout
│   │   ├── pages/            # Home, Products, Detail, Cart, Checkout, Orders, Auth
│   │   ├── services/         # Axios API clients (auth, products, cart, orders)
│   │   ├── store/            # Redux Toolkit store & slices
│   │   │   ├── index.js
│   │   │   └── slices/       # authSlice, productsSlice, cartSlice, ordersSlice
│   │   ├── utils/            # Constants, route definitions
│   │   ├── App.jsx
│   │   ├── index.css         # Tailwind & custom botanical theme
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json           # SPA redirect rules for Vercel
│   ├── .env.example
│   └── .env
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env`)
```ini
# Django Core Settings
SECRET_KEY=your-secure-random-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com,.railway.app,.vercel.app

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174

# Database Choice
USE_SQLITE=True

# Or PostgreSQL (Hosted / Production)
# DATABASE_URL=postgres://user:password@hostname:5432/dbname
```

### Frontend (`frontend/.env`)
```ini
# Base URL pointing to the Django REST API
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Transt
```

---

## Local Development Setup

### Backend Setup (Django + DRF)

1. Open a terminal in `backend/`:
   ```bash
   cd C:\Assignment\ecomm\backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
6. Seed the 45 curated botanical products:
   ```bash
   python manage.py seed_products
   ```
7. Start the development server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```

### Frontend Setup (React + Vite)

1. Open a new terminal in `frontend/`:
   ```bash
   cd C:\Assignment\ecomm\frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173` (or port indicated in terminal).

---

## REST API Reference

All API routes are prefixed with `/api`.

### Authentication & Users
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register new user account | No |
| `POST` | `/api/auth/login/` | Authenticate user & issue JWT | No |
| `GET` | `/api/auth/me/` | Retrieve current authenticated user | Yes (Bearer Token) |
| `POST` | `/api/auth/token/refresh/` | Refresh expired access token | No |

### Products
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products/` | List products (supports `?category=` and `?search=`) | No |
| `GET` | `/api/products/<id>/` | Retrieve product details by ID | No |

### Shopping Cart
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/cart/` | Retrieve current user's cart | Yes |
| `POST` | `/api/cart/` | Add product to cart (or merge quantity) | Yes |
| `PATCH` | `/api/cart/<item_id>/` | Update cart item quantity | Yes |
| `DELETE` | `/api/cart/<item_id>/` | Remove item from cart | Yes |
| `DELETE` | `/api/cart/` | Clear all items from cart | Yes |

### Orders & Checkout
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/orders/` | List user's order history | Yes |
| `POST` | `/api/orders/` | Atomically create order from cart | Yes |
| `GET` | `/api/orders/<id>/` | Retrieve detailed order receipt | Yes |

---

## State Management (Redux Toolkit)

The frontend uses a modular Redux Toolkit architecture located at `frontend/src/store/`:

- `authSlice.js`: Tracks authenticated user, JWT access/refresh tokens, login/register thunks, and localStorage sync.
- `productsSlice.js`: Caches product catalog, detail queries, category filters, and search state.
- `cartSlice.js`: Manages cart line items, total count, total price, and optimistic badge updates.
- `ordersSlice.js`: Handles order history listing, single order detail retrieval, checkout processing, and state reset.

---

## Testing & Quality Assurance

### Automated Backend Tests
Run the Django test suite:
```bash
python manage.py test
```
*Result: 6/6 tests passing (100% success).*

### End-to-End Acceptance Suite
Run the 27-step comprehensive acceptance and security test:
```bash
python test_e2e.py
```
*Covers: Registration, login, bad credentials, duplicate email handling, cart mutations, stock limit validation, atomic checkout, post-order cart clearance, price snapshot freezing, and cross-user data isolation.*

### Frontend Production Build Test
```bash
cd frontend
npm run build
```
*Result: 1,677 modules compiled with 0 errors.*

---

## Deployment Preparation

### Frontend (Vercel)
- `frontend/vercel.json` contains SPA rewrite rules to ensure client-side routes (`/products`, `/checkout`, `/orders/:id`) resolve to `/index.html`.
- Build Command: `npm run build`
- Output Directory: `dist`
- Set Environment Variable in Vercel Dashboard: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

### Backend (Render / Railway / WSGI)
- `backend/Procfile` configured for Gunicorn: `web: gunicorn config.wsgi:application`
- `backend/build.sh` automates dependency installation, WhiteNoise static collection, database migrations, and product seeding.
- Compatible with `DATABASE_URL` for managed PostgreSQL instances on Supabase, Neon, Render, or Railway.

---

## Brand Identity & Design System

The platform strictly uses the Transt botanical aesthetic:

| Token | Hex Value | Role |
|---|---|---|
| **Botanical Green** | `#2f604b` | Primary branding, buttons, active navigation |
| **Forest Dark** | `#1a372b` | Deep accents, footer background, primary headings |
| **Warm Cream** | `#f5f2eb` | Page background, card backgrounds |
| **Parcel Beige** | `#e2c6a2` | Borders, subtle highlights, badge accents |
| **Charcoal Body** | `#2d3748` | High-contrast readable typography |

---

## Author & Assignment Specification

- **Project:** Transt E-Commerce Platform
- **Assignment Phases:** Completed Phases 1 through 10 (Full Testing, Security Isolation, Optimization, Documentation, and Final Review).
