import GameCard from "./GameCard"

function GameList({games}) {
    return (
        <div className="d-flex flex-column gap-2">
            {games.map((g) => <GameCard key = {g._id} game={g} />)}
        </div>
    )
}

export default GameList
