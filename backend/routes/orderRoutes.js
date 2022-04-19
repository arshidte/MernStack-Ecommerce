import express from "express";
const router = express.Router();

import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered, getOrderReports, report } from "../controllers/orderControllers.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/report/orders').get(getOrderReports)
router.route('/salesreport').get(report)
router.route('/salesreport/:id').get(report)

export default router;
