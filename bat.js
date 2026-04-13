//функции рандома income() для получения монет, action() для рандомного действия мобов
export function income() { let a = Math.floor(Math.random() * 50)
    return a
}

export function action() { let a = Math.floor(Math.random() * 2)
    return a
}

//функции чтобы защита не превышала урон (иначе будет исцеление)
export function deffenseP(enemyDamage, playerDefense) {let a = Math.max(0, enemyDamage - playerDefense)
    return a
}

export function deffenseE(damage, defensePower) {let a = Math.max(0, damage - defensePower)
    return a
}

// функция рандома критов
export function crit(player) {
    let a
    if (player.hasSoulStone) {
        a = Math.random() < 0.75
    } else if (player.hasItem) {
        a = Math.random() < 0.5
    } return a
}

//функции чтобы хп не превышало максимум
export function maxHPE(currentEnemyHP, enemyHP) {
    if (currentEnemyHP > enemyHP) {
        currentEnemyHP = enemyHP
    } return currentEnemyHP
}

export function maxHPP(player) {
    if (player.currentHP > player.maxHP) {
        player.currentHP = player.maxHP
    } return player.currentHP
}

export function armor(player) {
    if (player.hasArmor) {
        player.maxHP += 100
        return player.maxHP
    } 
}

export function item1(player) {
    if (player.hasArts2) {
        player.maxHP += 50
        return player.maxHP
    }
}

export function item2(player) {
    if (player.hasArts3) {
        player.maxHP += 200
        return player.maxHP
    }
}

export function armor2(player) {
    if (player.hasPlateArmor) {
        player.maxHP += 350
        return player.maxHP
    }
}

export function helper() {
    console.log('\n--------------------------\nВведите в консоль "save" для сохранения прогресса\n--------------------------')
    console.log('\n--------------------------\nВведите в консоль "i" для открытия инвентаря\n--------------------------')
    console.log('\n--------------------------\nВведите в консоль "0" для открытия профиля игрока\n--------------------------')
    console.log('\n--------------------------\nВведите в консоль "exit" для выхода из игры и сохранения прогресса\n--------------------------')
    console.log('\n--------------------------\nВведите в консоль "delete" для удаления сохранений\n--------------------------')
}