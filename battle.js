import { income, action } from './bat.js'
import { player } from './player.js'
import { handlePlayerMove } from './combatActions.js'

// универсальная функция боя
export async function startBattle(rl, enemyName, enemyHP, enemyDamage) {

    let currentEnemyHP = enemyHP

    if (player.currentHP > player.maxHP) {
        player.currentHP = player.maxHP
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
        if (enemyName === "Тролль" || enemyName === "Матерая Химера" || enemyName === "Химера" || enemyName === "Рыцарь Бездны") {
            enemyAction = action() === 0 ? "attack" : "heal"
        } else {
            enemyAction = action() === 0 ? "attack" : "defense";
        }
        let playerLog = ""
        let enemyLog = ""

        const result = handlePlayerMove(move, player, enemyName, enemyAction, currentEnemyHP);

        playerLog = result.playerLog
        enemyLog += result.enemyLog
        currentEnemyHP = result.updatedEnemyHP

        // действия мобов
        if (enemyAction === "attack" && currentEnemyHP > 0) {
            let eDamage = enemyDamage
            if (move === "2") {
                eDamage -= 30
                playerLog += "Защита сработала!"
            }

            player.currentHP -= eDamage

            enemyLog += `${enemyName} атакует и наносит ${eDamage} урона.`

        } else if (enemyAction === "defense" && enemyLog === "") {
            enemyLog = `${enemyName} защищается.`
        } else if (enemyAction === "heal" && enemyLog === "") {
            let healAmount = 40 // Стандартное исцеление

            if (enemyName === "Химера") {
                healAmount = 20
            } else if (enemyName === "Рыцарь Бездны") {
                healAmount = 80
            }
            currentEnemyHP += healAmount

            // Проверка, чтобы ХП не стало больше максимального
            if (currentEnemyHP > enemyHP) {
                currentEnemyHP = enemyHP
            }

            enemyLog = `${enemyName} исцеляется на ${healAmount} ХП.`
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