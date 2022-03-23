import express from 'express';
import dotenv from 'dotenv';
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

//routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

connectDB()

const app = express();
app.use(express.json());

app.use('/api/products',productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);

app.get('/api/config/paypal', (req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID)
})

app.use(notFound)

app.use(errorHandler)

const port = process.env.PORT || 5000
const node_env = process.env.NODE_ENV
app.listen(port,()=>{
    console.log(`Server is running ${node_env} in localhost ${port}`);
})