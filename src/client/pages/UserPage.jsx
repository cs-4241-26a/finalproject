
import { useState, useEffect } from "react"
import {useParams} from "react-router-dom"
import Achievements from "../components/Achievements"
import ProfilePicture from "../components/ProfilePicture"
import MatchList from "../components/match/MatchList"
import WinLossRecord from "../components/WinLossRecord"

function UserPage() { 
    const { username } = useParams();
    const [userExists, setUserExists] = useState(false);
    // Given username get the profilePicture, bio, and achievements list from server
    const [profilePicture, setProfilePicture] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch("/getUserByName", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            })
            const user = await response.json()
            setBio(user?.bio ?? "")
            setProfilePicture(user?.profilePicture ?? "")
            setUserExists(user != null)
        }
        fetchUser()
    }, [username])

    const [matches, setMatches] = useState([])
    useEffect(() => {
        const fetchMatches = async () => {
            const mResponse = await fetch("/getFilteredMatches", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"players.name": username})
            })
            const mData = await mResponse.json()
            setMatches(mData)
        }
        fetchMatches()
    }, [])

    return (
        <div className="mx-4">
            <section>
                <div className="input-group mb-3">
                    <div className="align-self-center me-2">
                        <ProfilePicture name={profilePicture} alttext={username+"'s profile picture showing a " + profilePicture}/>
                    </div>
                    <div className="align-self-center">
                        <h1>
                            {username}
                        </h1>
                    </div>
                </div>
                <p className="lead">
                    {userExists ? bio : "No account created"}
                </p>
                {userExists ? <WinLossRecord username={username} matches={matches} /> : <></>}
            </section>

            <hr />

            {userExists ?
                <section className="mb-5">
                    <h2 className="mb-3">Achievements</h2>
                    <Achievements username={username} />
                </section>
                : <></>
            }
            
            <section className="mb-5">
                <h2>Recently Played Matches</h2>
                <MatchList matches={[...matches].reverse()} matchCount={5} />
            </section>
        </div>
    )   
}
export default UserPage;
