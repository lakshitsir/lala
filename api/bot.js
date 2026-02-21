import { Telegraf } from 'telegraf';

// APNI ASLI KEYS YAHAN DALO
const BOT_TOKEN = "8062934304:AAGkF1nkuDWX_dGDEqkm85dmd050EGRQPXU"; 
const GEMINI_API_KEY = "AIzaSyCrh0QDQ5XIqAdgjd1uEJFd9b2vAWTgs6s";

const bot = new Telegraf(BOT_TOKEN);

bot.command('ai', async (ctx) => {
    const prompt = ctx.message.text.split(' ').slice(1).join(' ');

    if (!prompt) {
        return ctx.reply('Bhai, koi sawal toh likho!\n\ndev @lakshitpatidar', { reply_to_message_id: ctx.message.message_id });
    }

    try {
        // YAHAN CHANGE KIYA HAI: gemini-1.5-flash ko gemini-pro kar diya
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`API Error Code: ${response.status} - Details: ${JSON.stringify(data.error)}`);
        }

        const replyText = data.candidates[0].content.parts[0].text;
        
        // 🚀 Lamba Message Splitter (Bade messages ab katenge nahi)
        const MAX_LENGTH = 4000; 
        
        for (let i = 0; i < replyText.length; i += MAX_LENGTH) {
            let chunk = replyText.substring(i, i + MAX_LENGTH);
            if (i + MAX_LENGTH >= replyText.length) {
                chunk += `\n\ndev @lakshitpatidar`;
            }
            await ctx.reply(chunk, { reply_to_message_id: ctx.message.message_id });
        }

    } catch (error) {
        let safeError = error.message || "Unknown Error";
        
        if (GEMINI_API_KEY && GEMINI_API_KEY !== "AIzaSyCrh0QDQ5XIqAdgjd1uEJFd9b2vAWTgs6s") {
            safeError = safeError.split(GEMINI_API_KEY).join("[HIDDEN_GEMINI_KEY]");
        }
        if (BOT_TOKEN && BOT_TOKEN !== "8062934304:AAGkF1nkuDWX_dGDEqkm85dmd050EGRQPXU") {
            safeError = safeError.split(BOT_TOKEN).join("[HIDDEN_BOT_TOKEN]");
        }

        await ctx.reply(`Asli Beemari:\n${safeError}\n\ndev @lakshitpatidar`, {
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
        res.status(200).send('Kanu ka Bot ab Gemini Pro pe chal raha hai! ✅');
    }
                }
