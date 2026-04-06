import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { readFileSync } from 'node:fs'
import { player, showPlayerStatus } from './player.js'

const rl = readline.createInterface({input, output})

let dialogueTree;
try {
    dialogueTree = JSON.parse(readFileSync('./dialogue.JSON', 'utf8'));
} catch (e) {
    console.error("Ошибка: Файл dialogue.JSON не найден или поврежден!");
    process.exit(1);
}

async function startBattle(rl, enemyName, enemyHP, enemyDamage) {

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
            enemyAction = action() === 0 ? "attack" : "heal"
        } else {
            enemyAction = action() === 0 ? "attack" : "defense";
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
        let reward = enemyName === "Гоблин" ? income() + 70 : income() + 120
        player.counter += reward
        console.log(`\nПОБЕДА! Вы нашли ${reward} монет. Теперь у вас ${player.counter}.`)
        return true
    } else {
        console.log("\nПоражение... Игра окончена.")
        return false
    }
}

// async function startChat() {
//     // console.log(income())
//     let currentNodeKey = "start"

//     while (currentNodeKey !== null) {
//         const node = dialogueTree[currentNodeKey]
//         if (!node) break

//         console.log(node.npc)

//         node.options.forEach((opt, index) => {
//             console.log(`${index + 1}. ${opt.text}`)
//         })

//         console.log(`0. [Посмотреть описание игрока]`)

//         const answer = await rl.question('\nВведите номер: ')
//         if (answer === "0") {
//             showPlayerStatus()
//             await rl.question('')
//             console.clear()
//             continue
//         }

//         const choiceIndex = parseInt(answer) - 1

//         if (node.options[choiceIndex]) {
//             let next = node.options[choiceIndex].nextNode
//             if (next === "combatGoblin") {
//                 const win = await startBattle("Гоблин", 70, 10)
//                 if (win) {
//                     currentNodeKey = "afterBattle"
//                 } else {
//                     console.log("\n[!] Вы погибли... Но таинственная сила вернула вас к началу битвы.")
//                     player.currentHP = player.maxHP
//                 }
//             }
//             else if (next === "item") {
//                 player.hasItem = true
//                 currentNodeKey = "item"
//             }

//             else if (next === "swordByStar") {
//                 if (player.counter >= 30 && player.hasArts === false) {
//                     player.counter -= 30
//                     player.hasArts = true
//                     console.log(`\n[!] Вы купили Артефакт для оружия! Оставшиеся монеты: ${player.counter}`)
//                     currentNodeKey = "swordByStar"
//                 } else if (next === "cityN") {
//                     console.log("\n[!] Вы отказались приобретать Артефакт для оружия!")
//                     currentNodeKey = "cityN"
//                 }
//                 else {
//                     console.log("\n[!] Недостаточно монет или у вас уже есть этот предмет!")
//                     currentNodeKey = "swordByStar"
//                 }
//             }
//             else if (next === "buyArt2") {
//                 if (player.counter >= 50 && player.hasArts2 === false) {
//                     player.counter -= 50
//                     player.hasArts2 = true
//                     player.maxHP += 50
//                     player.currentHP += 50
//                     console.log(`\n[!] Вы купили Артефакт для брони! Оставшиеся монеты: ${player.counter}`)
//                     currentNodeKey = next
//                 } else if (next === "buyArt3") {
//                     console.log("\n[!] Вы отказались приобретать Артефакт для брони!")
//                     currentNodeKey = "buyArt3"
//                 }
//                 else {
//                     console.log("\n[!] Недостаточно монет или у вас уже есть этот предмет!")
//                     currentNodeKey = "buyArt"
//                 }
//             }

