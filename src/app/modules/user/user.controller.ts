import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './user.model';
import config from '../../config';

// 1. REGISTER
const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ success: true, message: "User registered! ✅" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. LOGIN
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwt_secret as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. ALL USER GET with SEARCH
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. UPDATE USER ROLE (PATCH)
const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role type" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} ✅`,
      user: updatedUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. GET USER ROLE BY EMAIL
const getRole = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("email role");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      email: user.email,
      role: user.role,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 6. CHANGE PASSWORD (PATCH)
const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password does not match!" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully! 🔐" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 7. UPDATE PROFILE
const updateProfile = async (req: Request, res: Response) => {
  try {
    const { email, name, phone, address } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    if (address) {
      user.address = {
        apartment: address.apartment || user.address?.apartment,
        city: address.city || user.address?.city,
        state: address.state || user.address?.state,
        postalCode: address.postalCode || user.address?.postalCode,
        country: address.country || user.address?.country,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully! ✨",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const UserController = {
  register,
  login,
  getAllUsers,
  updateUserRole,
  getRole,
  changePassword,
  updateProfile,
};