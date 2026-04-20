import { deffenseE, crit, maxHPP } from "./bat.js"
import { calculatePlayerDamage } from './player.js'

export function handlePlayerMove(move, player, enemyName, enemyAction, currentEnemyHP) {
    let playerLog = ""
    let enemyLog = ""
    let updatedEnemyHP = currentEnemyHP

    // атака
    if (move === "1") {
        player.healCounter -= 1
        let damage = calculatePlayerDamage()

        // Логика крита
        if (player.hasSoulStone && crit(player)) {
            damage *= 3
            playerLog = `КРИТИЧЕСКИЙ УДАР (Камень Душ)! Вы нанесли ${damage} урона. `
        } else if (player.hasItem && crit(player)) {
            damage *= 2
            playerLog = `КРИТИЧЕСКИЙ УДАР! Вы нанесли ${damage} урона. `
        } else {
            playerLog = `Вы нанесли ${damage} урона. `
        }

        // Защита врага
        if (enemyAction === "defense") {
            let defensePower = (enemyName === "Вечный Страж" || enemyName === "Повелитель Тумана") ? 100 : 10
            damage = deffenseE(damage, defensePower) // Урон не может быть меньше 0
            enemyLog = `${enemyName} защитился (поглощено ${defensePower}). `
        }

        updatedEnemyHP -= damage

    // защита
    } else if (move === "2") {
        player.healCounter -= 1
        playerLog = "Вы встали в защитную стойку. "

    // исцеление
    } else if (move === "3") {
        //функция для отката исцеления
        if (player.healCounter > 0) {
            player.healCounter -= 1
            playerLog = `Исцеление в откате, подожди ${player.healCounter} ход(а)`
        } else {
            let healing = 30
            if (player.hasArts2) healing += 50
            if (player.hasArts3) healing += 30

            player.currentHP += healing

            //Проверка, чтобы ХП не стало больше максимального из файла bat.js
            player.currentHP = maxHPP(player)

            player.healCounter = 2
            playerLog = `Вы использовали исцеление и восстановили ${healing} ХП, следующее исцеление возможно через 2 хода`
        }

    // пропуск хода
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