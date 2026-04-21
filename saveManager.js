import fs from 'fs'
import path from 'path'

import { player } from './player.js'
import { currentNodeKey } from './js.js'

// Определим пути к файлам сохранения
const SAVE_DIR = './saves' // Папка для сохранений
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
        // Убеждаемся, что completedPaths существует перед сохранением
        if (!player.completedPaths) {
            player.completedPaths = []
        }

        // Сохраняем данные игрока
        const playerDataToSave = {
            ...player,
            completedPaths: player.completedPaths
        }
        fs.writeFileSync(playerSavePath, JSON.stringify(playerDataToSave, null, 2))

        // Сохраняем текущее состояние диалога
        fs.writeFileSync(dialogueSavePath, JSON.stringify(currentNodeKey, null, 2))

        console.log("\n✅ Прогресс сохранен!")
    } catch (error) {
        console.error("\n❌ Ошибка сохранения данных:", error)
        console.log("\nНе удалось сохранить игру. Проверьте права на запись в папку 'saves'.")
    }
}

export function loadGame() {
    let loadedDialogueState = "start"

    try {
        // Загружаем данные игрока
        if (fs.existsSync(playerSavePath)) {
            const savedPlayerData = fs.readFileSync(playerSavePath, 'utf-8')
            const playerData = JSON.parse(savedPlayerData)
            
            // Восстанавливаем все поля игрока
            Object.assign(player, playerData)
            
            // Убеждаемся, что completedPaths загрузился
            if (!player.completedPaths) {
                player.completedPaths = []
            }
            
            console.log("\n✅ Данные игрока загружены.")
        } else {
            // НЕТ СОХРАНЕНИЯ → ПОЛНЫЙ СБРОС
            resetPlayerState()
            console.log("\n📁 Сохраненные данные игрока не найдены. Начинаем новую игру.")
        }

        // Загружаем состояние диалога
        if (fs.existsSync(dialogueSavePath)) {
            const savedDialogueStateData = fs.readFileSync(dialogueSavePath, 'utf-8')
            loadedDialogueState = JSON.parse(savedDialogueStateData)
            console.log("✅ Состояние диалога загружено.")
        } else {
            console.log("📁 Сохраненное состояние диалога не найдено. Начинаем с начального узла.")
        }

    } catch (error) {
        console.error("\n❌ Ошибка загрузки данных:", error)
        console.log("\nНе удалось загрузить игру. Начинаем новую игру.")
        loadedDialogueState = "start"
        // ПРИ ОШИБКЕ ТОЖЕ ПОЛНЫЙ СБРОС
        resetPlayerState()
    }

    return loadedDialogueState
}

// Функция сброса состояния игрока к начальному
export function resetPlayerState() {
    // Полный сброс ВСЕХ полей игрока
    player.name = "Искатель приключений"
    player.baseHP = 500
    player.maxHP = 500
    player.currentHP = 500
    player.healCounter = 0
    player.counter = 0
    player.inventory = []
    player.completedPaths = []
    player.hasItem = false
    player.hasSoulStone = true
    player.hasWeapon = false
    player.hasBlessedSword = true
    player.hasArts = true
    player.hasArts2 = true
    player.hasArts3 = true
    player.hasArmor = false
    player.hasPlateArmor = true
    player.description = "Вы — путник в поношенном плаще, ищущий славы в землях города N."
    
    console.log("\n🔄 Состояние игрока сброшено к начальному.")
}

export function deleteSaveGame() {
    try {
        let deletedSomething = false

        // Удаляем файл данных игрока
        if (fs.existsSync(playerSavePath)) {
            fs.unlinkSync(playerSavePath)
            console.log("\n🗑️ Сохранение данных игрока удалено.")
            deletedSomething = true
        }

        // Удаляем файл состояния диалога
        if (fs.existsSync(dialogueSavePath)) {
            fs.unlinkSync(dialogueSavePath)
            console.log("🗑️ Сохранение состояния диалога удалено.")
            deletedSomething = true
        }

        // Сбрасываем состояние игрока в памяти
        if (deletedSomething) {
            resetPlayerState()
            console.log("\n✅ Все сохранения успешно удалены. Прогресс сброшен.")
        } else {
            console.log("\n📁 Нет активных сохранений для удаления.")
        }
    } catch (error) {
        console.error("\n❌ Ошибка удаления сохранений:", error)
        console.log("\nНе удалось удалить сохранения. Проверьте права на запись в папку 'saves'.")
    }
}