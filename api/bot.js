import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';

// APNI KEYS YAHAN DIRECT PASTE KARO (Quotes "" ke andar)
const BOT_TOKEN = "8062934304:AAGkF1nkuDWX_dGDEqkm85dmd050EGRQPXU";
const GEMINI_API_KEY = "AIzaSyCrh0QDQ5XIqAdgjd1uEJFd9b2vAWTgs6s";

const bot = new Telegraf(BOT_TOKEN);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// /ai command ka logic
bot.command('ai', async (ctx) => {
    // '/ai ' ke baad wala message nikalne ke liye
    const prompt = ctx.message.text.split(' ').slice(1).join(' ');

    // Agar user ne sirf /ai bheja aur sawal nahi pucha
    if (!prompt) {
        return ctx.reply('Bhai, koi sawal toh likho! Jaise: /ai who is Jhonny sins\n\ndev @lakshitpatidar', {
            reply_to_message_id: ctx.message.message_id
        });
    }

    try {
        // Gemini 1.5 Flash (Fast and Free)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Tumhara custom format
        const finalMessage = `${responseText}\n\ndev @lakshitpatidar`;
        
        // Final message send karna, sath me user ke message ko quote (reply) karna
        await ctx.reply(finalMessage, {
            reply_to_message_id: ctx.message.message_id
        });

    } catch (error) {
        console.error(error);
        
        // SECURITY LAYER: API Key Hide karne ka logic
        let errorMessage = error.message || "Kuch technical dikkat aayi hai.";
        
        // Agar error string me tumhari manual key hui, toh usko mask kar denge
        if (GEMINI_API_KEY && GEMINI_API_KEY !== "YAHAN_APNA_GEMINI_API_KEY_DALO") {
            errorMessage = errorMessage.split(GEMINI_API_KEY).join("[HIDDEN_GEMINI_KEY]");
        }
        if (BOT_TOKEN && BOT_TOKEN !== "YAHAN_APNA_TELEGRAM_BOT_TOKEN_DALO") {
            errorMessage = errorMessage.split(BOT_TOKEN).join("[HIDDEN_BOT_TOKEN]");
        }

        // Safe error message user ko bhejna aur uske message ko quote karna
        const safeReply = `Error aagaya bhai:\n${errorMessage}\n\ndev @lakshitpatidar`;
        await ctx.reply(safeReply, {
            reply_to_message_id: ctx.message.message_id
        });
    }
});

// Vercel Serverless Function ka Webhook Handler
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
