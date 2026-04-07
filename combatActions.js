export function handlePlayerMove(move, player, enemyName, enemyAction, currentEnemyHP) {
    let playerLog = "";
    let enemyLog = "";
    let updatedEnemyHP = currentEnemyHP;

    // атака
    if (move === "1") {
        let damage = 10;

        // Бонусы оружия
        if (player.hasBlessedSword) {
            damage += 50;
        } else if (player.hasWeapon) {
            damage += 10;
        }

        // Бонусы артефактов
        if (player.hasArts3) damage += 30;
        if (player.hasArts) damage += 5;

        // Логика крита
        if (player.hasSoulStone && Math.random() < 0.75) {
            damage *= 3;
            playerLog = `КРИТИЧЕСКИЙ УДАР (Камень Душ)! Вы нанесли ${damage} урона. `;
        } else if (player.hasItem && Math.random() < 0.5) {
            damage *= 2;
            playerLog = `КРИТИЧЕСКИЙ УДАР! Вы нанесли ${damage} урона. `;
        } else {
            playerLog = `Вы нанесли ${damage} урона. `;
        }

        // Защита врага
        if (enemyAction === "defense") {
            const defensePower = (enemyName === "Вечный Страж" || enemyName === "Повелитель Тумана") ? 100 : 10;
            damage = Math.max(0, damage - defensePower) // Урон не может быть меньше 0
            enemyLog = `${enemyName} защитился (поглощено ${defensePower}). `
        }

        updatedEnemyHP -= damage

    // защита
    } else if (move === "2") {
        playerLog = "Вы встали в защитную стойку. "

    // исцеление
    } else if (move === "3") {
        let healing = 30
        if (player.hasArts2) healing += 40
        if (player.hasArts3) healing += 20

        player.currentHP += healing

        // Ограничение по MaxHP
        if (player.currentHP > player.maxHP) {
            player.currentHP = player.maxHP
        }
        playerLog = `Вы использовали исцеление и восстановили ${healing} ХП.`

    // --- ПРОПУСК ХОДА ---
    } else {
        playerLog = "Вы замешкались и пропустили ход! "
    }

    // Возвращаем объект с результатами, чтобы обновить переменные в основном файле боя
    return {
        playerLog,
        enemyLog,
        updatedEnemyHP
    }
}