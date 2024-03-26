/**
 * A function for getting the max amount of xp a user can get at a certain level.
 * @param level The level to get the max xp of.
 */
function XPCapOfLevel(level: number) {
    return Math.floor(4.5 * level + 150);
}

/**
 * A function for calculating the xp of a level.
 * @param level The level to check
 * @returns the xp required for a level
 */
export function LevelToXP(level: number) {
    return 1000 * (level - 100) * (level + 100) + 10_000_000;
}

/**
 * A function for calculating the required XP to level up.
 * @param {number} level The current level
 * @returns The total xp required to get the next level
 */
export function XPToLevelUp(level: number) {
    return LevelToXP(level + 1) - LevelToXP(level);
}

/**
 * A function for converting xp to a level.
 * @param xp The xp to convert.
 * @returns The level.
 */
export function XPToLevel(xp: number) {
    return Math.floor(Math.sqrt(xp / 1000));
}

/**
 * A function for getting the xp gained from a message.
 * @param length The length of the message.
 * @param level The level of the user.
 * @returns The xp gained from the message.
 */
export function LengthToXP(length: number, level: number) {
    return Math.floor(Math.min(XPCapOfLevel(level), 0.8 * length + 10));
}
