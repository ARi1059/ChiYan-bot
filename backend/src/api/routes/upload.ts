import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const bot = (req as any).bot;
    const result = await bot.telegram.sendPhoto(process.env.ADMIN_CHAT_ID!, {
      source: req.file.buffer
    });

    const fileId = result.photo[result.photo.length - 1].file_id;
    res.json({ fileId });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
