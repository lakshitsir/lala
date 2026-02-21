import { Telegraf } from 'telegraf';

// AB KOI AI API KEY NAHI CHAHIYE! 🎉
// SIRF APNA TELEGRAM BOT TOKEN YAHAN DALO
const BOT_TOKEN = "8062934304:AAGkF1nkuDWX_dGDEqkm85dmd050EGRQPXU"; 

const bot = new Telegraf(BOT_TOKEN);

bot.command('ai', async (ctx) => {
    const prompt = ctx.message.text.split(' ').slice(1).join(' ');

    if (!prompt) {
        return ctx.reply('Bhai, koi sawal toh likho!\n\ndev @lakshitpatidar', { reply_to_message_id: ctx.message.message_id });
    }

    try {
        // Free Keyless AI API (No Expiry, No 404 Error)
        const response = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`API response error: ${response.status}`);
        }

        const replyText = await response.text();
        
        // 🚀 Lamba Message Splitter (Bade essay/code break nahi honge)
        const MAX_LENGTH = 4000; 
        
        for (let i = 0; i < replyText.length; i += MAX_LENGTH) {
            let chunk = replyText.substring(i, i + MAX_LENGTH);
            if (i + MAX_LENGTH >= replyText.length) {
                chunk += `\n\ndev @lakshitpatidar`;
            }
            await ctx.reply(chunk, { reply_to_message_id: ctx.message.message_id });
        }

    } catch (error) {
        await ctx.reply(`Bhai technical error: ${error.message}\n\ndev @lakshitpatidar`, {
            reply_to_message_id: ctx.message.message_id
        });
    }
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await bot.handleUpdate(req.body);
            res.status(200).json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(200).send('Kanu ka Keyless AI Bot Makkhan chal raha hai! ✅');
    }
}
