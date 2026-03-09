import { Request, Response } from 'express';
import { Product } from './product.model';

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page, limit, q } = req.query;

    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } }
        ]
      };
    }

    const pageNum = parseInt(page as string) || 0;
    const limitNum = parseInt(limit as string) || 0;

    if (pageNum > 0 && limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      const totalProducts = await Product.countDocuments(query);
      const products = await Product.find(query).skip(skip).limit(limitNum);
      const totalPages = Math.ceil(totalProducts / limitNum);

      res.status(200).json({
        success: true,
        page: pageNum,
        totalPages,
        totalProducts,
        count: products.length,
        data: products,
      });
    } else {
      const products = await Product.find(query);
      res.status(200).json(products);
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID format" });
  }
};

// ৩. নতুন প্রোডাক্ট তৈরি (Single or Bulk)
const createProduct = async (req: Request, res: Response) => {
  try {
    let result;
    if (Array.isArray(req.body)) {
      // এটি একটি অ্যারে রিটার্ন করবে
      result = await Product.insertMany(req.body);
    } else {
      // এটি একটি সিঙ্গেল অবজেক্ট রিটার্ন করবে
      result = await Product.create(req.body);
    }

    // রেসপন্স মেসেজ ডাইনামিক করার জন্য চেক
    const isBulk = Array.isArray(result);
    const message = isBulk 
      ? `${(result as any[]).length} products added successfully! ✅` 
      : "Product added successfully! ✅";

    res.status(201).json({
      success: true,
      message,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// ৪. প্রোডাক্ট আপডেট করা
const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ৫. প্রোডাক্ট ডিলিট করা
const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const ProductController = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};