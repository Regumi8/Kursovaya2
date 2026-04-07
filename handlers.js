import { startBattle } from './battle.js' //чтобы все работало и изменяющимися переменнымии player, нужно импортировать player.js во все файлы
import { player } from './player.js'

export const nodeHandlers = {
    //укороченные функции отдельных боев, получения предметов
    combatGoblin: async (rl) => (await startBattle(rl, "Гоблин", 70, 10)) ? "afterBattle" : "retry",
    
    combatChimera: async (rl) => (await startBattle(rl, "Химера", 120, 20)) ? "nextPart" : "retry",
    
    combatChimera2: async (rl) => {
        player.currentHP += 200
        return (await startBattle(rl, "Матерая Химера", 400, 40)) ? "back" : "retry"
    },
    
    combatGoblinThree: async (rl) => (await startBattle(rl, "Гоблины", 80, 15)) ? "farm3" : "retry",
    
    combatWolf: async (rl) => (await startBattle(rl, "Лютоволк", 400, 60)) ? "final" : "retry",
    
    combatTroll: async (rl) => (await startBattle(rl, "Тролль", 1000, 20)) ? "final" : "retry",

    combatWolf1: async (rl) => {
        player.currentHP = player.maxHP
        (await startBattle(rl, "Лютоволк", 400, 60)) ? "final" : "retry"

    },
    
    combatTroll1: async (rl) => {
        player.currentHP = player.maxHP
        (await startBattle(rl, "Тролль", 1000, 20)) ? "final" : "retry"

    },
    
    combatStrazh: async (rl) => (await startBattle(rl, "Стражник", 3000, 100)) ? "final" : null,

    combatGolem: async (rl) => {
        player.currentHP = player.maxHP
        (await startBattle(rl, "Голем", 1000, 25)) ? "farm3" : "retry"
    },

    combatGoblinThree: async (rl) => {
        player.currentHP = player.maxHP
        (await startBattle(rl, "Хобгоблин", 500, 30)) ? "farm3" : "retry"

    },

    item: async () => { player.hasItem = true; return "item"; },
    
    weapon: async () => { player.hasWeapon = true; return "weapon"; },
    
    //функции характеристик предметов и их влияния на игрока
    armor3: async () => { 
        player.hasArmor = true
        player.maxHP += 100
        player.currentHP = player.maxHP
        return "armor3"
    },

    // функции покупки снаряжения
    swordByStar: async () => {
        if (player.counter >= 30 && !player.hasArts) {
            player.counter -= 30
            player.hasArts = true
            console.log("\n[!] Куплен Артефакт для оружия!")
            return "swordByStar"
        }
        console.log("\n[!] Недостаточно монет!")
        return "item2"
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
        console.log("\n[!] Недостаточно монет!")
        return "buyArt"
    },

    sword12: async () => {
        if (player.counter >= 200 && !player.hasWeapon) {
            player.counter -= 200
            player.hasWeapon = true
            console.log("\n[!] Куплен Железный Меч!")
            return "sword12"
        }
        console.log("\n[!] Недостаточно монет!")
        return "sword1"
    },

    farm8: async () => {
        if (player.counter >= 500 && !player.hasArmor) {
            player.counter -= 500
            player.hasArmor = true
            console.log("\n[!] Куплена броня!")
            return "farm8"
        }
        console.log("\n[!] Недостаточно монет!")
        return "sword2"
    },

    farm6: async () => {
        player.counter += 400
        console.log("Награда за охоту 400 монет")
        return "farm6"
    }
}
