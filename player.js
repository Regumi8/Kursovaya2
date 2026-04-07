//информация об игроке
export const player = {
    name: "Искатель приключений",
    maxHP: 500,
    currentHP: 500,
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

//функция отрисовки статуса игрока
export function showPlayerStatus() {
    console.log("\n===============================");
    console.log(`ПЕРСОНАЖ: ${player.name}`);
    console.log(`ДЕНЬГИ: ${player.counter}`);
    console.log(`ЗДОРОВЬЕ: ${player.currentHP}/${player.maxHP}`);
    
    if (player.hasSoulStone) {
        console.log(`ПРЕДМЕТЫ: Камень Душ (шанс крита 75%)`);
    } else if (player.hasItem) {
        console.log(`ПРЕДМЕТЫ: Амулет Крита (шанс крита 50%)`);
    } else {
        console.log(`ПРЕДМЕТЫ: Пусто`);
    }
    
    // Отображаем либо Благословенный Меч, либо Железный Меч
    if (player.hasBlessedSword) {
        console.log(`ОРУЖИЕ: Благословенный Меч (+50 урон)`);
    } else if (player.hasWeapon) {
        console.log(`ОРУЖИЕ: Железный меч (+10 урон)`);
    } else {
        console.log(`ОРУЖИЕ: Пусто`);
    }
    
    console.log(`АРТЕФАКТ: ${player.hasArts ? "Огненная гарда (+5 урон)" : "Пусто"}`);
    
    // Отображаем либо Пластинчатый Доспех, либо Броню Химеры
    if (player.hasPlateArmor) {
        console.log(`БРОНЯ: Пластинчатый Доспех (+350 ХП, защита +50)`);
    } else if (player.hasArmor) {
        console.log(`БРОНЯ: Броня Химеры (+100 ХП)`);
    } else {
        console.log(`БРОНЯ: Пусто`);
    }
    
    console.log(`АКСЕССУАРЫ: ${player.hasArts2 ? "Браслет исцеления (+50 ХП, +50 лечение)" : "Пусто"}/${player.hasArts3 ? "Ожерелье Рыцаря Бездны (+200 ХП, +30 лечение, +30 урон)" : "Пусто"}`); 
    
    console.log(`ОПИСАНИЕ: ${player.description}`);
    console.log("=================================");
}
