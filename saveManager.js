import fs from 'fs'
import path from 'path'

import { player } from './player.js'
import { currentNodeKey } from './js.js'

// Определим путь к файлу сохранения
const SAVE_DIR = './saves' // Папка для сохранений (создастся автоматически)
const SAVE_FILE_PLAYER = 'player_save.json'
const SAVE_FILE_DIALOGUE = 'dialogue_save.json'

// Убедимся, что директория для сохранений существует
if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR, { recursive: true })
}

const playerSavePath = path.join(SAVE_DIR, SAVE_FILE_PLAYER)
const dialogueSavePath = path.join(SAVE_DIR, SAVE_FILE_DIALOGUE)

export function saveGame() {
    try {
        // Сохраняем данные игрока
        fs.writeFileSync(playerSavePath, JSON.stringify(player, null, 2))

        // Сохраняем текущее состояние диалога
        fs.writeFileSync(dialogueSavePath, JSON.stringify(currentNodeKey, null, 2))

        console.log("\nПрогресс сохранен!")
    } catch (error) {
        console.error("\nОшибка сохранения данных:", error)
        console.log("\nНе удалось сохранить игру. Проверьте права на запись в папку 'saves'.")
    }
}

export function loadGame() {
    let loadedDialogueState = "start" // Начальный узел, если нет сохранения

    try {
        // Загружаем данные игрока
        if (fs.existsSync(playerSavePath)) {
            const savedPlayerData = fs.readFileSync(playerSavePath, 'utf-8')
            const playerData = JSON.parse(savedPlayerData)
            Object.assign(player, playerData)
            console.log("\nДанные игрока загружены.")
        } else {
            console.log("\nСохраненные данные игрока не найдены. Начинаем новую игру.")
        }

        // Загружаем состояние диалога
        if (fs.existsSync(dialogueSavePath)) {
            const savedDialogueStateData = fs.readFileSync(dialogueSavePath, 'utf-8')
            loadedDialogueState = JSON.parse(savedDialogueStateData)
            console.log("\nСостояние диалога загружено.")
        } else {
            console.log("\nСохраненное состояние диалога не найдено. Начинаем с начального узла.")
        }

    } catch (error) {
        console.error("\nОшибка загрузки данных:", error)
        console.log("\nНе удалось загрузить игру. Возможна ошибка в формате сохранения. Начинаем новую игру.")
        loadedDialogueState = "start" // Сбрасываем на начало в случае ошибки
    }

    return loadedDialogueState // Возвращаем загруженное состояние или "start"
}

export function deleteSaveGame() {
    try {
        let deletedSomething = false

        // Удаляем файл данных игрока
        if (fs.existsSync(playerSavePath)) {
            fs.unlinkSync(playerSavePath);
            console.log("\nСохранение данных игрока удалено.")
            deletedSomething = true
        }

        // Удаляем файл состояния диалога
        if (fs.existsSync(dialogueSavePath)) {
            fs.unlinkSync(dialogueSavePath)
            console.log("\nСохранение состояния диалога удалено.")
            deletedSomething = true
        }

        if (deletedSomething) {
            console.log("\nВсе сохранения успешно удалены.")
        } else {
            console.log("\nНет активных сохранений для удаления.")
        }
    } catch (error) {
        console.error("\nОшибка удаления сохранений:", error)
        console.log("\nНе удалось удалить сохранения. Проверьте права на запись в папку 'saves'.")
    }
}