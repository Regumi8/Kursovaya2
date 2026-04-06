import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { readFileSync } from 'node:fs'
import { player, showPlayerStatus } from './player.js'
import { nodeHandlers } from './handlers.js'

const rl = readline.createInterface({input, output})

let dialogueTree;
try {
    dialogueTree = JSON.parse(readFileSync('./dialogue.JSON', 'utf8'));
} catch (e) {
    console.error("Ошибка: Файл dialogue.JSON не найден или поврежден!");
    process.exit(1);
}

// const nodeHandlers = {
//     combatGoblin: async (rl) => (await startBattle(rl, "Гоблин", 70, 10)) ? "afterBattle" : "retry",
    
//     combatChimera: async (rl) => (await startBattle(rl, "Химера", 120, 20)) ? "nextPart" : "retry",
    
//     combatChimera2: async (rl) => {
//         player.currentHP += 200
//         return (await startBattle(rl, "Химера", 400, 40)) ? "back" : "retry"
//     },
    
//     combatGoblinThree: async (rl) => (await startBattle(rl, "Гоблины", 80, 15)) ? "farm3" : "retry",
    
//     combatWolf: async (rl) => (await startBattle(rl, "Лютоволк", 400, 60)) ? "final" : "retry",
    
//     combatTroll: async (rl) => (await startBattle(rl, "Тролль", 1000, 20)) ? "final" : "retry",
    
//     combatStrazh: async (rl) => (await startBattle(rl, "Стражник", 3000, 100)) ? "final" : null,

//     item: async () => { player.hasItem = true; return "item"; },
    
//     weapon: async () => { player.hasWeapon = true; return "weapon"; },
    
//     armor3: async () => { 
//         player.hasArmor = true
//         player.maxHP += 100
//         player.currentHP = player.maxHP
//         return "armor3"
//     },

//     swordByStar: async () => {
//         if (player.counter >= 30 && !player.hasArts) {
//             player.counter -= 30
//             player.hasArts = true
//             console.log("\n[!] Куплен Артефакт для оружия!")
//             return "swordByStar"
//         }
//         return "cityN"
//     },

//     buyArt2: async () => {
//         if (player.counter >= 50 && !player.hasArts2) {
//             player.counter -= 50
//             player.hasArts2 = true
//             player.maxHP += 50;
//             player.currentHP += 50
//             console.log("\n[!] Куплен Артефакт для брони!")
//                         return "buyArt2"
//         }
//         return "buyArt3"
//     },

//     sword12: async () => {
//         if (player.counter >= 200 && !player.hasWeapon) {
//             player.counter -= 200
//             player.hasWeapon = true
//             console.log("\n[!] Куплен Железный Меч!")
//             return "sword12"
//         }
//         return "sword2"
//     }
// }

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
