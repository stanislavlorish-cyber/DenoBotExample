
bot.on("message", async (ctx) => {
    const userId = ctx.from.id;

    try {
        // Сохраняем интересы и город пользователя
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
                .filter(([id]) => id !== userId && users.get(id)?.city === userData.city && users.get(id)?.interests === userData.interests);

            if (matches.length > 0) {
                const matchedUsernames = matches.map(([id]) => `Пользователь ${id}`).join(', ');
                await ctx.reply(`У вас есть совпадения с: ${matchedUsernames}. Хотите встретиться?`);
            } else {
                await ctx.reply("Совпадений не найдено.");
            }
        }
    } catch (error) {
        if (error instanceof GrammyError && error.error_code === 403) {
            console.log(`Бот заблокирован пользователем: ${ctx.from.id}`);
        } else {
            console.error("Произошла другая ошибка при обработке сообщения:", error);
        }
    }
});

// Обработайте команду /about
bot.callbackQuery("/about", async (ctx) => {
    try {
        await ctx.answerCallbackQuery();
        await ctx.reply("Я бот? Я бот... Я Бот!");
    } catch (error) {
        if (error instanceof GrammyError && error.error_code === 403) {
            console.log(`Бот заблокирован пользователем в /about: ${ctx.from.id}`);
        } else {
            console.error("Произошла ошибка при обработке callbackQuery:", error);
        }
    }
});



