//информация об игроке
export const player = {
    name: "Искатель приключений",
    maxHP: 500,
    currentHP: 500,
    counter: 0,
    hasItem: false,
    hasWeapon: false,
    hasArts: false,
    hasArts2: false,
    hasArmor: false,
    description: "Вы — путник в поношенном плаще, ищущий славы в землях города N."
}

//функция отрисовки статуса игрока
export function showPlayerStatus() {
    console.log("\n===============================")
    console.log(`ПЕРСОНАЖ: ${player.name}`)
    console.log(`ДЕНЬГИ: ${player.counter}`)
    console.log(`ЗДОРОВЬЕ: ${player.currentHP}/${player.maxHP}`)
    console.log(`ПРЕДМЕТЫ: ${player.hasItem ? "Амулет Крита (шанс 10%)" : "Пусто"}`)
    console.log(`ОРУЖИЕ: ${player.hasWeapon ? "Железный меч (урон + 10)" : "Пусто"}`)
    console.log(`АРТЕФАКТ ДЛЯ МЕЧА: ${player.hasArts ? "Артефакт (урон + 5)" : "Пусто"}`)
    console.log(`БРОНЯ: ${player.hasArmor ? "Броня из панциря химеры (ХП + 100)" : "Пусто"}`)
    console.log(`АРТЕФАКТ ДЛЯ БРОНИ: ${player.hasArts2 ? "Артефакт (хп + 50)" : "Пусто"}`)
    console.log(`ОПИСАНИЕ: ${player.description}`)
    console.log("=================================")
    console.log("(Нажмите Enter, чтобы вернуться в диалог)")
}