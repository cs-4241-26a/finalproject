import { useState, useEffect } from "react"
import MatchList from "../components/match/MatchList"
import GameList from "../components/game/GameList"
import MatchForm from "../components/match/MatchForm"
import {Link} from "react-router-dom";

function HomePage() {
    const [matches, setMatches] = useState([])
    const [games, setGames] = useState([])
    const [reloadMatches, setReloadMatches] = useState(0)
    const [reloadGames, setReloadGames] = useState(0)

    useEffect(() => {
        const fetchMatches = async () => {
            const mResponse = await fetch("/getMatches", {method: "GET"})
            const mData = await mResponse.json()
            setMatches(mData)
        }
        fetchMatches()
    }, [reloadMatches])

    useEffect(() => {
        const fetchGames = async () => {
            const gResponse = await fetch("/getFilteredGames", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({official: true})
            })
            const gData = await gResponse.json()
            setGames(gData)
        }
        fetchGames()
    }, [reloadGames])

    return (
        <div className="container-fluid px-4">
            <div className="row">
                <section className="col-lg-6">
                    <div className="d-flex justify-content-between mb-3">
                        <h2>Recent Matches</h2>
                        <MatchForm onSubmit={() => setReloadMatches(reloadMatches+1)} />
                    </div>
                    <MatchList matches={[...matches].reverse().slice(0,10)} />
                </section>
                <section className="col-lg-6">
                    <div className="d-flex justify-content-between mb-3">
                        <h2>Official Games</h2>
                        <Link to={"/games"} className={"btn btn-primary align-content-center"}>View All Games</Link>
                    </div>
                    <GameList games={games} />
                </section>
            </div>
        </div>
    )   
}
export default HomePage;
