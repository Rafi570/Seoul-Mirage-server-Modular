import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

// ১. ইউজার রেজিস্ট্রেশন
router.post('/register', UserController.register);

// ২. ইউজার লগইন
router.post('/login', UserController.login);

// ৩. সব ইউজার দেখা (সার্চ অপশন সহ)
router.get('/users', UserController.getAllUsers);

// ৪. ইউজারের রোল আপডেট করা (Admin/User)
router.patch('/update-role/:id', UserController.updateUserRole);

// ৫. ইমেইল দিয়ে রোল চেক করা
router.get('/role', UserController.getRole);

// ৬. পাসওয়ার্ড পরিবর্তন করা
router.patch('/change-password', UserController.changePassword);

// ৭. প্রোফাইল ইনফরমেশন আপডেট করা
router.patch('/update-profile', UserController.updateProfile);

export const UserRoutes = router;