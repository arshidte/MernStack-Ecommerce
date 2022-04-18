import express from "express";

const router = express.Router();

import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  mobileLogin,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userControllers.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router.post("/mobilelogin", mobileLogin);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
