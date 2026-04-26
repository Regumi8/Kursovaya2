import { player } from './player.js'
import { startBattle } from './battle.js'
import { nodeHandlers } from './handlers.js'

//универсальная функция для получения предметов в инвентарь
export function addItem(itemName) {   
    if (!player.inventory) {
        console.log("player.inventory не существовал, создаю новый массив")
        player.inventory = []
    }
    
    if (!player.inventory.includes(itemName)) {
        player.inventory.push(itemName)
        console.log(`[+] В инвентарь добавлен: ${itemName}`)
    } else {
        console.log(`[!] У вас уже есть: ${itemName}`)
    }
}

export function markPathCompleted(pathName) {
    if (!player.completedPaths) {
        player.completedPaths = []
    }
    if (!player.completedPaths.includes(pathName)) {
        player.completedPaths.push(pathName)
    }
}

// Функция для проверки, пройден ли путь
export function isPathCompleted(pathName) {
    if (!player.completedPaths) return false;
    return player.completedPaths.includes(pathName);
}

export const dungeonHandlers = {

    fight_rat: async (rl) => {
        const won = await startBattle(rl, "Чумная крыса", 400, 80)
        if (won) {
            return "f1_s_b2"
        }
        return "retry"
    },

    fight_skeleton: async (rl) => {
        const won = await startBattle(rl, "Скелет-дозорный", 350, 160)
        if (won) {
            console.log("🔑 Вы победили скелета и нашли Ржавый ключ!")
            addItem("Ржавый ключ")
            markPathCompleted("floor1_straight")
            return "dungeon_hub_1"
        }
        return "retry"
    },

    fight_ghoul: async (rl) => {
        const won = await startBattle(rl, "Голодный Гуль", 700, 70)
        if (won) {
            return "f1_r_b2"
        }
        return "retry"
    },

    fight_zombie: async (rl) => {
        const won = await startBattle(rl, "Гниющий Зомби", 600, 30)
        if (won) {
            console.log("✨ Вы нашли Магическую сферу!")
            addItem("Магическая сфера")
            markPathCompleted("floor1_right")
            return "dungeon_hub_1"
        }
        return "retry"
    },

    fight_slime: async (rl) => {
        const won = await startBattle(rl, "Скользкая слизь", 300, 10)
        if (won) {
            return "f1_l_b2"
        }
        return "retry"
    },

    fight_ghost: async (rl) => {
        const won = await startBattle(rl, "Призрак", 250, 90)
        if (won) {
            markPathCompleted("floor1_left")
            return "checkOrb"
        }
        return "retry"
    },

    fight_goblin_s: async (rl) => {
        const won = await startBattle(rl, "Гоблин-разведчик", 400, 30)
        if (won) {
            return "f2_s_b2"
        }
        return "retry"
    },

    fight_goblin_w: async (rl) => {
        const won = await startBattle(rl, "Гоблин-воитель", 800, 50)
        if (won) {
            console.log("🔑 Вы победили гоблина-воителя и нашли Серебряный ключ!")
            addItem("Серебряный ключ")
            markPathCompleted("floor2_straight")
            return "dungeon_hub_2"
        }
        return "retry"
    },

    fight_orc_p: async (rl) => {
        const won = await startBattle(rl, "Орк-пехотинец", 800, 50)
        if (won) {
            return "f2_r_b2"
        }
        return "retry"
    },

    fight_orc_sh: async (rl) => {
        const won = await startBattle(rl, "Орк-шаман", 500, 70)
        if (won) {
            console.log("📿 Вы нашли Древний амулет!")
            addItem("Древний амулет")
            markPathCompleted("floor2_right")
            return "dungeon_hub_2"
        }
        return "retry"
    },

    fight_hobgoblin: async (rl) => {
        const won = await startBattle(rl, "Хобгоблин", 1000, 100)
        if (won) {
            return "f2_l_b2"
        }
        return "retry"
    },

    fight_troll: async (rl) => {
        const won = await startBattle(rl, "Пещерный тролль", 1500, 70)
        if (won) {
            markPathCompleted("floor2_left")
            return "checkAmulet"
        }
        return "retry"
    },

    fight_demon_l: async (rl) => {
        const won = await startBattle(rl, "Низший демон", 3500, 100)
        if (won) {
            return "f3_s_b2"
        }
        return "retry"
    },

    fight_abyss_k: async (rl) => {
        const won = await startBattle(rl, "Маг бездны", 1000, 150)
        if (won) {
            console.log("🔑 Вы победили Мага бездны и нашли Золотой ключ!")
            addItem("Золотой ключ")
            markPathCompleted("floor3_straight")
            return "dungeon_hub_3"
        }
        return "retry"
    },

    fight_gargoyle: async (rl) => {
        const won = await startBattle(rl, "Горгулья", 1200, 120)
        if (won) {
            return "f3_r_b2"
        }
        return "retry"
    },

    fight_golem: async (rl) => {
        const won = await startBattle(rl, "Каменный Голем", 5000, 30)
        if (won) {
            console.log("👑 Вы нашли Корону Теней!")
            addItem("Корона Теней")
            markPathCompleted("floor3_right")
            return "dungeon_hub_3"
        }
        return "retry"
    },

    fight_shadow: async (rl) => {
        const won = await startBattle(rl, "Теневой охотник", 700, 150)
        if (won) {
            return "talkWithGuardian"
        }
        return "retry"
    },

    fight_guardian: async (rl) => {
        const won = await startBattle(rl, "Хранитель Разлома", 2000, 150)
        if (won) {
            markPathCompleted("floor3_left")
            return "final_victory_scene"
        }
        return "retry"
    }
}