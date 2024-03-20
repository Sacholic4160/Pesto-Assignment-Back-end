import  express  from 'express';
import bodyParser from 'body-parser';
 import userRouter from "./microservices/user.microservice.js"
 import productRouter from "./microservices/product.microservice.js"
 import orderRouter from "./microservices/order.microservice.js"
 import mongoose from 'mongoose';



const app = express();

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));