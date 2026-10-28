import { useState, useEffect } from "react"
import MatchCard from "./MatchCard"

// matchCount is optional: when given, only that many matches show at first, and "View more" shows all of them
function MatchList({matches, matchCount}) {
    const [showAll, setShowAll] = useState(false)
    // Lookups so each card can show the game's image and each player's profile picture
    const [gameImages, setGameImages] = useState({})
    const [profilePictures, setProfilePictures] = useState({})

    useEffect(() => {
        const fetchLookups = async () => {
            const games = await (await fetch("/getGames")).json()
            const users = await (await fetch("/getUsers")).json()
            setGameImages(Object.fromEntries(games.map(g => [g.name, g.image])))
            setProfilePictures(Object.fromEntries(users.map(u => [u.username, u.profilePicture])))
        }
        fetchLookups()
    }, [])

    return (
        <div className="d-flex flex-column gap-2">
            {(matchCount && !showAll ? matches.slice(0, matchCount) : matches).map((m) => (
                <MatchCard key = {m._id} match={m} gameImage={gameImages[m.gameName]} profilePictures={profilePictures} />
            ))}
            {matchCount && !showAll && matches.length > matchCount && (
                <button type="button" className="btn btn-outline-secondary align-self-center"
                        onClick={() => setShowAll(true)}>
                    View more
                </button>
            )}
        </div>
    )
}

export default MatchList
