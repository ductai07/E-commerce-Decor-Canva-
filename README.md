<<<<<<< HEAD
test
=======
# DucTai-Decor Web Application

A full-stack web application for an online canvas art shop.

## Project Structure

- `/client` - React.js frontend
- `/server` - Express.js backend

## Setup & Installation

### Prerequisites

- Node.js (v14 or above)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure MongoDB is running on your local machine or update the .env file with your MongoDB connection string.

4. Start the server:
   ```bash
   npm run dev
   ```

   The server will run on port 5000 (or the port specified in your .env file).

### Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on port 5173 and automatically open in your default browser.

## Features

- User authentication (login/register)
- Browse products
- Product filtering and sorting
- Shopping cart functionality
- Responsive design for mobile and desktop
- Animations for improved user experience

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Bcrypt for password hashing

## API Endpoints

### User Authentication
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login
- `GET /api/user/current` - Get current user details
- `GET /api/user/logout` - Logout

### Products
- `GET /api/product` - Get all products
- `GET /api/product/:pid` - Get a specific product
- `POST /api/product` - Create a new product (admin)
- `PUT /api/product/:pid` - Update a product (admin)
- `DELETE /api/product/:pid` - Delete a product (admin)

## Admin Access

Admin routes are protected and require admin authentication. To access admin features, an account with admin role is needed. 
>>>>>>> f1f4ffd (haizz)
