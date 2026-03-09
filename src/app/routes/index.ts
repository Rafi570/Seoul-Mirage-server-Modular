import { Router } from 'express';

const router = Router();
router.get('/test', (req, res) => {
  res.send('Seoul Mirage API is working! 🚀');
});

export default router;