//             else if (next === "combatChimera") {
//                 const win = await startBattle("Химера", 120, 20);
//                 if (win) {
//                     currentNodeKey = "nextPart"
//                 } else {
//                     console.log("\n[!] Вы погибли... Но таинственная сила вернула вас к началу битвы.")
//                     player.currentHP = player.maxHP
//                 }
//             }
//             else if (next === "weapon") {
//                 player.hasWeapon = true
//                 currentNodeKey = "weapon"
//             }
//             else if (next === "combatChimera2") {
//                 player.currentHP += 200
//                 const win = await startBattle("Химера", 400, 40)
//                 if (win) {
//                     currentNodeKey = "back"
//                 } else {
//                     console.log("\n[!] Вы погибли... Но таинственная сила вернула вас к началу битвы.")
//                     player.currentHP = player.maxHP
//                 }
//             }
//             else if (next === "armor3") {
//                 player.hasArmor = true
//                 player.maxHP += 100
//                 player.currentHP = player.maxHP
//                 currentNodeKey = "armor3"
//             }
//             else if (next === "back2") {
//                 player.hasWeapon = false
//                 currentNodeKey = "back2"
//             }
//             else if (next === "sword1-1") {
//                 if (player.counter >= 200 && player.hasWeapon === false) {
//                     player.counter -= 200
//                     player.hasWeapon = true
//                     console.log(`\n[!] Вы купили Железный Меч! Оставшиеся монеты: ${player.counter}`)
//                     currentNodeKey = "sword1-1"
//                 } else if (next === "sword2") {
//                     console.log("\n[!] Вы отказались приобретать Железный Меч!")
//                     currentNodeKey = "sword2"
//                 }
//                 else {
//                     console.log("\n[!] Недостаточно монет или у вас уже есть Железный Меч!")
//                     currentNodeKey = "sword1"
//                 }
//             }
//             else if (next === "buyArmor") {
//                 player.currentHP = player.maxHP
//                 currentNodeKey = "buyArmor"
//             }
//             else if (next === "combatGoblinThree") {
//                 const win = await startBattle("Гоблины", 80, 15)
//                 if (win) {
//                     currentNodeKey = "farm3"
//                 } else {
//                     console.log("\n[!] Вы погибли... Но таинственная сила вернула вас к началу битвы.")
//                     player.currentHP = player.maxHP
//                 }
//             }
//             else if (next === "combatWolf") {
//                 const win = await startBattle("Лютоволк", 400, 60)
//                 if (win) {
//                     currentNodeKey = "final"
//                 } else {
//                     console.log("\n[!] Вы погибли... Но таинственная сила вернула вас к началу битвы.")
//                     player.currentHP = player.maxHP
//                 }
//             }
//             else if (next === "combatTroll") {
//                 const win = await startBattle("Тролль", 1000, 20)
//                 if (win) {
//                     currentNodeKey = "final"
//                 } else {
//                     console.log("\n[!] Вы погибли... Но таинственная сила вернула вас к началу битвы.")
//                     player.currentHP = player.maxHP
//                 }
//             }
//             else if (next === "combatStrazh") {
//                 const win = await startBattle("Стражник", 3000, 100)
//                 currentNodeKey = win ? "final" : null
//             }
//             else {
//                 currentNodeKey = next
//             }
//             if (currentNodeKey === null && next !== null) {
//                 console.log("\nКонец игры.")
//             }
//         } else {
//             console.log("Неверный выбор.")
//         }
//     }
//     rl.close()
// }
// startChat()

const nodeHandlers = {
    combatGoblin: async (rl) => (await startBattle(rl, "Гоблин", 70, 10)) ? "afterBattle" : "retry",
    
    combatChimera: async (rl) => (await startBattle(rl, "Химера", 120, 20)) ? "nextPart" : "retry",
    
    combatChimera2: async (rl) => {
        player.currentHP += 200
        return (await startBattle(rl, "Химера", 400, 40)) ? "back" : "retry"
    },
    
    combatGoblinThree: async (rl) => (await startBattle(rl, "Гоблины", 80, 15)) ? "farm3" : "retry",
    
    combatWolf: async (rl) => (await startBattle(rl, "Лютоволк", 400, 60)) ? "final" : "retry",
    
    combatTroll: async (rl) => (await startBattle(rl, "Тролль", 1000, 20)) ? "final" : "retry",
    
    combatStrazh: async (rl) => (await startBattle(rl, "Стражник", 3000, 100)) ? "final" : null,

    item: async () => { player.hasItem = true; return "item"; },
    
    weapon: async () => { player.hasWeapon = true; return "weapon"; },
    
    armor3: async () => { 
        player.hasArmor = true
        player.maxHP += 100
        player.currentHP = player.maxHP
        return "armor3"
    },

    swordByStar: async () => {
        if (player.counter >= 30 && !player.hasArts) {
            player.counter -= 30
            player.hasArts = true
            console.log("\n[!] Куплен Артефакт для оружия!")
            return "swordByStar"
        }
        return "cityN"
    },

    buyArt2: async () => {
        if (player.counter >= 50 && !player.hasArts2) {
            player.counter -= 50
            player.hasArts2 = true
            player.maxHP += 50;
            player.currentHP += 50
            console.log("\n[!] Куплен Артефакт для брони!")
                        return "buyArt2"
        }
        return "buyArt3"
    },

    sword12: async () => {
        if (player.counter >= 200 && !player.hasWeapon) {
            player.counter -= 200
            player.hasWeapon = true
            console.log("\n[!] Куплен Железный Меч!")
            return "sword12"
        }
        return "sword2"
    }
}

async function startChat() {
    let currentNodeKey = "start"

    while (currentNodeKey !== null) {
        const node = dialogueTree[currentNodeKey]
        if (!node) break

        console.log(`\n-----------------------------------`)
        console.log(node.npc)
        node.options.forEach((opt, idx) => console.log(`${idx + 1}. ${opt.text}`))
        console.log("0. [Посмотреть статус персонажа]")

        const answer = await rl.question('\nВыберите номер: ')

        if (answer === "0") {
            showPlayerStatus()
            await rl.question('Нажмите Enter, чтобы вернуться...')
            console.clear()
            continue
        }

        const choiceIndex = parseInt(answer) - 1
        const choice = node.options[choiceIndex]

        if (!choice) {
            console.log("Неверный ввод, попробуйте снова.")
            continue
        }

        const next = choice.nextNode;

        if (nodeHandlers[next]) {
            const result = await nodeHandlers[next](rl)
            
            if (result === "retry") {
                console.log("\n[!] Вы погибли... Но таинственная сила вернула вас назад.")
                player.currentHP = player.maxHP
            } else {
                currentNodeKey = result
            }
        } else {
            currentNodeKey = next
        }

        if (currentNodeKey === null && next !== null) {
            console.log("\n--- Ваше приключение окончено! ---")
        }
    }
    rl.close()
}

console.clear()
console.log("Добро пожаловать в игру!")
startChat()
