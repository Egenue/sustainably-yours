# Sustainably Yours Backend API

Backend API for the Sustainably Yours platform - a platform for discovering and rating eco-friendly products and businesses.

## Features

- **User Authentication**: JWT-based authentication with buyer/seller roles
- **Products Management**: CRUD operations for eco-friendly products
- **Businesses Management**: CRUD operations for sustainable businesses
- **Rating System**: Rate products and businesses with detailed sustainability aspects
- **File Uploads**: Support for product images and business logos
- **Filtering & Sorting**: Advanced filtering and sorting for products and businesses

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Express Validator** for input validation

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the Backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sustainably-yours
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

4. Create the uploads directory:
```bash
mkdir uploads
```

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products

- `GET /api/products` - Get all products (with filtering and sorting)
  - Query params: `category`, `sortBy`, `search`, `page`, `limit`
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires auth, seller only)
- `PUT /api/products/:id` - Update product (requires auth, owner only)
- `DELETE /api/products/:id` - Delete product (requires auth, owner only)

### Businesses

- `GET /api/businesses` - Get all businesses
  - Query params: `category`, `search`, `page`, `limit`
- `GET /api/businesses/:id` - Get single business
- `POST /api/businesses` - Create business (requires auth, seller only)
- `PUT /api/businesses/:id` - Update business (requires auth, owner only)
- `DELETE /api/businesses/:id` - Delete business (requires auth, owner only)

### Ratings

- `POST /api/ratings` - Create a rating (requires auth)
- `GET /api/ratings/product/:productId` - Get ratings for a product
- `GET /api/ratings/business/:businessId` - Get ratings for a business
- `PUT /api/ratings/:id` - Update rating (requires auth, owner only)
- `DELETE /api/ratings/:id` - Delete rating (requires auth, owner only)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Example Requests

### Register a User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

### Create a Product (Seller)
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Organic Cotton T-Shirt",
  "brand": "EcoWear",
  "category": "Clothing",
  "description": "100% organic cotton",
  "price": 29.99,
  "sustainabilityScore": 92,
  "certifications": ["GOTS", "Fair Trade"]
}
```

### Create a Rating
```bash
POST /api/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-id-here",
  "rating": 5,
  "comment": "Great product!",
  "aspects": {
    "materials": 5,
    "packaging": 4,
    "carbonFootprint": 5,
    "laborPractices": 5
  }
}
```

## Database Models

### User
- name, email, password, role (buyer/seller)
- businessName, businessAddress (for sellers)

### Product
- name, brand, category, image, description
- sustainabilityScore, price, certifications
- averageRating, ratings[]

### Business
- name, description, logo, location, website
- sustainabilityScore, categories[]
- averageRating, ratings[]

### Rating
- userId, userName, rating, comment, date
- aspects: { materials, packaging, carbonFootprint, laborPractices }
- productId or businessId

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error responses include a `message` field with details.

## Development

The server runs on port 5000 by default. Make sure MongoDB is running before starting the server.

For development with auto-reload:
```bash
npm run dev
```

