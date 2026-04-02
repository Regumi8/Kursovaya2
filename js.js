import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { readFileSync } from 'node:fs'

const rl = readline.createInterface({input, output})

let dialogueTree

try {
    const data = readFileSync('./dialogue.json', 'utf8')
    dialogueTree = JSON.parse(data)
} catch (err) {
    console.error("Ошибка при чтении dialogue.json! Убедитесь, что файл существует.", err)
    process.exit(1)
}

const player = {
    name: "Искатель приключений",
    maxHP: 100,
    hasItem: false,
    hasWeapon: false,
    hasArmor: false,
    description: "Вы — путник в поношенном плаще, ищущий славы в землях города N."
}

function showPlayerStatus() {
    if (player.hasArmor) {
        player.maxHP = 200
    }
    console.log("\n===============================")
    console.log(`ПЕРСОНАЖ: ${player.name}`)
    console.log(`ЗДОРОВЬЕ: ${player.maxHP}`)
    console.log(`ПРЕДМЕТЫ: ${player.hasItem ? "Амулет Крита (шанс 10%)" : "Пусто"}`)
    console.log(`ОРУЖИЕ: ${player.hasWeapon ? "Железный меч (урон + 5)" : "Пусто"}`)
    console.log(`БРОНЯ: ${player.hasArmor ? "Броня из панциря химеры (ХП + 100)" : "Пусто"}`)
    console.log(`ОПИСАНИЕ: ${player.description}`)
    console.log("===============================")
    console.log("(Нажмите Enter, чтобы вернуться в диалог)")
}
async function startBattle(enemyName, enemyHP, enemyDamage) {

    let playerHP = 100;
    let currentEnemyHP = enemyHP

    if (player.hasArmor) {
        playerHP = 200
    }

    console.log(`\n========== НАЧАЛО БОЯ С ${enemyName.toUpperCase()} ==========`)

    while (playerHP > 0 && currentEnemyHP > 0) {

        console.log(`\n-------------------`)
        console.log(`Ваше хп: ${playerHP} | Хп ${enemyName}: ${currentEnemyHP}`)
        console.log(`Выберете действие:`)
        console.log(`1. Атака`)
        console.log(`2. Защита`)
        console.log(`3. Исцеление`)

        const move = await rl.question('\nВаш выбор: ')

        let enemyAction = Math.floor(Math.random() * 2) === 0 ? "attack" : "defense"
        let playerLog = ""
        let enemyLog = ""

        if (move === "1") {

            let damage = 10

            if (!player.hasWeapon) {
                damage = 10
                playerLog = `Вы нанесли ${damage} урона. `
            } else {
                damage = 20
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
            playerHP += 15
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

            playerHP -= eDamage

            enemyLog += `${enemyName} атакует и наносит ${eDamage} урона.`
        } else if (enemyAction === "defense" && enemyLog === "") {
            enemyLog = `${enemyName} защищается.`
        }

        console.log(`\n[РЕЗУЛЬТАТ ХОДА]`)
        console.log(`>${playerLog}`)
        console.log(`>${enemyLog}`)

    }
    if (playerHP > 0) {
        console.log(`\nПобеда над ${enemyName}!`)
        return true
    } else {
        console.log("\nПоражение... Игра окончена.")
        return false
    }
}
async function startChat() {

    let currentNodeKey = "start"

    while (currentNodeKey !== null) {
        const node = dialogueTree[currentNodeKey]
        if (!node) break

        console.log(node.npc)

        node.options.forEach((opt, index) => {
            console.log(`${index + 1}. ${opt.text}`)
        })

        console.log(`0. [Посмотреть описание игрока]`)

        const answer = await rl.question('\nВведите номер: ')
        if (answer === "0") {
            showPlayerStatus()
            await rl.question('')
            console.clear()
            continue
        }

        const choiceIndex = parseInt(answer) - 1

        if (node.options[choiceIndex]) {
            let next = node.options[choiceIndex].nextNode
            if (next === "combatGoblin") {
                const win = await startBattle("Гоблин", 50, 5)
                currentNodeKey = win ? "afterBattle" : "combatGoblin"
            } 
            else if (next === "item") {
                player.hasItem = true
                currentNodeKey = "item"
            }
            else if (next === "combatChimera") {
                const win = await startBattle("Химера", 80, 10);
                currentNodeKey = win ? "nextPart" : "combatChimera"
            }
            else if (next === "weapon") {
                player.hasWeapon = true
                currentNodeKey = "weapon"
            }
            else if (next === "combatChimera2") {
                const win = await startBattle("Химера", 300, 15)
                currentNodeKey = win ? "back" : "combatChimera2"
            }
            else if (next === "armor3") {
                player.hasArmor = true
                currentNodeKey = "armor3"
            }
            else if (next === "back2") {
                player.hasWeapon = false
                currentNodeKey = "back2"
            }
            else if (next === "combatWolf") {
                const win = await startBattle("Лютоволк", 150, 40)
                currentNodeKey = win ? "final" : "combatWolf"
            }
            else if (next === "combatTroll") {
                const win = await startBattle("Тролль", 500, 15)
                currentNodeKey = win ? "final" : "combatTroll"
            }
            else if (next === "combatStrazh") {
                const win = await startBattle("Стражник", 1000, 40)
                currentNodeKey = win ? "final" : null
            }
            else {
                currentNodeKey = next
            }
            if (currentNodeKey === null && next !== null) {
                console.log("\nКонец игры.")
            }
        } else {
            console.log("Неверный выбор.")
        }
    }
    rl.close()
}
startChat()