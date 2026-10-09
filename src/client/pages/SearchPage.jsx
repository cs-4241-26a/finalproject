import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import GameList from "../components/game/GameList"
import UserCard from "../components/UserCard"

function SearchPage() {
    const [params] = useSearchParams()
    const query = params.get("q") ?? ""
    const [games, setGames] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchResults = async () => {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            const data = await response.json()
            setGames(data.games)
            setUsers(data.users)
        }
        fetchResults()
    }, [query])

    return (
        <div className="container-fluid px-4">
            <h1 className="mb-3">Search results for "{query}"</h1>
            <div className="row">
                <section className="col">
                    <h2>Games</h2>
                    {games.length > 0 ? <GameList games={games} /> : <p className="lead">No games found</p>}
                </section>
                <section className="col">
                    <h2>Users</h2>
                    {users.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {users.map((u) => <UserCard key={u.username} user={u} />)}
                        </div>
                    ) : <p className="lead">No users found</p>}
                </section>
            </div>
        </div>
    )
}
export default SearchPage;
