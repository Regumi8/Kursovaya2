import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import path from 'node:path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { player, showPlayerStatus, applyItemHPBonuses, showInventory } from './player.js'
import { nodeHandlers } from './handlers.js'
import { saveGame, loadGame, deleteSaveGame } from './saveManager.js'
import { helper } from './bat.js'
import { dungeonHandlers } from './dangHand.js'

const allHandlers = {
    ...nodeHandlers,
    ...dungeonHandlers
}

const rl = readline.createInterface({input, output})

// импорт JSON файлов, если не вышло выдает ошибку
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const dialoguePath = path.join(dirname, 'dialogue.json')
const dungeonArcPath = path.join(dirname, 'dungeonArc.json')

let dialogueTree

try {
    // Читаем основной файл диалогов
    const dialogueRaw = fs.readFileSync(dialoguePath, 'utf-8')
    const mainTree = JSON.parse(dialogueRaw)

    // Читаем файл с подземельем
    const dungeonArcRaw = fs.readFileSync(dungeonArcPath, 'utf-8')
    const dungeonData = JSON.parse(dungeonArcRaw)

    // Объединяем данные. Ключи из dungeonArcData перезапишут совпадающие из mainTree.
    dialogueTree = { ...mainTree, ...dungeonData }

    console.log("✅ Файлы диалогов успешно загружены и объединены.")
} catch (error) {
    console.error(`\n❌ ОШИБКА ЗАГРУЗКИ JSON:`)
    console.error(`Не удалось найти или прочитать файлы.`)
    console.error(`Проверьте пути и названия файлов:`)
    console.error(`dialogue.json: ${dialoguePath}`)
    console.error(`dungeonArc.json: ${dungeonArcPath}`)
    console.error(`Подробности ошибки: ${error.message}`)
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

        let availableOptions = node.options

        // Проверяем, есть ли у опций условия
        if (node.options.some(opt => opt.condition)) {
            availableOptions = node.options.filter(opt => {
                if (!opt.condition) return true
                
                try {
                    // Создаём локальную переменную completedPaths
                    const completedPaths = player.completedPaths || []
                    // Создаём функцию, которая использует эту переменную
                    const conditionFn = new Function('completedPaths', 'return ' + opt.condition)
                    const result = conditionFn(completedPaths)
                    return result
                } catch(e) {
                    console.log(`Ошибка в условии: ${opt.condition}`)
                    return true
                }
            })
        }

        availableOptions.forEach((opt, idx) => console.log(`${idx + 1}. ${opt.text}`))

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
        const choice = availableOptions[choiceIndex]

        if (!choice) {
            console.log("Неверный ввод, попробуйте снова.")
            continue
        }

        const next = choice.nextNode

        //конструкция для работы handlers.js импорт константы из файла
        if (allHandlers[next]) {
            console.log(`✅ Найден обработчик для: "${next}"`);
            const result = await allHandlers[next](rl)
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

//запуск игры
console.clear()
startChat()