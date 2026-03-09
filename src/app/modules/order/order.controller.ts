import { Request, Response } from 'express';
import SSLCommerzPayment from 'sslcommerz-lts';
import { Order } from './order.model';
import config from '../../config';

const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderIds, totalAmount, shippingAddress } = req.body;
    const backend_url = config.backend_url;
    const tran_id = `REF-${Date.now()}`;

    const data = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: tran_id,
      success_url: `${backend_url}/api/v1/orders/payment/success/${tran_id}`,
      fail_url: `${backend_url}/api/v1/orders/payment/fail/${tran_id}`,
      cancel_url: `${backend_url}/api/v1/orders/payment/cancel/${tran_id}`,
      ipn_url: `${backend_url}/api/v1/orders/payment/ipn`,
      shipping_method: "Courier",
      product_name: "Seoul Mirage Products",
      product_category: "Skincare",
      product_profile: "general",
      cus_name: shippingAddress.name,
      cus_email: shippingAddress.email,
      cus_add1: shippingAddress.address,
      cus_city: shippingAddress.city,
      cus_country: "Bangladesh",
      cus_phone: shippingAddress.phone,
      ship_name: shippingAddress.name,
      ship_add1: shippingAddress.address,
      ship_city: shippingAddress.city,
      ship_state: shippingAddress.state,
      ship_postcode: shippingAddress.postCode,
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(config.ssl.store_id, config.ssl.store_pass, config.ssl.is_live);

    await Order.updateMany({ _id: { $in: orderIds } }, { $set: { transactionId: tran_id } });
    
    sslcz.init(data).then((apiResponse: any) => {
      res.send({ url: apiResponse.GatewayPageURL });
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const paymentSuccess = async (req: Request, res: Response) => {
  try {
    const { tranId } = req.params;
    await Order.updateMany({ transactionId: tranId }, { $set: { status: "Paid" } });
    res.redirect(`${config.frontend_url}/orders/success`);
  } catch (error) {
    res.redirect(`${config.frontend_url}/orders/fail`);
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = await Order.create({ ...req.body, status: "Unpaid" });
    res.status(201).json({ success: true, message: "Order placed!", orderId: newOrder._id });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getUnpaidOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email, status: "Unpaid" });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, { status: "Paid" }, { new: true });
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, { status: "Cancelled" }, { new: true });
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (role !== "admin") return res.status(403).json({ message: "Forbidden" });
    await Order.findByIdAndDelete(req.params.orderId);
    res.status(200).json({ success: true, message: "Deleted!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


const paymentFail = async (req: Request, res: Response) => {
  res.redirect(`${config.frontend_url}/orders/fail`);
};
const paymentCancel = async (req: Request, res: Response) => {
  res.redirect(`${config.frontend_url}/orders/cancel`);
};

export const OrderController = {
  initiatePayment, paymentSuccess, paymentFail, paymentCancel,
  createOrder, getAllOrders, getUserOrders, getUnpaidOrders,
  updatePaymentStatus, cancelOrder, deleteOrder
};