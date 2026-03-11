# Sustainably Yours

A full-stack web platform for discovering, rating, and sharing eco-friendly products and sustainable businesses. Connect with environmentally conscious brands and help others make sustainable choices.

## 🌍 Project Overview

Sustainably Yours is a community-driven platform that bridges the gap between consumers seeking sustainable products and eco-conscious businesses. Users can:

- **Discover** eco-friendly products and sustainable businesses
- **Rate and Review** products and businesses based on sustainability aspects
- **Filter and Search** to find products that match their sustainability values
- **Manage** businesses and products (for sellers)
- **Share Experiences** through detailed ratings and reviews

## ✨ Features

### User Management
- JWT-based authentication with secure password hashing
- Role-based access control (Buyers & Sellers)
- User profile management

### Products
- CRUD operations for eco-friendly products
- Advanced filtering and sorting capabilities
- Product image uploads
- Search functionality
- Product ratings and reviews

### Businesses
- Business profile management
- Multiple products per business
- Business logos and information
- Business ratings and reviews
- Category-based filtering

### Ratings System
- Detailed ratings for both products and businesses
- Rate based on multiple sustainability aspects
- User reviews and feedback
- Rating aggregation and statistics

### File Management
- Image uploads for products and businesses
- Secure file storage and serving
- Optimized image handling

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication token
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React** 18+ - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client
- **React Hook Form** - Form state management
- **ESLint** - Code linting

## 📁 Project Structure

```
sustainably-yours/
├── Backend/                    # Express.js API server
│   ├── config/                # Database configuration
│   ├── middleware/            # Auth, file upload middleware
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API route handlers
│   ├── utils/                 # Utility functions
│   ├── package.json
│   ├── server.js              # Main server file
│   └── README.md              # Backend documentation
│
└── Frontend/                   # React + TypeScript application
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Page components
    │   ├── context/           # React context (Auth)
    │   ├── hooks/             # Custom React hooks
    │   ├── lib/               # Utilities and services
    │   ├── types/             # TypeScript type definitions
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/                # Static assets
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **MongoDB** (local installation or MongoDB Atlas)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` file with your settings:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/sustainably-yours
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Create uploads directory:**
   ```bash
   mkdir uploads
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   The application will be available at `http://localhost:5173`

### Running Both Simultaneously

Open two terminal windows/tabs:
- Terminal 1: `cd Backend && npm run dev`
- Terminal 2: `cd Frontend && npm run dev`

## 📚 API Documentation

The backend API provides RESTful endpoints for all features. For detailed API documentation, see [Backend README](./Backend/README.md#api-endpoints).

### Quick API Overview

**Base URL:** `http://localhost:5000/api`

**Main Endpoints:**
- `/auth` - User authentication (register, login)
- `/products` - Products CRUD and filtering
- `/businesses` - Business CRUD and management
- `/ratings` - Rating and review operations
- `/users` - User profile management

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns a JWT token
3. Client stores token in localStorage
4. Token is included in Authorization header for protected routes
5. Token expires after configured time (default: 7 days)

Token should be sent as:
```
Authorization: Bearer <token>
```

## 💾 Database Schema

### User Model
- Email (unique)
- Password (hashed)
- Full Name
- Role (buyer/seller)
- Profile information

### Product Model
- Name
- Description
- Category
- Price
- Image
- Business reference
- Created by user

### Business Model
- Name
- Description
- Category
- Logo/Image
- Contact information
- Owner reference

### Rating Model
- Content/Review text
- Rating score
- Sustainability aspects
- Product/Business reference
- User reference
- Timestamps

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm start      # Production mode
npm run dev    # Development mode with auto-reload
npm run setup  # Database setup
npm test       # Run tests
```

**Frontend:**
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

The frontend includes ESLint configuration. Run linting with:
```bash
npm run lint
```

## 🚢 Building for Production

### Backend
```bash
cd Backend
NODE_ENV=production npm start
```

### Frontend
```bash
cd Frontend
npm run build
```

The built files will be in `Frontend/dist/` directory.

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - Token expiration time
- `FRONTEND_URL` - Frontend application URL (for CORS)

### Frontend (.env)
- Configure API base URL if different from `http://localhost:5000`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running locally or check your connection string
- Verify the `MONGODB_URI` in your `.env` file

### Frontend can't connect to backend
- Ensure the backend server is running on port 5000
- Check that `FRONTEND_URL` is correctly set in backend `.env`
- Verify CORS is enabled in the backend

### Port already in use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Module not found errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Happy coding! 🌱**
