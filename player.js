//информация об игроке
export const player = {
    name: "Искатель приключений",
    baseHP: 500,
    maxHP: 500,
    currentHP: 500,
    healCounter: 0,
    counter: 0,
    hasItem: false,
    hasSoulStone: false,
    hasWeapon: false,
    hasBlessedSword: false,
    hasArts: false,
    hasArts2: false,
    hasArts3: false,
    hasArmor: false,
    hasPlateArmor: false,
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
    let totalDamage = 10

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

export function showInventory() {
    console.log("\n===== ИНВЕНТАРЬ =====")

    // оружие
    if (player.hasBlessedSword) {
        console.log(`ОРУЖИЕ: Благословенный Меч (+50 урон)`)
    } else if (player.hasWeapon) {
        console.log(`ОРУЖИЕ: Железный меч (+10 урон)`)
    } else {
        console.log(`ОРУЖИЕ: Пусто`)
    }

    //броня
    if (player.hasPlateArmor) {
        console.log(`БРОНЯ: Пластинчатый Доспех (+350 ХП, защита +50)`)
    } else if (player.hasArmor) {
        console.log(`БРОНЯ: Броня Химеры (+100 ХП)`)
    } else {
        console.log(`БРОНЯ: Пусто`)
    }

    //предметы
    if (player.hasSoulStone) {
        console.log(`ПРЕДМЕТЫ: Камень Душ (шанс крита 75%)`)
    } else if (player.hasItem) {
        console.log(`ПРЕДМЕТЫ: Амулет Крита (шанс крита 50%)`)
    } else {
        console.log(`ПРЕДМЕТЫ: Пусто`)
    }
    
    //артефакты
    console.log(`АРТЕФАКТ: ${player.hasArts ? "Огненная гарда (+5 урон)" : "Пусто"}`)
    
    //аксессуары
    console.log(`АКСЕССУАРЫ: ${player.hasArts2 ? "Браслет исцеления (+50 ХП, +50 лечение)" : "Пусто"}/${player.hasArts3 ? "Ожерелье Рыцаря Бездны (+200 ХП, +30 лечение, +30 урон)" : "Пусто"}`)
}

//функция отрисовки статуса игрока
export function showPlayerStatus() {
    const currentTotalDamage = calculatePlayerDamage();
    console.log("\n===============================")
    console.log(`ПЕРСОНАЖ: ${player.name}`)
    console.log(`ДЕНЬГИ: ${player.counter}`)
    console.log(`ЗДОРОВЬЕ: ${player.currentHP}/${player.maxHP}`)
    console.log(`УРОН: ${currentTotalDamage} (без учета критов)`);
    console.log(`ОПИСАНИЕ: ${player.description}`)
    console.log("=================================")
}
