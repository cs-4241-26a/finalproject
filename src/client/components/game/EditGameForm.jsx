import { useState } from "react"
import { GAME_TAGS } from "./gameTags"

// Button and menu for editing a game's description and tags
function EditGameForm({ game, onSubmit }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")

    // Also offer any tags the game already has that aren't in the standard list, so saving doesn't drop them
    const tagOptions = [...new Set([...GAME_TAGS, ...(game.tags ?? [])])]

    // Closes the menu and clears any error
    const close = () => {
        setOpen(false)
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const response = await fetch("/modifyGame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: game.name,
                description: formData.get("description"),
                tags: formData.getAll("tags")
            })
        })

        if (!response.ok) {
            setError(response.status === 401
                ? "You need to be logged in to edit a game."
                : "Couldn't save your changes.")
            return
        }

        close()
        onSubmit() //prop from the caller - refreshes the game on the page
    }

    return (
        <>
            <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>Edit Game</button>

            {open && (
                <div className="modal d-block" tabIndex="-1" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                    <div className="modal-dialog modal-lg">
                        <form className="modal-content" onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">Edit {game.name}</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
                            </div>

                            <div className="modal-body">
                                <label className="form-label w-100">
                                    Description
                                    <textarea className="form-control" name="description" defaultValue={game.description ?? ""}></textarea>
                                </label>

                                <div>Tags</div>
                                {tagOptions.map(tag => (
                                    <label key={tag} className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="tags" value={tag}
                                               defaultChecked={game.tags?.includes(tag)} />
                                        {tag}
                                    </label>
                                ))}

                                {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
export default EditGameForm;
