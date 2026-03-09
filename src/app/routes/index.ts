import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { OrderRoutes } from '../modules/order/order.route'; 
import { ProductRoutes } from '../modules/product/product.route';
const router = Router();


router.get('/test', (req, res) => {
  res.send('Seoul Mirage API is ok! 🚀');
});

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/orders', 
    route: OrderRoutes,
  },
  { path: '/products', route: ProductRoutes }, 
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;