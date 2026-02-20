import { Telegraf } from 'telegraf';

// APNI KEYS YAHAN DIRECT PASTE KARO
const BOT_TOKEN = "8062934304:AAGkF1nkuDWX_dGDEqkm85dmd050EGRQPXU"; 
const GROQ_API_KEY = "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";

const bot = new Telegraf(BOT_TOKEN);

// /ai command ka logic
bot.command('ai', async (ctx) => {
    // '/ai ' ke baad wala message nikalna
    const prompt = ctx.message.text.split(' ').slice(1).join(' ');

    if (!prompt) {
        return ctx.reply('Bhai, koi sawal toh likho! Jaise: /ai who is Jhonny sins\n\ndev @lakshitpatidar', {
            reply_to_message_id: ctx.message.message_id
        });
    }

    try {
        // Groq API ko call karna
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();

        // Agar Groq se error aaya toh usko trigger karna
        if (!response.ok) {
            throw new Error(`Groq API Error: ${data.error?.message || response.status}`);
        }

        // Groq ka reply nikalna
        const replyText = data.choices[0].message.content;
        
        // Tumhara custom format
        const finalMessage = `${replyText}\n\ndev @lakshitpatidar`;
        
        await ctx.reply(finalMessage, {
            reply_to_message_id: ctx.message.message_id
        });

    } catch (error) {
        // ⚠️ ASLI ERROR SIRF VERCEL LOGS ME DIKHEGA (Safe)
        console.error("System Error Log:", error);
        
        // 🔒 TELEGRAM PAR SAFE MESSAGE JAYEGA (No key leak)
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
        res.status(200).send('Kanu ka Groq AI bot ekdum mast chal raha hai! ✅');
    }
            }
