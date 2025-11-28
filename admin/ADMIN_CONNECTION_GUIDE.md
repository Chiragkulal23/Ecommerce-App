# Admin Panel Connection Guide

## Overview
The `/admin` folder contains a separate React application that runs on port 3000 and connects to the backend server on port 4000.

## Setup Instructions

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Start the Admin Panel
```bash
npm run dev
```
Admin panel runs on `http://localhost:3000`

### 3. Backend Server Must Be Running
Make sure the backend server is running on port 4000:
```bash
cd server
npm run dev
```

## Connection Architecture

```
Admin Panel (Port 3000) 
    ↓
Proxy: /api → http://127.0.0.1:4000/api
    ↓
Backend Server (Port 4000)
    ↓
MongoDB Database
```

## Features Connected

### ✅ Products Management
- **View Products**: Fetches from `GET /api/products`
- **Add Product**: `POST /api/products`
- **Edit Product**: `PUT /api/products/:id`
- **Delete Product**: `DELETE /api/products/:id`
- **Category**: Uses string values (Sarees, Kurtis, etc.) not IDs

### ✅ Orders Management
- **View Orders**: Fetches from `GET /api/orders`
- **Update Order Status**: `PUT /api/orders/:id` with `{ status }`
- **Update Payment Status**: `PUT /api/orders/:id/payment-status`
- **Real-time Notifications**: Socket.IO connection for instant order updates

### ✅ Real-time Notifications
- Socket.IO connection established on login
- Receives `payment:notification` events when customers place orders
- Auto-refreshes orders list when new orders arrive
- Visual notification banner appears for new orders

## API Endpoints Used

### Products
- `GET /api/products` - Get all products (requires admin token)
- `POST /api/products` - Create product (requires admin token)
- `PUT /api/products/:id` - Update product (requires admin token)
- `DELETE /api/products/:id` - Delete product (requires admin token)

### Orders
- `GET /api/orders` - Get all orders (requires admin token)
- `GET /api/orders/:id` - Get single order (requires admin token)
- `PUT /api/orders/:id` - Update order status (requires admin token)
- `PUT /api/orders/:id/payment-status` - Update payment status (requires admin token)

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/profile` - Get admin profile

## Data Flow

### When Admin Adds Product:
1. Admin fills form in `/admin` panel
2. POST request to `/api/products`
3. Product saved to MongoDB
4. User website fetches products from same database
5. Product appears immediately on user website

### When Customer Places Order:
1. Customer completes payment on user website
2. Order created via `/api/payments/manual-order` or `/api/payments/verify-payment`
3. Backend saves order to `CustomerOrder` collection
4. Socket.IO emits `payment:notification` event
5. Admin panel receives notification instantly
6. Orders list auto-refreshes
7. Admin can view and update order status

## Key Files

### API Service
- `admin/src/services/api.js` - All API calls to backend
- `admin/src/services/socket.js` - Socket.IO connection

### Pages
- `admin/src/pages/Products.jsx` - Product management
- `admin/src/pages/Orders.jsx` - Order management with real-time updates
- `admin/src/pages/Dashboard.jsx` - Dashboard with stats and notifications

### Authentication
- `admin/src/contexts/AuthContext.jsx` - Handles login and Socket.IO connection

## Troubleshooting

### Products not loading?
- Check backend server is running on port 4000
- Verify admin is logged in (token in localStorage)
- Check browser console for API errors
- Verify API endpoint: `GET /api/products`

### Orders not appearing?
- Check Socket.IO connection (should connect on login)
- Verify orders API endpoint: `GET /api/orders`
- Check backend logs for order creation
- Try manual refresh button

### Socket.IO not connecting?
- Verify admin token exists in localStorage
- Check backend Socket.IO server is running
- Verify CORS settings in backend
- Check browser console for connection errors

### Real-time notifications not working?
- Ensure Socket.IO connection is established (check on login)
- Verify backend emits `payment:notification` events
- Check browser console for Socket.IO errors
- Orders page will still refresh manually if Socket.IO fails

## Testing the Connection

1. **Start Backend**: `cd server && npm run dev`
2. **Start Admin Panel**: `cd admin && npm run dev`
3. **Login**: Navigate to `http://localhost:3000/login`
4. **Add Product**: Go to Products page and add a test product
5. **Check User Website**: Verify product appears on `http://localhost:8080`
6. **Place Test Order**: Complete checkout on user website
7. **Check Admin Panel**: Order should appear in Orders page with notification

## Notes

- Admin panel uses category as **string** (not ID)
- Products API expects JSON (not FormData) for now
- Socket.IO connects automatically on login
- Orders auto-refresh when new orders arrive
- All API calls require admin authentication token

