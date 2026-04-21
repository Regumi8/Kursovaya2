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
            
            const hubHandler = nodeHandlers.dungeon_hub_1 || dungeonHandlers?.dungeon_hub_1
            if (hubHandler) {
                return await hubHandler(rl)
            }
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
            
            const hubHandler = nodeHandlers.dungeon_hub_1 || dungeonHandlers?.dungeon_hub_1
            if (hubHandler) {
                return await hubHandler(rl)
            }
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
            
            const hubHandler = nodeHandlers.dungeon_hub_2 || dungeonHandlers?.dungeon_hub_2
            if (hubHandler) {
                return await hubHandler(rl)
            }
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
            
            const hubHandler = nodeHandlers.dungeon_hub_2 || dungeonHandlers?.dungeon_hub_2
            if (hubHandler) {
                return await hubHandler(rl)
            }
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
            
            const hubHandler = nodeHandlers.dungeon_hub_3 || dungeonHandlers?.dungeon_hub_3
            if (hubHandler) {
                return await hubHandler(rl)
            }
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
            
            const hubHandler = nodeHandlers.dungeon_hub_3 || dungeonHandlers?.dungeon_hub_3
            if (hubHandler) {
                return await hubHandler(rl)
            }
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
    },

    dungeon_hub_1: async (rl) => {
        console.log("🔍 Пройденные пути (1 этаж):", player.completedPaths);
        console.log("\n[ЭТАЖ 1] Вы в центральном зале. Куда пойдем?");
        
        const options = [];
        
        // Прямо — только если путь ещё не пройден
        if (!player.completedPaths?.includes('floor1_straight')) {
            options.push({ text: "Прямо", nextNode: "f1_s_b1" });
        } else {
            console.log("  🚫 Прямо (уже пройдено)");
        }
        
        // Направо — только если путь ещё не пройден
        if (!player.completedPaths?.includes('floor1_right')) {
            options.push({ text: "Направо", nextNode: "checkKey1" });
        } else {
            console.log("  🚫 Направо (уже пройдено)");
        }
        
        // Налево — только если путь ещё не пройден
        if (!player.completedPaths?.includes('floor1_left')) {
            options.push({ text: "Налево", nextNode: "f1_l_b1" });
        } else {
            console.log("  🚫 Налево (уже пройдено)");
        }
        
        // Если все пути пройдены
        if (options.length === 0) {
            console.log("\n✨ Все пути на этом этаже пройдены! Пора двигаться дальше.");
            return "floor_2_start";
        }
        
        options.forEach((opt, idx) => console.log(`${idx + 1}. ${opt.text}`));
        
        const answer = await rl.question('\nВыберите номер: ');
        const choiceIndex = parseInt(answer, 10) - 1;
        
        if (options[choiceIndex]) {
            return options[choiceIndex].nextNode;
        }
        
        console.log("❌ Неверный выбор.");
        return "dungeon_hub_1";
    },

    dungeon_hub_2: async (rl) => {
        console.log("🔍 Пройденные пути (2 этаж):", player.completedPaths);
        console.log("\n[ЭТАЖ 2] Вы в центральном зале. Куда пойдем?");
        
        const options = [];
        
        if (!player.completedPaths?.includes('floor2_straight')) {
            options.push({ text: "Прямо", nextNode: "f2_s_b1" });
        } else {
            console.log("  🚫 Прямо (уже пройдено)");
        }
        
        if (!player.completedPaths?.includes('floor2_right')) {
            options.push({ text: "Направо", nextNode: "checkKey2" });
        } else {
            console.log("  🚫 Направо (уже пройдено)");
        }
        
        if (!player.completedPaths?.includes('floor2_left')) {
            options.push({ text: "Налево", nextNode: "f2_l_b1" });
        } else {
            console.log("  🚫 Налево (уже пройдено)");
        }
        
        if (options.length === 0) {
            console.log("\n✨ Все пути на этом этаже пройдены! Пора двигаться дальше.");
            return "floor_3_start";
        }
        
        options.forEach((opt, idx) => console.log(`${idx + 1}. ${opt.text}`));
        
        const answer = await rl.question('\nВыберите номер: ');
        const choiceIndex = parseInt(answer, 10) - 1;
        
        if (options[choiceIndex]) {
            return options[choiceIndex].nextNode;
        }
        
        console.log("❌ Неверный выбор.");
        return "dungeon_hub_2";
    },

    dungeon_hub_3: async (rl) => {
        console.log("🔍 Пройденные пути (3 этаж):", player.completedPaths);
        console.log("\n[ЭТАЖ 3] Вы в центральном зале. Куда пойдем?");
        
        const options = [];
        
        if (!player.completedPaths?.includes('floor3_straight')) {
            options.push({ text: "Прямо", nextNode: "f3_s_b1" });
        } else {
            console.log("  🚫 Прямо (уже пройдено)");
        }
        
        if (!player.completedPaths?.includes('floor3_right')) {
            options.push({ text: "Направо", nextNode: "checkKey3" });
        } else {
            console.log("  🚫 Направо (уже пройдено)");
        }
        
        if (!player.completedPaths?.includes('floor3_left')) {
            options.push({ text: "Налево", nextNode: "f3_l_b1" });
        } else {
            console.log("  🚫 Налево (уже пройдено)");
        }
        
        if (options.length === 0) {
            console.log("\n✨ Все пути на этом этаже пройдены! Пора двигаться к финальному боссу.");
            return "talkWithGuardian";
        }
        
        options.forEach((opt, idx) => console.log(`${idx + 1}. ${opt.text}`));
        
        const answer = await rl.question('\nВыберите номер: ');
        const choiceIndex = parseInt(answer, 10) - 1;
        
        if (options[choiceIndex]) {
            return options[choiceIndex].nextNode;
        }
        
        console.log("❌ Неверный выбор.");
        return "dungeon_hub_3";
    },
}