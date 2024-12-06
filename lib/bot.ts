
import { Bot, InlineKeyboard, Context, GrammyError } from "https://deno.land/x/grammy@v1.32.0/mod.ts";

// Интерфейс для хранения данных пользователя
interface UserData {
    interests: string;
    city: string;
}

// Создайте экземпляр бота
export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

// Хранилище пользователей и их интересов
const users = new Map<number, UserData>();

// Клавиатура для команды /about
const keyboard = new InlineKeyboard().text("Обо мне", "/about");

// Функция для безопасного отправления сообщений
async function safeReply(ctx: Context, message: string): Promise<void> {
    try {
        await ctx.reply(message);
    } catch (error) {
        if (error instanceof GrammyError && error.error_code === 403) {
            console.log(`Бот заблокирован пользователем: ${ctx.from.id}`);
        } else {
            console.error("Ошибка при отправке сообщения:", error);
        }
    }
}

// Обработайте команду /start.
bot.command("start", (ctx: Context) => {
    safeReply(ctx, "Добро пожаловать. Запущен и работает!");
    safeReply(ctx, "Пожалуйста, напишите свои интересы и город.");
});

// Обработайте сообщения с интересами и городом.
bot.on("message", async (ctx: Context) => {
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
        await safeReply(ctx, `Вы написали интересы: ${userData.interests}. Теперь напишите свой город.`);
    } else if (!userData.city) {
        userData.city = ctx.message.text;
        await safeReply(ctx, `Вы из города: ${userData.city}.`);

        // Сравниваем с другими пользователями
        const matches = Array.from(users.entries())
            .filter(([id]) => id !== userId && users.get(id)?.city === userData.city && users.get(id)?.interests === userData.interests);

        if (matches.length > 0) {
            const matchedUsernames = matches.map(([id]) => `Пользователь ${id}`).join(', ');
            await safeReply(ctx, `У вас есть совпадения с: ${matchedUsernames}. Хотите встретиться?`);
        } else {
            await safeReply(ctx, "Совпадений не найдено.");
        }
    }
});

// Обработайте команду /about
bot.callbackQuery("/about", async (ctx: Context) => {
    await ctx.answerCallbackQu
ery();
    await safeReply(ctx, "Я бот? Я бот... Я Бот!");
});

// Обработайте команду /reset для очистки данных пользователя
bot.command("reset", (ctx: Context) => {
    const userId = ctx.from.id;
    users.delete(userId);
    safeReply(ctx, "Ваши данные были очищены. Пожалуйста, напишите свои интересы и город снова.");
});

await bot.start();




