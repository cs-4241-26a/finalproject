import { useState, useEffect } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import Achievements from "../components/Achievements";
import ProfilePicture from "../components/ProfilePicture";
import MatchList from "../components/match/MatchList";
import WinLossRecord from "../components/WinLossRecord";

// Values for what "page" to display: the default one or one that lets you edit something
const NO_CHANGES = 0;
const CHANGE_PROFILEPICTURE = 1;
const CHANGE_USERNAME = 2;
const CHANGE_PASSWORD = 3;
const CHANGE_BIO = 4;

const postJson = (url, body) => fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
});

function ProfilePage() {
    // user is the currently logged in user (null when signed out), see App.jsx
    const { user, setUser, userLoaded } = useOutletContext();

    const [changeSettings, setChangeSettings] = useState(NO_CHANGES);
    const [bioDraft, setBioDraft] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [error, setError] = useState("");
    const [matches, setMatches] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user != null) {
            const fetchMatches = async () => {
                const mResponse = await fetch("/getFilteredMatches", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({"players.name": user.username})
                })
                const mData = await mResponse.json()
                setMatches(mData)
            }
            fetchMatches()
        }
    }, [user])


    // Wait until we know whether anyone is logged in before redirecting
    if (!userLoaded) return null;
    if (user === null) return <Navigate to="/login" replace />;

    const stopEditing = () => {
        setChangeSettings(NO_CHANGES);
        setError("");
    };

    // Sends an update to the server, then runs onSuccess with the response body
    const save = async (url, body, onSuccess) => {
        const response = await postJson(url, body);
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || "Something went wrong");
            return;
        }
        onSuccess(data);
        stopEditing();
    };

    const startBioEdit = () => {
        setBioDraft(user.bio ?? "");
        setChangeSettings(CHANGE_BIO);
    };

    const changeBio = () => save("/api/profile/bio", { bio: bioDraft },
        (data) => setUser({ ...user, bio: data.bio }));

    const changeUsername = () => save("/api/profile/username", { username: newUsername },
        (data) => {
            setUser({ ...user, username: data.username });
            setNewUsername("");
        });

    const changePassword = () => save("/api/profile/password", { password: newPassword },
        () => setNewPassword(""));
    
    const changeProfilePicture = async function () {
        if (user != null) {
            await fetch("/modifyUser",
                {method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( {"username":user.username, "update":{"profilePicture":newProfilePicture} } )
                }
            );
            stopEditing()
        }
    }

    const profilePictureOptions = (() => {
        const radioButtons = []
        const profilePictures = ["default", "demon", "blackPawn", "blackRook", "blackKnight", "blackBishop", "blackQueen", "blackKing", "loveGames"]
        for (const picture of profilePictures) {
            radioButtons.push(
            <label htmlFor={picture} key={picture}>
                <input type="radio" id={picture} name="profilePictureButton" value={picture} onChange={(event) => setNewProfilePicture(event.target.value)} />
                <ProfilePicture name={picture} alttext={picture}/>
            </label>
        )}
        return(radioButtons)
    })

    const popupManager = () => {
        if (changeSettings === CHANGE_PROFILEPICTURE) {
            return (
                <>
                    <hr />
                    <div className="mb-2">
                        {profilePictureOptions()}
                    </div>
                    <div className="input-group">
                        <button className="btn btn-outline-danger me-2" onClick={stopEditing}>Cancel</button>
                        <button className="btn btn-primary me-2" onClick={changeProfilePicture}>Submit</button>
                    </div>
                </>
            )
        }
        else if (changeSettings === CHANGE_USERNAME) {
            return (
                <>
                    <hr />
                    <div className="input-group">
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(event) => setNewUsername(event.target.value)}
                            placeholder="New username..."
                            className="input-group-text me-2"
                        />
                        <button className="btn btn-outline-danger me-2" onClick={stopEditing}>Cancel</button>
                        <button className="btn btn-primary me-2" onClick={changeUsername}>Submit</button>
                    </div>
                </>
            )
        }
        else if (changeSettings === CHANGE_PASSWORD) {
            return (
                <>
                    <hr />
                    <div className="input-group">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            placeholder="New password..."
                            className="input-group-text me-2"
                        />
                        <button className="btn btn-outline-danger me-2" onClick={stopEditing}>Cancel</button>
                        <button className="btn btn-primary me-2" onClick={changePassword}>Submit</button>
                    </div>
                </>
            )
        }
        else if (changeSettings === CHANGE_BIO) {
            return (
                <>
                    <hr />
                    <div className="mb-2">
                        <textarea
                            className="form-control"
                            value={bioDraft}
                            maxLength={500}
                            onChange={(event) => setBioDraft(event.target.value)}
                            placeholder="New bio..."
                        />
                    </div>
                    <div className="input-group">
                        <button className="btn btn-outline-danger me-2" onClick={stopEditing}>Cancel</button>
                        <button className="btn btn-primary me-2" onClick={changeBio}>Submit</button>
                    </div>
                </>
            )
        }
        else {
            return (<></>)
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete your account?`)
        if(confirmed) {
            await fetch("/deleteUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username: user.username})
            })
            setUser(null)
            navigate("/")
        }
    }

    return (
        <div className="mx-4">
            <section>
                <div className="input-group mb-3">
                    <div className="align-self-center me-2">
                        {user == null ?
                        <ProfilePicture name={""} alttext={""}/>
                        :
                        <ProfilePicture name={user.profilePicture} alttext={user.username+"'s profile picture showing a "+user.profilePicture}/>
                        }
                    </div>
                    <div className="align-self-center">
                        <h1>
                            {user.username}
                        </h1>
                    </div>
                </div>
                <p className="lead">
                    {user.bio}
                </p>
                <WinLossRecord username={user.username} matches={matches} />

                <button className="btn btn-outline-primary me-2" onClick={() => setChangeSettings(CHANGE_USERNAME)}>
                    Change Username
                </button>
                <button className="btn btn-outline-primary me-2" onClick={() => setChangeSettings(CHANGE_PASSWORD)}>
                    Change Password
                </button>
                <button className="btn btn-outline-primary me-2" onClick={() => setChangeSettings(CHANGE_PROFILEPICTURE)}>
                    Change Profile Picture
                </button>
                <button className="btn btn-outline-primary me-2" onClick={() => startBioEdit()}>
                    Change Bio
                </button>
                <button className="btn btn-outline-danger me-2" onClick={() => handleDeleteAccount()}>
                    Delete Account
                </button>

                {error && <p style={{ color: "#dc3545" }}>{error}</p>}

                {popupManager()}
            </section>

            <hr />

            <section className="mb-5">
                <h2 className="mb-3">Achievements</h2>
                <Achievements username={user.username} />
            </section>

            <section className="mb-5">
                <h2 className="mb-3">Recently Played Matches</h2>
                <MatchList matches={[...matches].reverse()} matchCount={5} />
            </section>
        </div>
    )
}
export default ProfilePage;
