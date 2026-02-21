import { Telegraf } from 'telegraf';

// APNI ASLI KEYS YAHAN DALO
const BOT_TOKEN = "8062934304:AAGkF1nkuDWX_dGDEqkm85dmd050EGRQPXU"; 
const GEMINI_API_KEY = "AIzaSyCrh0QDQ5XIqAdgjd1uEJFd9b2vAWTgs6s";

const bot = new Telegraf(BOT_TOKEN);

bot.command('ai', async (ctx) => {
    const prompt = ctx.message.text.split(' ').slice(1).join(' ');

    if (!prompt) {
        return ctx.reply('Bhai, koi sawal toh likho! Jaise: /ai write a long essay\n\ndev @lakshitpatidar', {
            reply_to_message_id: ctx.message.message_id
        });
    }

    try {
        // Direct Google Gemini API (Fetch Method - Koi package error nahi aayega)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`API Error: ${data.error?.message || response.status}`);
        }

        // Gemini ka reply nikalna
        const replyText = data.candidates[0].content.parts[0].text;
        
        // 🚀 Lamba Message Splitter (Telegram 4096 Character Limit Fix)
        const MAX_LENGTH = 4000; // Safe limit rakhi hai
        
        for (let i = 0; i < replyText.length; i += MAX_LENGTH) {
            let chunk = replyText.substring(i, i + MAX_LENGTH);
            
            // Aakhri message ke end me tumhara dev tag lagayenge
            if (i + MAX_LENGTH >= replyText.length) {
                chunk += `\n\ndev @lakshitpatidar`;
            }
            
            // Ek-ek karke message bhejega
            await ctx.reply(chunk, {
                reply_to_message_id: ctx.message.message_id
            });
        }

    } catch (error) {
        console.error("System Error Log:", error);
        await ctx.reply(`Bhai, kuch technical issue aa gaya hai. Thodi der baad try karna.\n\ndev @lakshitpatidar`, {
            reply_to_message_id: ctx.message.message_id
        });
    }
});

// Vercel Serverless Function
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
        res.status(200).send('Bot naye system pe mast chal raha hai! ✅');
    }
            }
            
