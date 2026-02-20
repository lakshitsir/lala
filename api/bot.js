import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';

// APNI KEYS YAHAN DIRECT PASTE KARO (Quotes "" ke andar)
const bot = new Telegraf("8062934304:AAGkF1nkuDWX_dGDEqkm85dmd050EGRQPXU");
const genAI = new GoogleGenerativeAI("");

// /ai command ka logic
bot.command('ai', async (ctx) => {
    const prompt = ctx.message.text.split(' ').slice(1).join(' ');

    if (!prompt) {
        return ctx.reply('Bhai, koi sawal toh likho! Jaise: /ai who is Jhonny sins\n\ndev @lakshitpatidar');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const finalMessage = `${responseText}\n\ndev @lakshitpatidar`;
        
        await ctx.reply(finalMessage);
    } catch (error) {
        console.error(error);
        await ctx.reply('Error aagaya bhai, thodi der baad try karna.\n\ndev @lakshitpatidar');
    }
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await bot.handleUpdate(req.body);
            res.status(200).json({ status: 'success' });
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(200).send('bot ekdum mast chal raha hai! ✅');
    }
          }
              
