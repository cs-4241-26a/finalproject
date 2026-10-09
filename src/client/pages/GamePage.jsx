import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";
import MatchList from "../components/match/MatchList.jsx";
import MatchForm from "../components/match/MatchForm.jsx";
import EditGameForm from "../components/game/EditGameForm.jsx";

function GamePage() {
    const [game, setGame] = useState()
    const [matches, setMatches] = useState([])
    const [reload, setReload] = useState(0)
    const gameName = useParams().gameName
    const navigate = useNavigate()

    useEffect(() => {
        const fetchGame = async () => {
            const gameResponse = await fetch("/getFilteredGames", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name: gameName})
            })
            const gameData = await gameResponse.json()
            setGame(gameData[0])
        }

        const fetchMatches = async () => {
            const matchResponse = await fetch("/getFilteredMatches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({gameName})
            })
            const matchData = await matchResponse.json()
            setMatches(matchData)
        }

        fetchGame()
        fetchMatches()
    }, [reload])

    const deleteGame = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete ${game.name}?`)
        if (confirmed) {
            await fetch("/deleteGame", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name: game.name})
            })
            navigate("/")
        }
    }

    if(game === undefined) {
        return (
            <>
                <h1 style={{textAlign: "center"}}>{gameName}</h1>
                <p>Sorry, {gameName} is not a valid game. To make it valid, add it on the home page.</p>
            </>
        )
    }

    // The player with the most wins in this game (the first one to reach it if there's a tie)
    const winCounts = {}
    matches.forEach(match => match.players.forEach(player => {
        if (player.won) winCounts[player.name] = (winCounts[player.name] ?? 0) + 1
    }))
    const topPlayer = Object.entries(winCounts).sort((a, b) => b[1] - a[1])[0]

    return (
        <div style={{width: "60rem", margin: "0 auto"}} className="py-2">
            <h1 style={{textAlign: "center"}} className="mb-4">{game.name}</h1>
            <img style={{display: "block", margin: "0 auto"}}
                className="my-2"
                src={ game.image ? `/gamePictures/${game.image}` : "/game-missing-image.png" }
                alt={ `Picture of ${game.name}` }
            />
            <div className="d-flex justify-content-center gap-2 mb-2">
                <p>
                    {game.official && <span className="badge text-bg-success me-1">Official</span>}
                    {game.tags?.map((tag) => <span key={tag} className="badge text-bg-secondary me-1">{tag}</span>)}
                </p>
            </div>
            <div className="d-flex justify-content-center gap-2">
                <p className="lead">
                    {game.description}
                </p>
            </div>
            <div className="d-flex justify-content-center gap-2 mb-2">
                <p>
                    {topPlayer && <><strong>Top player:</strong> {topPlayer[0]} ({topPlayer[1]} {topPlayer[1] === 1 ? "win" : "wins"})</>}
                </p>
            </div>


            {game.official ?
                <div className="input-group d-flex justify-content-center gap-2 mb-3">
                    <MatchForm key={game.name} gameName={game.name} onSubmit={() => setReload(reload+1)} />
                </div>
                :
                <div className="input-group d-flex justify-content-center gap-2 mb-3">
                    <MatchForm key={game.name} gameName={game.name} onSubmit={() => setReload(reload+1)} />
                    <EditGameForm game={game} onSubmit={() => setReload(reload+1)} />
                    <button onClick={deleteGame} className="btn btn-danger">
                        Delete Game
                    </button>
                </div>
            }

            <h2>Recent Matches of {game.name}</h2>
            <MatchList matches={[...matches].reverse()} matchCount={5}/>
        </div>
    )
}

export default GamePage;
