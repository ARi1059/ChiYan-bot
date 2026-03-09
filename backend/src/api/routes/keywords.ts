import { Router } from 'express';
import { prisma } from '../../utils/db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const keywords = await prisma.keyword.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(keywords);
});

router.post('/', async (req, res) => {
  const keyword = await prisma.keyword.create({ data: req.body });
  res.json(keyword);
});

router.put('/:id', async (req, res) => {
  const keyword = await prisma.keyword.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(keyword);
});

router.delete('/:id', async (req, res) => {
  await prisma.keyword.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

export default router;
