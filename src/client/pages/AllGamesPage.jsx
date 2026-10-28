import { useState, useEffect } from "react"
import GameList from "../components/game/GameList"
import GameForm from "../components/game/GameForm"

function AllGamesPage() {
    const [games, setGames] = useState([])
    const [reloadGames, setReloadGames] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTags, setSelectedTags] = useState([])

    useEffect(() => {
        const fetchGames = async () => {
            const gResponse = await fetch("/getGames", {
                method: "GET"
            })
            const gData = await gResponse.json()
            const officialGames = gData.filter(g => g.official)
            const unofficialGames = gData.filter(g => !Object.hasOwn(g, "official") || !g.official)
            setGames([...officialGames, ...unofficialGames])
        }
        fetchGames()
    }, [reloadGames])

    // Tags that exist on at least one game, so the filter only offers useful options
    const allTags = [...new Set(games.flatMap(g => g.tags ?? []))]

    const toggleTag = (tag) => {
        setSelectedTags(selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag])
    }

    // A game must match the search text AND have every selected tag
    const visibleGames = games.filter(g =>
        g.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
        selectedTags.every(tag => g.tags?.includes(tag))
    )

    return (
        <div className="container-fluid px-4">
            <div className="row">
                <section className="col">
                    <div className="d-flex justify-content-between mb-3">
                        <h2>All Games</h2>
                        <div className="d-flex">
                            <p className="my-auto me-3">Can't find a game you love? Feel free to add it!</p>
                            <GameForm onSubmit={() => setReloadGames(reloadGames+1)} />
                        </div>
                    </div>
                    <div className="d-flex gap-2 mb-3">
                        <input className="form-control" type="search" placeholder="Search games..." aria-label="Search games"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <div className="dropdown">
                            {/* auto-close "outside" keeps the menu open while ticking several tags */}
                            <button className="btn btn-outline-secondary dropdown-toggle" type="button"
                                    data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                Filter by tags{selectedTags.length > 0 && ` (${selectedTags.length})`}
                            </button>
                            <ul className="dropdown-menu px-3">
                                {allTags.map(tag => (
                                    <li key={tag}>
                                        <label className="form-check">
                                            <input className="form-check-input" type="checkbox"
                                                checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} />
                                            {tag}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {visibleGames.length > 0 ? <GameList games={visibleGames} /> : <p>No games found.</p>}
                </section>
            </div>
        </div>
    )   
}
export default AllGamesPage;
