import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.32.0/mod.ts";

const botToken = Deno.env.get("BOT_TOKEN");
if (!botToken) {
    throw new Error("BOT_TOKEN is not defined!");
}
export const bot = new Bot(botToken);

const users = new Map();

// Клавиатура для команды /about
const keyboard = new InlineKeyboard()
    .text("Обо мне", "/about");

bot.command("start", (ctx) => {
    ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard });
    ctx.reply("Пожалуйста, напишите свои интересы и город.");
});

bot.on("message", async (ctx) => {
    const userId = ctx.from.id;

    let userData = users.get(userId);
    if (!userData) {
        userData = { interests: '', city: '' };
        users.set(userId, userData);
    }

    if (!userData.interests) {
        userData.interests = ctx.message.text;
        await ctx.reply(`Вы написали интересы: ${userData.interests}. Теперь напишите свой город.`);
    } else if (!userData.city) {
        userData.city = ctx.message.text;
        await ctx.reply(`Вы из города: ${userData.city}.`);

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

// Обработайте команду /about
bot.callbackQuery("/about", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("Я бот? Я бот... Я Бот!");
});

await bot.start();
console.log('Бот запущен!');
