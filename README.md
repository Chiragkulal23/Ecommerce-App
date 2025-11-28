# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/df332e48-015f-4f74-a4df-84fd80ff39c4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/df332e48-015f-4f74-a4df-84fd80ff39c4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Tech Stack Overview

- Frontend (User site): Vite, React, TypeScript, Tailwind CSS, shadcn-ui, React Query, Lucide Icons
- Admin Panel (Standalone app): Vite, React (JSX), CSS, inline component styles
- Backend API: Node.js, Express, MongoDB (Mongoose), JWT, Socket.IO, Nodemailer, Razorpay integration

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/df332e48-015f-4f74-a4df-84fd80ff39c4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## StyleAura Boutique - E-commerce Platform

### Quick Start

#### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

#### 2. Environment Setup (server/.env)

Create a `.env` file under `server/.env` with:
```
# Core
MONGO_URI=your_mongodb_connection_string
PORT=4000
CLIENT_ORIGIN=http://localhost:8080,http://localhost:3000

# Auth
JWT_SECRET=your_jwt_secret_key

# Email (optional, for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM=StyleAura <your_email@example.com>

# Payments (optional if using Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### 3. Start the Application

**Terminal A – Backend API**
```bash
cd server
npm run dev
```
- API base: `http://localhost:4000`
- Health: `http://localhost:4000/api/health`

**Terminal B – User Frontend (Vite)**
```bash
npm run dev
```
- Default: `http://localhost:8080/` (auto-fallback to another port e.g. `8081` if busy)
- Proxies `/api` to `http://127.0.0.1:4000` (see `vite.config.ts`)

**Terminal C – Admin Panel (Standalone)**
```bash
cd admin
npm install
npm run dev
```
- Admin app: `http://localhost:3000/`
- Proxies `/api` to `http://127.0.0.1:4000` (see `admin/vite.config.js`)

#### 4. Access the Application

- **User Website**: http://localhost:8080
- **Admin Dashboard**: http://localhost:8080/admin/login
  - Default Admin Credentials:
    - Email: admin@styleaura.com
    - Password: Admin123!

### Features

✅ **Admin Panel (Standalone or Integrated)**
- Add/Edit/Delete products
- View all customer orders
- Update order delivery status
- Real-time order notifications
- Product inventory management

✅ **User Website**
- Browse products (synced with admin panel)
- Add products to cart
- Checkout with shipping details
- Payment via Razorpay or Manual UPI
- Order confirmation

✅ **Connection System**
- Admin and user share the same database
- Products added by admin appear instantly on user website
- Orders placed by users appear in admin dashboard
- Real-time updates via auto-refresh

### API Endpoints

**Products (Public)**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

**Products (Admin Only)**
- `POST /api/products` - Add product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Orders (Admin Only)**
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id` - Update order status

**Payments (Public)**
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment
- `POST /api/payments/manual-order` - Create manual UPI order

### Project Structure

```
styleaura-boutique/
├─ admin/              # Standalone Admin React app (Vite, port 3000)
│  ├─ src/
│  └─ vite.config.js   # Proxy to server 4000
├─ server/             # Backend API (Express, MongoDB)
│  ├─ src/
│  └─ .env             # Server environment variables
├─ src/                # User-facing site (Vite, port 8080/8081)
│  ├─ pages/
│  ├─ components/
│  ├─ services/api.ts  # Fetches from `/api`
│  └─ hooks/useProducts.ts
└─ vite.config.ts      # Proxy to server 4000
```

### Running Notes
- If `4000` is occupied, stop the existing process or set `PORT` in `server/.env` and update proxies.
- If `8080` is occupied, Vite will auto-pick a free port (e.g., `8081`). Use that in your browser.
- Admin app and user site can run independently; both talk to the same API.

### Troubleshooting

**Products not showing?**
- Check if backend server is running
- Verify MongoDB connection
- Check browser console for errors
- Ensure product has at least one image (`imageUrl` or `images[]`) and `isActive: true`
- User site auto-refetches products every 10s; focus the tab or wait briefly

**Orders not appearing?**
- Ensure admin is logged in
- Check orders API endpoint
- Verify order was created successfully

**Payment issues?**
- Verify Razorpay credentials in .env
- Check payment API endpoints
- Review server logs for errors

**Blank product detail page?**
- Ensure product `sizes`/`colors` arrays exist; app now falls back to defaults (Free Size / Default)
