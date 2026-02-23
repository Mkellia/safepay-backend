# SafePay Backend

Secure Node.js + Express backend for a blockchain escrow application.

## Tech Stack
- **Node.js + Express**
- **Sequelize ORM** with **PostgreSQL**
- **JWT** for authentication
- **Zod** for input validation
- **Bcryptjs** for password hashing
- **Helmet & CORS** for security
- **Morgan** for logging

## Folder Structure
```
safepay-backend/
├── src/
│   ├── config/      # Database configuration
│   ├── controllers/ # Request handlers
│   ├── middleware/  # Auth, validation, error handling
│   ├── models/      # Sequelize models and associations
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   └── app.js       # Express app setup
├── tests/           # Integrated tests
├── .env             # Environment variables
├── seed.js          # Database seeding script
└── src/server.js    # Entry point
```

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Database Configuration:**
   - Create a PostgreSQL database named `safepay`.
   - Update `DATABASE_URL` in `.env`.

3. **Seeding (Optional):**
   ```bash
   node seed.js
   ```
   *Creates: admin@safepay.com / adminpassword, buyer@example.com / password123, seller@example.com / password123.*

4. **Start the Server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login with email/phone

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `DELETE /api/users/me` - Deactivate account
- `GET /api/users/:id` (Admin) - Get user details
- `PUT /api/users/:id` (Admin) - Update user

### Orders (Escrow)
- `POST /api/orders` (Buyer) - Create a new order (generates OTP)
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - View order details
- `POST /api/orders/:id/pay` (Buyer) - Mark as paid
- `POST /api/orders/:id/confirm` (Buyer) - Confirm delivery via OTP
- `POST /api/orders/:id/release` - Release funds to seller (Buyer/Admin)
- `POST /api/orders/:id/cancel` - Cancel order (before payment)

### Disputes
- `POST /api/disputes` - Open a dispute
- `GET /api/disputes` - List disputes
- `POST /api/disputes/:id/resolve` (Admin) - Resolve dispute (Refund/Release)
