import { income, action } from './bat.js'
import { player } from './player.js'

// универсальная функция боя
export async function startBattle(rl, enemyName, enemyHP, enemyDamage) {

    let currentEnemyHP = enemyHP

    // условие для того, чтобы текущее ХП не превышало максимальное
    if (player.currentHP > player.maxHP) {
        player.currentHP -= player.currentHP % player.maxHP
    }

    console.log(`\n========== НАЧАЛО БОЯ С ${enemyName.toUpperCase()} ==========`)

    //цикл конкретного боя, пока у одного из нас не закончится хп
    while (player.currentHP > 0 && currentEnemyHP > 0) {

        console.log(`\n-------------------`)
        console.log(`Ваше хп: ${player.currentHP} | Хп ${enemyName}: ${currentEnemyHP}`)
        console.log(`Выберете действие:`)
        console.log(`1. Атака`)
        console.log(`2. Защита`)
        console.log(`3. Исцеление`)

        const move = await rl.question('\nВаш выбор: ')

        let enemyAction

        // рандом действий мобов
        if (enemyName === "Тролль" || enemyName === "Матерая Химера" || enemyName === "Химера") {
            enemyAction = action() === 0 ? "attack" : "heal"
        } else {
            enemyAction = action() === 0 ? "attack" : "defense";
        }
        let playerLog = ""
        let enemyLog = ""

        // действия игрока
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
                damage -= 10
                enemyLog = `${enemyName} защитился. `
            }

            currentEnemyHP -= damage

        } else if (move === "2") {
            playerLog = "Вы защищаетесь. "
        } else if (move === "3") {
            let healing
            if (player.hasArts2) {
                healing = 40
                player.currentHP += healing 
            } else {
                healing = 25
                player.currentHP += healing
            }
            playerLog = `Исцеление игрока ${healing} ХП.`
        } else {
            console.log("Вы замешкались, пропуск хода!")
        }

        // действия мобов
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
            if (enemyName === "Химера") {
                currentEnemyHP += 20
            } else {
                currentEnemyHP += 40
            }
            if (enemyHP < currentEnemyHP) {
                currentEnemyHP = enemyHP
            }
            enemyLog = `${enemyName} исцеляется.`
        }

        console.log(`\n[РЕЗУЛЬТАТ ХОДА]`)
        console.log(`>${playerLog}`)
        console.log(`>${enemyLog}`)

    }

    // получение монет с мобов
    if (player.currentHP > 0) {
        let reward = enemyName === "Гоблин" ? income() + 70 : income() + 120
        player.counter += reward
        console.log(`\nПОБЕДА! Вы нашли ${reward} монет. Теперь у вас ${player.counter}.`)
        return true
    } else {
        console.log("\nПоражение... Игра окончена.")
        return false
    }
}