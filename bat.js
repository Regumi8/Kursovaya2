export async function startBattle(enemyName, enemyHP, enemyDamage) {

    let currentEnemyHP = enemyHP

    if (player.currentHP > player.maxHP) {
        player.currentHP -= player.currentHP % player.maxHP
    }

    console.log(`\n========== НАЧАЛО БОЯ С ${enemyName.toUpperCase()} ==========`)

    while (player.currentHP > 0 && currentEnemyHP > 0) {

        console.log(`\n-------------------`)
        console.log(`Ваше хп: ${player.currentHP} | Хп ${enemyName}: ${currentEnemyHP}`)
        console.log(`Выберете действие:`)
        console.log(`1. Атака`)
        console.log(`2. Защита`)
        console.log(`3. Исцеление`)

        const move = await rl.question('\nВаш выбор: ')

        let enemyAction

        if (enemyName === "Тролль" || enemyName === "Химера") {
            enemyAction = Math.randath.floor(Mom() * 2) === 0 ? "attack" : "heal";
        } else {
            enemyAction = Math.floor(Math.random() * 2) === 0 ? "attack" : "defense";
        }
        let playerLog = ""
        let enemyLog = ""

        if (move === "1") {

            let damage = 10

            if (!player.hasWeapon) {
                damage += 0
                playerLog = `Вы нанесли ${damage} урона. `
            } else {
                damage += 10
                playerLog = `Вы нанесли ${damage} повышенный урон. `
            }
            if (!player.hasArts) {
                damage += 0
                playerLog = `Вы нанесли ${damage} урона. `
            } else {
                damage += 5
                playerLog = `Вы нанесли ${damage} повышенный урон. `
            }
            if (player.hasItem && Math.random() < 0.5) {
                damage = damage * 2
                playerLog = `КРИТИЧЕСКИЙ УДАР! Вы нанесли ${damage} урона. `
            } else {
                playerLog = `Вы нанесли ${damage} урона. `
            }

            if (enemyAction === "defense") {
                damage -= 3
                enemyLog = `${enemyName} защитился. `
            }

            currentEnemyHP -= damage

        } else if (move === "2") {
            playerLog = "Вы защищаетесь. "
        } else if (move === "3") {
            player.currentHP += 15
            playerLog = "Исцеление игрока +15 ХП. "
        } else {
            console.log("Вы замешкались, пропуск хода!")
        }
        if (enemyAction === "attack" && currentEnemyHP > 0) {
            let eDamage = enemyDamage
            if (move === "2") {
                eDamage -= 3
                playerLog += "Защита сработала!"
            }

            player.currentHP -= eDamage

            enemyLog += `${enemyName} атакует и наносит ${eDamage} урона.`
        } else if (enemyAction === "defense" && enemyLog === "") {
            enemyLog = `${enemyName} защищается.`
        } else if (enemyAction === "heal" && enemyLog === "") {
            currentEnemyHP += 40
            if (enemyHP < currentEnemyHP) {
                currentEnemyHP = enemyHP
            }
            enemyLog = `${enemyName} исцеляется.`
        }

        console.log(`\n[РЕЗУЛЬТАТ ХОДА]`)
        console.log(`>${playerLog}`)
        console.log(`>${enemyLog}`)

    }
    if (player.currentHP > 0) {
        let reward = enemyName === "Гоблин" ? Math.floor(Math.random() * 50) + 70 : Math.floor(Math.random() * 50) + 120
        player.counter += reward
        console.log(`\nПОБЕДА! Вы нашли ${reward} монет. Теперь у вас ${player.counter}.`)
        return true
    } else {
        console.log("\nПоражение... Игра окончена.")
        return false
    }
}