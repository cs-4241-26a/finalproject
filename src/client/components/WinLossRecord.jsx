// Shows a player's wins and losses, given all the matches they played.
// A win is a match where they're marked as the winner, a loss is any other match that had a winner.
// Matches with no winner marked don't count as a win or a loss for anyone.
function WinLossRecord({ username, matches }) {
    const decided = matches.filter(match => match.players.some(player => player.won))
    const wins = decided.filter(match => match.players.some(player => player.name === username && player.won)).length
    const losses = decided.length - wins

    return (
        <p>
            <strong>Record:</strong>{" "}
            {decided.length === 0
                ? "No decided matches yet"
                : `${wins} wins · ${losses} losses (${Math.round(wins / decided.length * 100)}% wins)`}
        </p>
    )
}
export default WinLossRecord;
