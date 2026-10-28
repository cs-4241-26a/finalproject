// How a game's winner is decided, shared by the game and match forms.
//   highScore / lowScore:       players enter a score, the highest / lowest wins
//   fastestTime / slowestTime:  players enter a time, the shortest / longest wins
//   lastStanding / none:        no number is entered, the winner is marked by hand
export const WIN_CONDITIONS = [
    { value: "none", label: "None (just mark the winner)" },
    { value: "highScore", label: "High Score" },
    { value: "lowScore", label: "Low Score" },
    { value: "fastestTime", label: "Fastest Time" },
    { value: "slowestTime", label: "Slowest Time" },
    { value: "lastStanding", label: "Last Player Standing" }
]

// Win conditions for the built-in games, used when a game has none saved on it
const SPECIAL_WIN_CONDITIONS = { Coup: "lastStanding", Uno: "lastStanding", Catan: "highScore" }

export const getWinCondition = (game) => game?.winCondition ?? SPECIAL_WIN_CONDITIONS[game?.name] ?? "none"

export const isScoreCondition = (winCondition) => winCondition === "highScore" || winCondition === "lowScore"
export const isTimeCondition = (winCondition) => winCondition === "fastestTime" || winCondition === "slowestTime"

// Turns "m:ss" or "h:mm:ss" into seconds (NaN if it isn't a time)
export const parseTime = (time) => {
    if (!/^\d+(:[0-5]\d){1,2}$/.test(time ?? "")) return NaN
    return time.split(":").reduce((total, part) => total * 60 + Number(part), 0)
}

/**
 * Works out who won a match with a score or time win condition.
 * @param players The match's players, with a score or a time each
 * @returns A list of true/false, one per player. Players tied for the best result all win.
 */
export const pickWinners = (winCondition, players) => {
    const values = players.map(player =>
        isScoreCondition(winCondition) ? parseFloat(player.score) : parseTime(player.time))
    const valid = values.filter(value => !isNaN(value))
    if (valid.length === 0) return players.map(() => false)

    const highestWins = winCondition === "highScore" || winCondition === "slowestTime"
    const best = highestWins ? Math.max(...valid) : Math.min(...valid)
    return values.map(value => value === best)
}
