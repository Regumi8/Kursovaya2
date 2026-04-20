import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { readFileSync } from 'node:fs'
import { player, showPlayerStatus, applyItemHPBonuses, showInventory } from './player.js'
import { nodeHandlers } from './handlers.js'
import { saveGame, loadGame, deleteSaveGame } from './saveManager.js'
import { helper } from './bat.js'

const rl = readline.createInterface({input, output})

// импорт JSON файла, если не вышло выдает ошибку
let dialogueTree
try {
    dialogueTree = JSON.parse(readFileSync('./dialogue.JSON', 'utf8'))
} catch (e) {
    console.error("Ошибка: Файл dialogue.JSON не найден или поврежден!")
    process.exit(1)
}

export let currentNodeKey

// функция чата
async function startChat() {

    applyItemHPBonuses()
    currentNodeKey = loadGame()

    // цикл для работы диалогового окна (пока nextNoded не равен null цикл работает)
    while (currentNodeKey !== null) {
        if (player.healCounter > 0) {
            player.healCounter -= 1
        }

        const node = dialogueTree[currentNodeKey]
        if (!node) {
            console.error(`Узел диалога "${currentNodeKey}" не найден!`)
            break
        }

        console.log(`\n-----------------------------------`)
        console.log(node.npc)

        node.options.forEach((opt, idx) => console.log(`${idx + 1}. ${opt.text}`))

        const answer = await rl.question('\nВыберите номер: ') // читатель ответа пользоватьеля

        // Обработка команд
        if (answer.toLowerCase() === 'exit') {
            console.log("\nВы решили покинуть игру. Сохраняем прогресс...")
            saveGame() // Сохраняем перед выходом
            rl.close() // Закрываем readline
            process.exit(0) // Завершаем процесс Node.js
        } else if (answer === '0') {
            showPlayerStatus()
            await rl.question("\nНажмите Enter, чтобы вернуться в диалог...")
            console.clear()
            continue
        } else if (answer.toLowerCase() === 'i') {
            showInventory()
            await rl.question("\nНажмите Enter, чтобы вернуться в диалог...")
            console.clear()
            continue
        } else if (answer.toLowerCase() === 'save') { // Команда сохранения
            saveGame()
            await rl.question("\nИгра сохранена. Нажмите Enter, чтобы продолжить...")
            console.clear()
            continue
        } else if (answer.toLowerCase() === 'help') {
            helper()
            await rl.question("\nНажмите Enter, чтобы вернуться в диалог...")
            console.clear()
            continue
        } else if (answer.toLowerCase() === 'delete') { //Обработка команды удаления
            console.log("\nВы уверены, что хотите удалить все сохранения? Это действие необратимо.")
            const confirm = await rl.question("Введите 'yes' для подтверждения или любой другой текст для отмены: ")
            
            if (confirm.toLowerCase() === 'yes') {
                deleteSaveGame() // Вызываем функцию удаления
                // После удаления сохранений, игра должна начаться с чистого листа.
                console.log("\nИгра будет перезапущена с начала.")
                currentNodeKey = "start" // Сбрасываем текущий узел на начальный
            } else {
                console.log("\nУдаление сохранений отменено.")
            }
            await rl.question("\nНажмите Enter, чтобы продолжить...")
            console.clear()
            continue // Возвращаемся к выбору опций на текущем узле
        }

        const choiceIndex = parseInt(answer, 10) - 1
        const choice = node.options[choiceIndex]

        if (!choice) {
            console.log("Неверный ввод, попробуйте снова.")
            continue
        }

        const next = choice.nextNode


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
startChat()