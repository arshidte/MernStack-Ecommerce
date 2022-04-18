import path from "path";
import express from "express";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import Order from './models/orderModel.js'
import Razorpay from 'razorpay'
import shortid from "shortid"
import bodyparser from 'body-parser'

//routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import twilioRoutes from "./routes/twilioRoutes.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/mobileotp", twilioRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

//Razorpay

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const getOrder = async (id) => {
  const data = Order.findById(id).populate('user', 'name email')
  return data
}

app.post('/razorpay/:id', async (req,res)=>{
  const order = await Order.findById(req.params.id).populate('user', 'name email')
  const payment_capture = 1
  const currency = 'INR'
  const options = {
    amount: order.totalPrice * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  }

  try {
    const response = await razorpay.orders.create(options)
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    })
  } catch (err) {
    console.log(err)
  }
})

app.post('/razorpay/success/:id', async (req, res) => {
  const order = await getOrder(req.params.id)
  order.isPaid = true
  order.paidAt = Date.now()
  await order.save()
  res.status(200).json('success')
})

////////////
app.use(bodyparser.urlencoded({ extended: true }))

app.use(notFound);

app.use(errorHandler);

const port = process.env.PORT || 5000;
const node_env = process.env.NODE_ENV;
app.listen(port, () => {
  console.log(`Server is running ${node_env} in localhost ${port}`);
});
