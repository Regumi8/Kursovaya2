import { startBattle } from './battle.js' //чтобы все работало и изменяющимися переменнымии player, нужно импортировать player.js во все файлы
import { player, applyItemHPBonuses } from './player.js'

export const nodeHandlers = {
    //укороченные функции отдельных боев, получения предметов
    combatGoblin: async (rl) => (await startBattle(rl, "Гоблин", 70, 10)) ? "afterBattle" : "retry",
    
    combatChimera: async (rl) => (await startBattle(rl, "Химера", 120, 20)) ? "nextPart" : "retry",
    
    combatChimera2: async (rl) => {
        player.currentHP += 200
        return (await startBattle(rl, "Матерая Химера", 400, 40)) ? "back" : "retry"
    },
    
    combatGoblinThree: async (rl) => (await startBattle(rl, "Гоблины", 80, 15)) ? "farm3" : "retry",
    
    combatWolf: async (rl) => (await startBattle(rl, "Лютоволк", 400, 60)) ? "finalArc" : "retry",
    
    combatTroll: async (rl) => (await startBattle(rl, "Тролль", 1000, 20)) ? "finalArc" : "retry",

    combatWolf1: async (rl) => (await startBattle(rl, "Лютоволк", 400, 60)) ? "finalArc" : "retry",
    
    combatTroll1: async (rl) => (await startBattle(rl, "Тролль", 1000, 20)) ? "finalArc" : "retry",
    
    combatStrazh: async (rl) => (await startBattle(rl, "Стражник", 3000, 100)) ? "finalArc" : null,

    combatGolem: async (rl) => (await startBattle(rl, "Голем", 1000, 25)) ? "farm3" : "retry",

    combatGoblinThree: async (rl) => (await startBattle(rl, "Хобгоблин", 500, 30)) ? "farm3" : "retry",

    startBattleEternalGuardian: async (rl) => (await startBattle(rl, "Вечный Страж", 4000, 70)) ? "afterBattleEternalGuardian" : "retry",

    startBattleAbyssalKnight: async (rl) => (await startBattle(rl, "Рыцарь Бездны", 6000, 55)) ? "afterBattleAbyssalKnight" : "retry",

    startBattleFinalBoss: async (rl) => {
        console.log("\n[!!!] ВНИМАНИЕ: ФИНАЛЬНАЯ БИТВА [!!!]")
        const win = await startBattle(rl, "Повелитель Тумана", 10000, 110)
        return win ? "afterBattleFinalBoss" : "retry"
    },

    back2: async () => { player.hasWeapon = false; return "back2"; },

    item: async () => { player.hasItem = true; return "item"; },
    
    weapon: async () => { player.hasWeapon = true; return "weapon"; },

    //функция проверки снаряжения перед битвой с боссом
    guardian: async () => {if (player.hasBlessedSword && player.hasPlateArmor && player.hasSoulStone){
            return "guardian"
        } else {
            console.log("\n=============================\nВы не справитесь с боссом с текущим снаряжением, приобретите его у Векса\n=============================")
            return "vexShop"
        }
    },
    
    //функции характеристик предметов и их влияния на игрока

    armor3: async () => { 
        player.hasArmor = true
        applyItemHPBonuses()
        return "armor3"
    },

    kulonAbyssalKnights: async () => {
        player.hasArts3 = true
        applyItemHPBonuses()
        return "kulonAbyssalKnights"
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
            applyItemHPBonuses()
            console.log("\n[!] Куплен Браслет исцеления!")
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
        } else {
            console.log("\n[!] Недостаточно монет!")
            return "sword1"
        }
    },

    farm8: async () => {
        if (player.counter >= 500 && !player.hasArmor) {
            player.counter -= 500
            player.hasArmor = true
            applyItemHPBonuses()
            console.log("\n[!] Куплена Броня Химеры!")
            return "farm8"
        }
        console.log("\n[!] Недостаточно монет!")
        return "sword2"
    },

    farm6: async () => {
        player.counter += 400
        console.log("Награда за охоту 400 монет")
        return "farm6"
    },

    newQuest: async () => {
        player.counter += 800
        console.log("Награда за охоту 800 монет")
        return "newQuest"
    },

    buyPlateArmor: async () => {
        let cost = 300
        if (player.counter >= cost && !player.hasPlateArmor) {
            player.counter -= cost
            
            // Логика замены:
            if (player.hasArmor) {
                console.log("\n=============================\n[!] Вы обмениваете Броню Химеры на Пластинчатый Доспех!\n=============================")
                player.hasArmor = false
                player.hasPlateArmor = true
                applyItemHPBonuses()
            } else { 
                player.hasPlateArmor = true
                applyItemHPBonuses()
                console.log("\n=============================\n[!] Вы получили Пластинчатый Доспех!\n=============================")
            }
            
            console.log(`Осталось монет: ${player.counter}`)
            return "buyPlateArmor"
            
        } else if (player.hasPlateArmor) {
            console.log("\n=============================\nУ вас уже есть Пластинчатый Доспех\n=============================")
            return "vexShop"
        } else if(player.counter < cost) {
            console.log(`\n=============================\n[!] Недостаточно монет! Нужно ${cost}, у вас ${player.counter}.\n=============================`)
            console.log("Векс сжалился над вами и дал снаряжение бесплатно, вы ж герой")
            cost = 0
            player.hasPlateArmor = true
            applyItemHPBonuses()
            return "vexShop"
        }
    },

    buyBlessedSword: async () => {
        let cost = 250
        if (player.counter >= cost && !player.hasBlessedSword) {
            player.counter -= cost
            
            // Логика замены:
            if (player.hasWeapon) {
                console.log("\n=============================\n[!] Вы обмениваете Железный Меч на Благословенный Меч!\n=============================")
                player.hasWeapon = false
                player.hasBlessedSword = true
            } else { 
                player.hasBlessedSword = true
                console.log("\n=============================\n[!] Вы получили Благословенный Меч!\n=============================")
            }
            
            console.log(`Осталось монет: ${player.counter}`)
            return "buyBlessedSword"
        
        } else if (player.hasBlessedSword) {
            console.log("\n=============================\nУ вас уже есть Благословенный Меч\n=============================")
            return "vexShop"
        } else if (player.counter < cost) {
            console.log(`\n=============================\n[!] Недостаточно монет! Нужно ${cost}, у вас ${player.counter}.\n=============================`)
            console.log("Векс сжалился над вами и дал снаряжение бесплатно, вы ж герой")
            cost = 0
            player.hasBlessedSword = true
            return "vexShop"
        }
    },

    buySoulStone: async () => {
        let cost = 200
        if (player.counter >= cost && !player.hasSoulStone) {
            player.counter -= cost
            
            // Логика замены:
            if (player.hasItem) {
                console.log("\n=============================\n[!] Вы обмениваете Амулет Крита на Камень Душ!\n=============================")
                player.hasItem = false
                player.hasSoulStone = true
            } else {
                player.hasSoulStone = true
                console.log("\n=============================\n[!] Вы получили Камень Душ!\n=============================")
            }
            
            console.log(`Осталось монет: ${player.counter}`)
            return "buySoulStone"
            
        } else if (player.hasSoulStone) {
            console.log("\n=============================\nУ вас уже есть Камень Душ>\n=============================")
            return "vexShop"
        } else if (player.counter < cost) {
            console.log(`\n=============================\n[!] Недостаточно монет! Нужно ${cost}, у вас ${player.counter}.\n=============================`)
            console.log("Векс сжалился над вами и дал снаряжение бесплатно, вы ж герой")
            cost = 0
            player.hasSoulStone = true
            return "vexShop"
        }
    },
}
