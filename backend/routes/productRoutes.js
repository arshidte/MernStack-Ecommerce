import express from "express";
const router = express.Router();
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProducts,
  getProductsById,
  getTopProducts,
  updateProduct,
} from "../controllers/productControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);

router.route("/:id/reviews").post(protect, createProductReview);

router.get("/top", getTopProducts);

router
  .route("/:id")
  .get(getProductsById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
