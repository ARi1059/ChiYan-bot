import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Bot } from './bot';
import authRoutes from './api/routes/auth';
import keywordRoutes from './api/routes/keywords';
import uploadRoutes from './api/routes/upload';

dotenv.config();

const app = express();
const bot = new Bot(process.env.BOT_TOKEN!);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  (req as any).bot = bot.getBot();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/upload', uploadRoutes);

bot.launch();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
