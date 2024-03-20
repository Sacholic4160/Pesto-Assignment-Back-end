# Pesto-Assignment-Back-end-
This is an assignment assigned by pesto platform for a backend engineering test

#E-Commerce Backend Engineering Challenge
This project is a solution to the E-Commerce Backend Engineering Challenge. It is a microservices-based system that manages a simple e-commerce application, including user authentication, product management, and order processing. The system is designed to handle concurrent access and ensure high availability through clustering.

#Architecture
The system is structured as three microservices, each with its own set of APIs and data models:

User Microservice: Provides endpoints for user registration and authentication.
Product Microservice: Provides endpoints for product management, including concurrency control using optimistic locking.
Order Microservice: Provides endpoints for order processing, including authorization using user ID.
The server.js file acts as a router, directing incoming requests to the appropriate microservice. This allows for better separation of concerns, easier scaling, and more robust error handling.

#Getting Started
To get started with this project, follow these steps:


Install the necessary dependencies by running npm install in the root directory.
Create a .env file in the root directory and add the following line, replacing <your_mongodb_connection_string> with your actual MongoDB connection string:
bash
Edit
Full Screen
Copy code
DB_CONNECTION_STRING=<your_mongodb_connection_string>
Start the application by running npm start in the root directory.
Use a tool like Postman or curl to test the API endpoints.
API Endpoints
User Microservice
POST /api/users/register
Registers a new user with the given username and password.

POST /api/users/login
Authenticates a user with the given username and password.

Product Microservice
GET /api/products
Retrieves all products.

PUT /api/products/:id
Updates a product with the given ID and version. If the product has been modified by another user, an error is

