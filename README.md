# ShopNest

**ShopNest** is a feature-rich e-commerce web application designed to provide users with a seamless online shopping experience. The project includes functionalities for browsing products, managing a cart, and an admin dashboard for managing the store.

## Features

- **User Functionality:**

  - Browse products with search and filter options
  - Add products to cart and manage cart items
  - Secure checkout process with payment integration

- **Admin Functionality:**

  - Admin dashboard to manage products, categories, and users
  - Order management
  - Real-time updates and notifications for critical actions

- **Additional Features:**
  - Secure user authentication with JWT
  - Email notifications using Nodemailer
  - Responsive design optimized for all devices

## Tech Stack

### Frontend:

- **HTML**
- **CSS**
- **JavaScript**
- **React.js**
- **Redux Toolkit**
- **TailwindCSS**
- **Axios**
- **Vite** (as the build tool)

### Backend:

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT** for Authentication
- **Bcrypt.js** for Password Hashing
- **Nodemailer** for Email Services

### Development Tools:

- **Postman** for API testing
- **Helmet** for enhanced security

## Installation

Follow these steps to run the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/thakurRUDRA14/ShopNest.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd ShopNest
   ```

3. **Install dependencies for both frontend and backend:**

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

4. **Set up environment variables:**

   - Create a `.env` file in the `backend` directory and include the necessary variables.
   - Use the provided `.env.sample` file as a reference for required environment variables:

     ```env
     PORT=4000
     MONGODB_URI="your_mongodb_connection_string"
     CORS_ORIGIN=*
     JWT_SECRET="your_jwt_secret"
     JWT_EXPIRE=5d
     COOKIE_EXPIRE=5
     SMPT_SERVICE=gmail
     SMPT_MAIL="your_email@example.com"
     SMPT_PASS="your_email_password"
     SMPT_HOST=smtp.gmail.com
     SMPT_PORT=587
     CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
     CLOUDINARY_API_KEY="your_cloudinary_api_key"
     CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
     ```

5. **Run the development servers:**

   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm run dev
   ```

6. Open your browser and visit `http://localhost:3000` to view the application.

## API Documentation

The backend includes a comprehensive REST API. Below are the major endpoints:

### User Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login for users
- `GET /api/products`: Fetch all products

### Admin Endpoints

- `POST /api/products`: Add a new product
- `PUT /api/products/:id`: Update product details
- `DELETE /api/products/:id`: Delete a product

### Order Endpoints

- `POST /api/orders`: Place a new order
- `GET /api/orders/:userId`: Get user-specific orders

For detailed API testing, use Postman with the provided endpoints.

## Screenshots

### Home Page

![Home Page](https://res.cloudinary.com/rudra-backend/image/upload/v1735234236/54afe9aa-73f1-46aa-bd05-68cde3b54c74.png)

### Admin Dashboard

![Admin Dashboard](https://res.cloudinary.com/rudra-backend/image/upload/v1735234178/8f37c608-567e-4091-91f8-3672ccaa3f04.png)

### Product Details

![Product Details](https://res.cloudinary.com/rudra-backend/image/upload/v1735234191/3bac6d03-9ed0-43f4-abdd-61c0a2e5a508.png)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add feature-name'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact

For queries or support, contact:

- **Name:** Rudra Pratap Singh
- **Email:** [anilrudra0484@gmail.com](mailto:anilrudra0484@gmail.com)
- **LinkedIn:** [Rudra Pratap Singh](https://www.linkedin.com/in/thakurrudra)
- **GitHub:** [thakurRUDRA14](https://github.com/thakurRUDRA14)

---

**Happy Coding!** 🎉
