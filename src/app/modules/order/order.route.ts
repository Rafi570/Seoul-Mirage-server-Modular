import express from 'express';
import { OrderController } from './order.controller';

const router = express.Router();
router.post('/payment/success/:tranId', OrderController.paymentSuccess);
router.post('/payment/fail/:tranId', OrderController.paymentFail);
router.post('/payment/cancel/:tranId', OrderController.paymentCancel);
router.get('/all', OrderController.getAllOrders);
router.post('/checkout', OrderController.createOrder);
router.get('/user/:email', OrderController.getUserOrders);
router.get('/unpaid/:email', OrderController.getUnpaidOrders);
router.post('/init-payment', OrderController.initiatePayment);
router.patch('/pay-success/:orderId', OrderController.updatePaymentStatus);
router.patch('/cancel/:orderId', OrderController.cancelOrder);
router.delete('/delete/:orderId', OrderController.deleteOrder);

export const OrderRoutes = router;