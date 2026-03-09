import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: String, required: true },
    mainImage: { type: String, required: true },
    images: { type: [String], required: true },
    rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    description: { type: String },
    details: { type: String },
    stock: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Product = model<IProduct>('Product', productSchema);