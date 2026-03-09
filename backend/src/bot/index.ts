import { Telegraf } from 'telegraf';
import { prisma } from '../utils/db';

export class Bot {
  private bot: Telegraf;

  constructor(token: string) {
    this.bot = new Telegraf(token);
    this.setupHandlers();
  }

  private setupHandlers() {
    this.bot.on('text', async (ctx) => {
      const chatId = ctx.chat.id.toString();
      const allowedChatId = process.env.ALLOWED_CHAT_ID;

      if (allowedChatId && chatId !== allowedChatId) {
        return;
      }

      const text = ctx.message.text;
      const keyword = await this.matchKeyword(text);

      if (keyword) {
        await this.sendReply(ctx, keyword);
      }
    });
  }

  private async matchKeyword(text: string) {
    const keywords = await prisma.keyword.findMany({
      where: { enabled: true }
    });

    for (const kw of keywords) {
      if (this.isMatch(text, kw.trigger, kw.matchType)) {
        return kw;
      }
    }
    return null;
  }

  private isMatch(text: string, trigger: string, matchType: string): boolean {
    if (matchType === 'exact') {
      return text === trigger;
    } else if (matchType === 'contains') {
      return text.includes(trigger);
    } else if (matchType === 'regex') {
      try {
        return new RegExp(trigger).test(text);
      } catch {
        return false;
      }
    }
    return false;
  }

  private async sendReply(ctx: any, keyword: any) {
    const options: any = {
      parse_mode: keyword.parseMode,
      disable_web_page_preview: keyword.disableWebPagePreview
    };

    if (keyword.buttons) {
      try {
        options.reply_markup = { inline_keyboard: JSON.parse(keyword.buttons) };
      } catch {}
    }

    if (keyword.replyImageFileId) {
      await ctx.replyWithPhoto(keyword.replyImageFileId, {
        caption: keyword.replyText,
        ...options
      });
    } else {
      await ctx.reply(keyword.replyText, options);
    }
  }

  launch() {
    this.bot.launch();
    console.log('Bot started');
  }

  getBot() {
    return this.bot;
  }
}
