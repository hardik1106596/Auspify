# ShopVerse 🛍️

A modern, responsive e-commerce platform built with **React, Vite, Node.js, Express, and MongoDB**.

### Features
- Customer storefront with product search and category filters
- Wishlist and shopping cart
- Customer registration, sign-in, profile management, and order history
- Admin dashboard to add, edit, and delete products
- MongoDB integration for product management

### Run Locally
```powershell
npm install
npm run dev
```

Set up the backend environment before starting the API:
```powershell
cd server
npm install
copy .env.example .env
npm run dev
```

Edit `server/.env` and set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters. The API defaults to port 5000 and allows the Vite app at `http://localhost:5173`. To use another API URL in the frontend, set `VITE_API_URL` in the ShopVerse root `.env` file and restart Vite.

The storefront loads its catalog from MongoDB. To populate it with the sample products, run `node src/seedProducts.js` from the `server` directory.

### Application Links
- **Storefront:** http://localhost:5173
- **Admin Dashboard:** http://localhost:5173/admin
- **Sign in:** http://localhost:5173/login
- **Create account:** http://localhost:5173/register
- **Profile and orders:** available after signing in at `/profile` and `/orders`
- **API Health:** http://localhost:5000/api/health

*Note: Development links work locally. Admin authentication and real payment processing are not yet implemented.*

**ShopVerse — Discover Your Everyday Finds.**
