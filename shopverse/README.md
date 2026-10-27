# ShopVerse

Responsive e-commerce storefront built with React, Vite and custom CSS. This starter includes category filtering, product search, wishlist toggles, a client-side cart with quantity controls, and a demo checkout. The Express/MongoDB backend currently has a health endpoint and database connection starter.

## Frontend
```powershell
npm install
npm run dev
```
Open http://localhost:5173.

## Backend
Open another terminal:
```powershell
cd server
npm install
Copy-Item .env.example .env
```
Edit `server/.env`, choose a unique JWT secret of at least 32 characters, and run:
```powershell
npm run dev
```
Health check: http://localhost:5000/api/health

## Status
This is a learning starter, not production-ready. Authentication, database-backed product APIs, persistent orders, admin tools, automated tests and real payment integration remain to be implemented. Checkout is a demo and never processes payment. Never commit `.env` files or secrets.
