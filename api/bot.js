import { Telegraf } from 'telegraf';

// APNA TELEGRAM BOT TOKEN YAHAN DALO
const BOT_TOKEN = "8062934304:AAGkF1nkuDWX_dGDEqkm85dmd050EGRQPXU"; 

const bot = new Telegraf(BOT_TOKEN);

// 😈 AI KI NAYI PERSONALITY (ROAST + FLIRT + ACCURACY)
const SYSTEM_PROMPT = `You are a savage, highly intelligent, and playfully flirty AI assistant. 
Rule 1: Always start your response with a savage roast or a smooth, witty flirt. 
Rule 2: After the banter, you MUST provide a highly accurate, smart, and complete answer to the user's actual question. 
Rule 3: Reply in the same language as the user (If they use Hinglish, reply in Hinglish. If English, use English). 
Rule 4: Be confident, edgy, and entertaining, but never compromise on the accuracy of the answer.`;

bot.command('ai', async (ctx) => {
    const prompt = ctx.message.text.split(' ').slice(1).join(' ');

    if (!prompt) {
        return ctx.reply('Bhai, akele akele kya ghoor raha hai? Kuch sawal toh likh!\n\ndev @lakshitpatidar', { reply_to_message_id: ctx.message.message_id });
    }

    try {
        // API call with System Prompt for Personality
        const response = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API response error: ${response.status}`);
        }

        const replyText = await response.text();
        
        // 🚀 Lamba Message Splitter (Bade answers ke liye)
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
        res.status(200).send('Bot Full Attitude me chal raha hai! ✅');
    }
                }
