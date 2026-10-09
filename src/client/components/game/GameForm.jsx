import { useState } from "react"
import { GAME_TAGS } from "./gameTags"
import { WIN_CONDITIONS } from "./winConditions"

const GameForm = ({onSubmit, fullWidth = false}) => {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")
    const [isCardGame, setIsCardGame] = useState(false)
    const [dealsHand, setDealsHand] = useState(false)

    // Closes the menu and clears any error
    const close = () => {
        setOpen(false)
        setError("")
        setIsCardGame(false)
        setDealsHand(false)
    }

    const handleSubmit = async (e) => {
        // Not a form action, so the fields keep what was typed if the game can't be added
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const gameData = {
            name: formData.get("name"),
            description: formData.get("description"),
            tags: formData.getAll("tags"),
            winCondition: formData.get("winCondition"),
            cardGame: isCardGame,
            dealsHand: isCardGame && dealsHand
        }
        if (gameData.dealsHand) {
            gameData.handSize = Number(formData.get("handSize"))
        }

        const response = await fetch("/addGame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameData)
        })

        if (!response.ok) {
            setError("Couldn't add the game. Is there already a game with that name?")
            return
        }

        close()
        onSubmit() //prop from the caller - currently used to refresh the list on the home page
    }

    return (
        <>
            <button type="button" className={"btn btn-primary" + (fullWidth ? " w-100" : "")} onClick={() => setOpen(true)}>Add Custom Game</button>

            {open && (
                <div className="modal d-block" tabIndex="-1" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                    <div className="modal-dialog modal-lg">
                        <form className="modal-content" onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">Add a Game</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
                            </div>

                            <div className="modal-body">
                                <label className="form-label w-100">
                                    Name
                                    <input className="form-control" type="text" name="name" required />
                                </label>

                                <label className="form-label w-100">
                                    Description
                                    <textarea className="form-control" name="description"></textarea>
                                </label>

                                <label className="form-label w-100">
                                    Win condition
                                    <select className="form-select w-auto" name="winCondition" defaultValue="none">
                                        {WIN_CONDITIONS.map(condition => (
                                            <option key={condition.value} value={condition.value}>{condition.label}</option>
                                        ))}
                                    </select>
                                </label>

                                <div>Tags</div>
                                <div className="mb-3">
                                    {GAME_TAGS.map(tag => (
                                        <label key={tag} className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" name="tags" value={tag} />
                                            {tag}
                                        </label>
                                    ))}
                                </div>

                                <label className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch"
                                           checked={isCardGame} onChange={(e) => setIsCardGame(e.target.checked)} />
                                    This is a card game
                                </label>

                                {isCardGame && (
                                    <label className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch"
                                               checked={dealsHand} onChange={(e) => setDealsHand(e.target.checked)} />
                                        Each player gets a starting hand
                                    </label>
                                )}

                                {isCardGame && dealsHand && (
                                    <label className="form-label">
                                        Cards per player
                                        <input className="form-control w-auto" type="number" name="handSize"
                                               min="1" max="52" required />
                                    </label>
                                )}

                                {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Game</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default GameForm
