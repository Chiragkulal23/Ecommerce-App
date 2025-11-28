# StyleAura Boutique - Admin-User Connection System

## Overview
This document explains how the admin panel and user website are connected, and how data flows between them.

## Architecture

### Data Flow
```
User Website (Frontend) ←→ Backend API (Node.js/Express) ←→ Admin Dashboard (Frontend)
                              ↓
                         MongoDB Database
```

## Key Components

### 1. Products Management

#### User Side (Public Access)
- **Route**: `GET /api/products`
- **Access**: Public (no authentication required)
- **Purpose**: Display all active products to customers
- **Response**: List of products with all details

#### Admin Side (Protected)
- **Route**: `GET /api/products` (with admin token)
- **Access**: Admin only
- **Purpose**: View all products in admin dashboard
- **CRUD Operations**:
  - **Create**: `POST /api/products` - Add new product
  - **Update**: `PUT /api/products/:id` - Edit existing product
  - **Delete**: `DELETE /api/products/:id` - Soft delete product (sets isActive: false)

#### Data Synchronization
- When admin adds/edits/deletes a product → Database is updated immediately
- User website fetches products from the same database
- Changes appear instantly on user website (no refresh needed if using React Query)

### 2. Orders Management

#### Order Creation (User Side)
- **Route**: `POST /api/payments/manual-order` (for UPI/Manual payment)
- **Route**: `POST /api/payments/verify-payment` (for Razorpay payment)
- **Access**: Public (customer checkout)
- **Purpose**: Create order when customer completes payment
- **Data Saved**:
  - User details (name, phone, email, address)
  - Items purchased (name, price, quantity, image)
  - Payment details (transaction ID, amount, status, method)
  - Order status (default: "Pending")

#### Order Viewing (Admin Side)
- **Route**: `GET /api/orders`
- **Access**: Admin only
- **Purpose**: View all customer orders
- **Features**:
  - See all orders with customer details
  - View payment status
  - Update delivery status (Pending → Shipped → Out for Delivery → Delivered)

#### Real-time Updates
- Admin dashboard auto-refreshes orders every 5 seconds when orders tab is active
- Payment notifications are sent via Socket.IO (when admin is connected)
- Manual refresh button available for immediate updates

### 3. Payment Flow

#### Step 1: Customer Checkout
1. Customer fills shipping details
2. Selects payment method (Razorpay or Manual UPI)
3. For Razorpay: Payment gateway opens
4. For Manual UPI: Customer scans QR and enters transaction ID

#### Step 2: Order Creation
- Order is created in `CustomerOrder` collection
- Payment status is set based on payment method:
  - Razorpay: "Success" (after verification)
  - Manual UPI: "Pending" (admin can verify later)

#### Step 3: Admin Notification
- Payment notification is sent via Socket.IO
- Admin dashboard receives real-time notification
- Order appears in admin orders list
- Admin can see:
  - Customer name, phone, email
  - Shipping address
  - Items purchased
  - Payment amount and transaction ID
  - Payment status

#### Step 4: Order Fulfillment
- Admin updates order status as it progresses:
  - Pending → Shipped → Out for Delivery → Delivered
- Customer can track order (if user profile feature is implemented)

## API Endpoints Summary

### Products
- `GET /api/products` - Get all products (PUBLIC)
- `GET /api/products/:id` - Get single product (PUBLIC)
- `POST /api/products` - Add product (ADMIN)
- `PUT /api/products/:id` - Update product (ADMIN)
- `DELETE /api/products/:id` - Delete product (ADMIN)

### Orders
- `GET /api/orders` - Get all orders (ADMIN)
- `GET /api/orders/:id` - Get single order (ADMIN)
- `PUT /api/orders/:id` - Update order status (ADMIN)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order (PUBLIC)
- `POST /api/payments/verify-payment` - Verify Razorpay payment (PUBLIC)
- `POST /api/payments/manual-order` - Create manual UPI order (PUBLIC)

## Database Models

### Product Model
```javascript
{
  name: String,
  price: Number,
  description: String,
  category: String,
  images: [String],
  sizes: [String],
  colors: [{name: String, value: String}],
  stock: Number,
  isActive: Boolean
}
```

### CustomerOrder Model
```javascript
{
  user: {
    name: String,
    phone: String,
    email: String,
    address: {
      houseNo: String,
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  payment: {
    transactionId: String,
    amount: Number,
    status: String, // "Pending", "Success", "Failed"
    method: String // "Razorpay", "UPI_Manual"
  },
  status: String // "Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"
}
```

## How to Run

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:4000`

### 2. Start Frontend
```bash
npm install
npm run dev
```
Frontend runs on `http://localhost:8080`

### 3. Access Admin Dashboard
1. Navigate to `http://localhost:8080/admin/login`
2. Login with admin credentials
3. Access dashboard at `http://localhost:8080/admin/dashboard`

### 4. Access User Website
1. Navigate to `http://localhost:8080`
2. Browse products (fetched from backend)
3. Add to cart and checkout
4. Complete payment
5. Order appears in admin dashboard

## Key Features

✅ **Real-time Product Sync**
- Admin adds product → Appears on user website immediately
- Admin edits product → Changes reflect on user website
- Admin deletes product → Removed from user website

✅ **Order Notifications**
- Customer places order → Admin receives notification
- Payment successful → Admin sees order with payment details
- Admin can update delivery status

✅ **Unified Data Source**
- Both admin and user sides use the same MongoDB database
- Single source of truth for all data
- Consistent data across both interfaces

## Troubleshooting

### Products not showing on user website
1. Check if products are marked as `isActive: true`
2. Verify backend server is running
3. Check browser console for API errors
4. Verify API endpoint: `GET /api/products`

### Orders not appearing in admin dashboard
1. Check if admin is logged in
2. Verify order was created successfully
3. Check orders API endpoint: `GET /api/orders`
4. Try manual refresh button

### Payment notifications not working
1. Check Socket.IO connection
2. Verify admin is authenticated
3. Check server logs for notification errors
4. Admin dashboard auto-refreshes every 5 seconds as fallback

## Security Notes

- Admin routes require JWT token authentication
- Public routes (product viewing, order creation) don't require authentication
- Payment verification uses cryptographic signatures (Razorpay)
- All sensitive operations are protected by admin middleware

