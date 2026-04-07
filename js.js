import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { readFileSync } from 'node:fs'
import { player, showPlayerStatus } from './player.js'
import { nodeHandlers } from './handlers.js'

const rl = readline.createInterface({input, output})


// импорт JSON файла, если не вышло выдает ошибку
let dialogueTree;
try {
    dialogueTree = JSON.parse(readFileSync('./dialogue.JSON', 'utf8'));
} catch (e) {
    console.error("Ошибка: Файл dialogue.JSON не найден или поврежден!");
    process.exit(1);
}


// функция чата
async function startChat() {
    let currentNodeKey = "finalArc"

    // цикл для работы диалогового окна (пока nextNoded не равен null цикл работает)
    while (currentNodeKey !== null) {
        const node = dialogueTree[currentNodeKey]
        if (!node) break

        console.log(`\n-----------------------------------`)
        console.log(node.npc)

        // функция для отображения статуса
        node.options.forEach((opt, idx) => console.log(`${idx + 1}. ${opt.text}`))
        console.log("0. [Посмотреть статус персонажа]")

        const answer = await rl.question('\nВыберите номер: ') // читатель ответа пользоватьеля

        if (answer === "0") {
            showPlayerStatus()
            await rl.question("Нажмите Enter, чтобы вернуться в диалог...")
            console.clear()
            continue
        } // читатель нолика статуса

        const choiceIndex = parseInt(answer) - 1
        const choice = node.options[choiceIndex]

        if (!choice) {
            console.log("Неверный ввод, попробуйте снова.")
            continue
        }

        const next = choice.nextNode;


        //конструкция для работы handlers.js импорт константы из файла
        if (nodeHandlers[next]) {
            const result = await nodeHandlers[next](rl)
            
            //если результат боя поражение, то currentNodeKey не пишем, чтобы цикл сам нчался сначала
            if (result === "retry") {
                console.log("\n[!] Вы погибли... Но таинственная сила вернула вас назад.")
                player.currentHP = player.maxHP
            } else {
                currentNodeKey = result //если победили, то идем дальше по диалоговому джейсон файлу идем
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

//запуск игры
console.clear()
console.log("Добро пожаловать в игру!")
startChat()
