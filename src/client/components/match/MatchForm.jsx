import { useState, useEffect } from "react"
import AwardAchievementsFunction from "../AwardAchievementsFunction"
import HandPicker from "./HandPicker"
import { getHandRules } from "./cardGames"
import { getWinCondition, isScoreCondition, isTimeCondition, pickWinners } from "../game/winConditions"

//Only set matchToEdit if this is editing a match, not if it is creating a new match
//gameName is optional: pages about one game pass it so the game is already chosen
function MatchForm({onSubmit, matchToEdit, gameName}) {
    const [allGames, setAllGames] = useState([])
    const [open, setOpen] = useState(false)
    const [numPlayers, setNumPlayers] = useState(1)
    const [selectedGame, setSelectedGame] = useState(gameName ?? "")

    // What the match records for each player depends on the game (see cardGames.js and winConditions.js)
    const game = allGames.find(g => g.name === selectedGame)
    const handRules = getHandRules(game)
    const winCondition = getWinCondition(game)
    const usesScore = isScoreCondition(winCondition)
    const usesTime = isTimeCondition(winCondition)
    const marksWinner = !usesScore && !usesTime // otherwise the winner is worked out from the scores or times

    // Each player's starting hand (a list of card names), by player index. Kept here, not in each picker,
    // so the cards dealt to all players can be counted against the number of copies in the deck.
    const [hands, setHands] = useState([])
    const dealt = {}
    hands.slice(0, numPlayers).flat().forEach(cardName => dealt[cardName] = (dealt[cardName] ?? 0) + 1)

    const setHand = (playerIndex, hand) => {
        const newHands = [...hands]
        newHands[playerIndex] = hand
        setHands(newHands)
    }

    useEffect(() => {
        const fetchData = async () => {
            const gameResponse = await fetch("/getGames", { method: "GET" })
            const gameData = await gameResponse.json()
            setAllGames(gameData)
        }
        // Fetch each time the menu opens, so games added since the page loaded are included
        if (open) fetchData()
    }, [open])

    //Only load this on first mount to avoid infinitely setting open
    useEffect(() => {
        if(matchToEdit) {
            setNumPlayers(matchToEdit.players.length)
            setSelectedGame(matchToEdit.gameName)
            setHands(matchToEdit.players.map(p => p.hand))
            if(!open) { setOpen(true) }
        }
    }, [])

    // Closes the menu and clears everything that was entered
    const close = () => {
        setOpen(false)
        setSelectedGame(gameName ?? "")
        setNumPlayers(1)
        setHands([])
        if(matchToEdit) { onSubmit() } //without this, modify match needs to be pressed twice to re-open
    }

    const handleSubmit = async (formData) => {
        const matchData = {
            gameName: formData.get("gameName"),
            players: [],
            datePlayed: formData.get("datePlayed"),
            notes: formData.get("notes")
        }

        for (let i = 0; i < numPlayers; i++) {
            const player = { name: formData.get(`name_${i}`) }
            if (handRules) player.hand = hands[i] ?? []
            if (usesScore) player.score = formData.get(`score_${i}`)
            if (usesTime) player.time = formData.get(`time_${i}`)
            if (marksWinner) player.won = (formData.get(`winner`) == i)
            matchData.players.push(player)
        }

        if (!marksWinner) {
            const winners = pickWinners(winCondition, matchData.players)
            matchData.players.forEach((player, i) => player.won = winners[i])
        }

        if(matchToEdit) {
            await fetch("/modifyMatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({oldId: matchToEdit._id, newMatch: matchData})
            })
        }
        else {
            await fetch("/addMatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(matchData)
            })
        }

        // Award achievements to any players that would get new ones from participating in this match
        await AwardAchievementsFunction(matchData.players.map((player) => player.name))

        close()
        if(onSubmit) { onSubmit() } //prop from the caller - currently used to refresh the list on the home page
    }

    return (
        <>
            {!matchToEdit && 
                <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>Submit Match</button>
            }

            {open && (
                <div className="modal d-block" tabIndex="-1" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                    <div className="modal-dialog modal-lg">
                        <form className="modal-content" action={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">Submit a Match</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
                            </div>

                            <div className="modal-body">
                                {gameName ? (
                                    <input type="hidden" name="gameName" value={gameName} />
                                ) : (
                                    <label className="form-label w-100">
                                        Game
                                        <select className="form-select" name="gameName" value={selectedGame}
                                                onChange={(e) => { setSelectedGame(e.target.value); setHands([]) }}>
                                            <option value="">-- Choose a game--</option>
                                            {allGames.map(game => (
                                                <option key={game.name} value={game.name}>{game.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                )}

                                {selectedGame !== "" && (<>
                                    <h6 className="mt-3">Players</h6>
                                    {Array.from({ length: numPlayers }).map((_, index) => (
                                        <div key={index} className="d-flex flex-wrap align-items-start gap-2 mb-2">
                                            <input className="form-control w-auto" type="text" name={`name_${index}`}
                                                   defaultValue={matchToEdit?.players[index]?.name}
                                                   placeholder={`Player ${index+1} username/name`} aria-label={`Player ${index+1} username or name`} />

                                            {handRules && (
                                                <HandPicker game={handRules} hand={hands[index] ?? []} dealt={dealt}
                                                            onChange={(hand) => setHand(index, hand)} />
                                            )}

                                            {usesScore && (
                                                <input className="form-control w-auto" type="number" name={`score_${index}`}
                                                       defaultValue={matchToEdit?.players[index]?.score}
                                                       placeholder="Score" aria-label={`Player ${index+1} score`} required />
                                            )}

                                            {usesTime && (
                                                <input className="form-control w-auto" type="text" name={`time_${index}`}
                                                       placeholder="Time (m:ss)" aria-label={`Player ${index+1} time`}
                                                       defaultValue={matchToEdit?.players[index]?.time}
                                                       pattern="\d+(:[0-5]\d){1,2}" title="Use m:ss or h:mm:ss, like 3:25" required />
                                            )}

                                            {marksWinner && (
                                                <label className="form-check">
                                                    <input className="form-check-input" type="radio" name="winner" value={index}
                                                           defaultChecked={matchToEdit?.players[index]?.won} />
                                                    Won?
                                                </label>
                                            )}
                                        </div>
                                    ))}

                                    <div className="mb-3">
                                        <button type="button" className="btn btn-outline-secondary btn-sm me-2"
                                                onClick={() => setNumPlayers(numPlayers+1)}>Add Player</button>
                                        <button type="button" className="btn btn-outline-secondary btn-sm"
                                                disabled={numPlayers <= 1} onClick={() => setNumPlayers(numPlayers-1)}>Remove Player</button>
                                    </div>

                                    <label className="form-label w-100">
                                        Date Played
                                        <input className="form-control w-auto" type="date" name="datePlayed"
                                               defaultValue={matchToEdit?.datePlayed || new Date().toISOString().split('T')[0]}
                                        />
                                    </label>

                                    <label className="form-label w-100">
                                        Notes
                                        <textarea className="form-control" name="notes" defaultValue={matchToEdit?.notes} ></textarea>
                                    </label>
                                </>)}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={selectedGame === ""}>Submit Match</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
export default MatchForm;
