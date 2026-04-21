//информация об игроке
export const player = {
    name: "Искатель приключений",
    baseHP: 5000,
    maxHP: 5000,
    currentHP: 5000,
    healCounter: 0,
    counter: 0,
    inventory: [],
    completedPaths: [],
    hasItem: false,
    hasSoulStone: true,
    hasWeapon: false,
    hasBlessedSword: true,
    hasArts: true,
    hasArts2: true,
    hasArts3: true,
    hasArmor: false,
    hasPlateArmor: true,
    description: "Вы — путник в поношенном плаще, ищущий славы в землях города N."
}

// Функция для применения бонусов ХП от предметов
export function applyItemHPBonuses() {
    let bonusHP = 0

    player.maxHP = player.baseHP

    // Пластинчатый Доспех (заменяет Броню Химеры)
    if (player.hasPlateArmor) {
        bonusHP += 350
    } else if (player.hasArmor) {
        bonusHP += 100
    }
    // Браслет исцеления
    if (player.hasArts2) {
        bonusHP += 50
    }
    //предмет с босса
    if (player.hasArts3) {
        bonusHP += 200
    }

    player.maxHP += bonusHP
    player.currentHP += bonusHP
}

// функция для отрисовки и изменения урона
export function calculatePlayerDamage() {
    let totalDamage = 100

    // Оружие
    if (player.hasBlessedSword) {
        totalDamage += 50
    } else if (player.hasWeapon) {
        totalDamage += 10
    }

    // Артефакты, которые складываются
    if (player.hasArts) {
        totalDamage += 5
    }
    if (player.hasArts3) { 
        totalDamage += 30
    }

    return totalDamage
}

//функция отрисовки инвентаря
export function showInventory() {
    console.log("\n═══════════════════════════════════════════════")
    console.log("                  ИНВЕНТАРЬ")
    console.log("═══════════════════════════════════════════════\n")

    // ОРУЖИЕ
    console.log("【 ОРУЖИЕ 】")
    if (player.hasBlessedSword) {
        console.log("  • Благословенный Меч (+50 урон)")
    } else if (player.hasWeapon) {
        console.log("  • Железный меч (+10 урон)")
    } else {
        console.log("  • [Пусто]")
    }

    // БРОНЯ
    console.log("\n【 БРОНЯ 】")
    if (player.hasPlateArmor) {
        console.log("  • Пластинчатый Доспех (+350 ХП, защита +50)")
    } else if (player.hasArmor) {
        console.log("  • Броня Химеры (+100 ХП)")
    } else {
        console.log("  • [Пусто]")
    }

    // ПРЕДМЕТЫ УСИЛЕНИЯ
    console.log("\n【 ПРЕДМЕТЫ УСИЛЕНИЯ 】")
    if (player.hasSoulStone) {
        console.log("  • Камень Душ (шанс крита 75%)")
    } else if (player.hasItem) {
        console.log("  • Амулет Крита (шанс крита 50%)")
    } else {
        console.log("  • [Пусто]")
    }

    // АРТЕФАКТЫ
    console.log("\n【 АРТЕФАКТЫ 】")
    console.log(`  • ${player.hasArts ? "Огненная гарда (+5 урон)" : "[Пусто]"}`)

    // АКСЕССУАРЫ
    console.log("\n【 АКСЕССУАРЫ 】")
    const accessories = []
    if (player.hasArts2) accessories.push("Браслет исцеления (+50 ХП, +50 лечение)")
    if (player.hasArts3) accessories.push("Ожерелье Рыцаря Бездны (+200 ХП, +30 лечение, +30 урон)")
    if (accessories.length > 0) {
        accessories.forEach(item => console.log(`  • ${item}`))
    } else {
        console.log("  • [Пусто]")
    }

    // КВЕСТОВЫЕ ПРЕДМЕТЫ
    console.log("\n【 КВЕСТОВЫЕ ПРЕДМЕТЫ 】")
    if (player.inventory && Array.isArray(player.inventory) && player.inventory.length > 0) {
        player.inventory.forEach(item => {
            console.log(`  • ${item}`)
        })
    } else {
        console.log("  • [Пусто]")
    }

    console.log("\n═══════════════════════════════════════════════")
}

//функция отрисовки статуса игрока
export function showPlayerStatus() {
    const currentTotalDamage = calculatePlayerDamage()
    
    console.log("\n═══════════════════════════════════════════════")
    console.log("                  СТАТУС ПЕРСОНАЖА")
    console.log("═══════════════════════════════════════════════\n")
    
    console.log(`【 ИМЯ 】`)
    console.log(`  • ${player.name}`)
    
    console.log(`\n【 ЗДОРОВЬЕ 】`)
    console.log(`  • ${player.currentHP} / ${player.maxHP} HP`)
    
    // Визуальная полоска здоровья
    const healthPercent = (player.currentHP / player.maxHP) * 100
    const barLength = 20
    const filledLength = Math.round(barLength * healthPercent / 100)
    const emptyLength = barLength - filledLength
    const healthBar = "█".repeat(filledLength) + "░".repeat(emptyLength)
    console.log(`  • [${healthBar}] ${Math.round(healthPercent)}%`)
    
    console.log(`\n【 УРОН 】`)
    console.log(`  • ${currentTotalDamage} (без учёта критических ударов)`)
    
    console.log(`\n【 МОНЕТЫ 】`)
    console.log(`  • ${player.counter} золотых`)
    
    console.log(`\n【 ОПИСАНИЕ 】`)
    console.log(`  • ${player.description}`)
    
    console.log("\n═══════════════════════════════════════════════")
}
