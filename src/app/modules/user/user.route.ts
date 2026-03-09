import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/users', UserController.getAllUsers);

router.patch('/update-role/:id', UserController.updateUserRole);

router.get('/role', UserController.getRole);

router.patch('/change-password', UserController.changePassword);

router.patch('/update-profile', UserController.updateProfile);

export const UserRoutes = router;