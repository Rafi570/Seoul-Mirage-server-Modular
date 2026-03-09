import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    userEmail: { type: String, required: true },
    items: { type: [], required: true }, 
    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postCode: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Unpaid',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);