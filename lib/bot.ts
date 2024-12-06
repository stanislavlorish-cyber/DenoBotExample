import { serve } from "https://deno.land/std/http/server.ts";

const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");
const port = Number(Deno.env.get("PORT") || 8080); // Установка порта с значением по умолчанию

// Хранилище пользователей и их интересов
const users = new Map();

// Клавиатура для команды /about
const keyboard = new InlineKeyboard().text("Обо мне", "/about");

// Установка Webhook
await bot.api.setWebhook(`https://stanislavlo-denobotexam-32-jmf3xkxg3kqn.deno.dev:${port}/webhook`); // Замените YOUR_DOMAIN на ваш домен

// Обработайте команду /start.
bot.command("start", (ctx) => {
    ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard });
    ctx.reply("Пожалуйста, напишите свои интересы и город.");
});

// Обработайте сообщения с интересами и городом.
bot.on("message", async (ctx) => {
    const userId = ctx.from.id;

    // Сохраняем интересы и город пользователя
    let userData = users.get(userId);
    if (!userData) {
        userData = { interests: '', city: '' };
        users.set(userId, userData);
    }

    // Если интересы еще не были введены
    if (!userData.interests) {
        userData.interests = ctx.message.text;
        await ctx.reply(`Вы написали интересы: ${userData.interests}. Теперь напишите свой город.`);
    } else if (!userData.city) {
        userData.city = ctx.message.text;
        await ctx.reply(`Вы из города: ${userData.city}.`);

        // Сравниваем с другими пользователями
        const matches = Array.from(users.entries())
            .filter(([id, data]) => id !== userId && data.city === userData.city && data.interests === userData.interests);

        if (matches.length > 0) {
            const matchedUsernames = matches.map(([id]) => `Пользователь ${id}`).join(', ');
            await ctx.reply(`У вас есть совпадения с: ${matchedUsernames}. Хотите встретиться?`);
        } else {
            await ctx.reply("Совпадений не найдено.");
        }
    }
});

// Обработайт




// >>>>>>> 73b691c000c5667a2876609550494257c1976086

