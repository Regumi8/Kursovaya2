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