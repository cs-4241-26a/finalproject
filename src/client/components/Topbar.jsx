import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture"

function Topbar({ user, setUser }) {
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const search = (e) => {
        e.preventDefault()
        if (searchTerm.trim() === "") return
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }

    const logout = async () => {
        await fetch("/auth/logout", { method: "POST" })
        setUser(null)
    }

    // If user == null you are not signed in or loaded so use that instead of signedIn
    let username = user ? user.username : null

    let profileDropdown;
    if ((user != null)) {
        profileDropdown = (<>
            <ProfilePicture name={user.profilePicture} alttext={user.username+"'s profile picture"} width={"40px"} height={"40px"}/>
            {username}
        </>)
    } else {
        profileDropdown = (<>
            Not signed in
        </>)
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-secondary fixed-top">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Board Game Tracker</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-75">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/games" className="nav-link">Games</Link>
                        </li>
                        <li className="nav-item px-3 w-50">
                            <form className="d-flex" role="search" onSubmit={search}>
                                <input className="form-control me-2" type="search" placeholder="Search games and users..." aria-label="Search"
                                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                                <button className="btn btn-outline-primary" type="submit">Search</button>
                            </form>
                        </li>
                    </ul>
                    <span className="dropdown">
                        <a className="nav-link dropdown-toggle d-flex align-items-center text-nowrap" href="#" role="button" data-bs-toggle="dropdown">
                            {profileDropdown}
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" to="/login" hidden={(user != null)}>Log In/Sign Up</Link></li>
                            <li><Link className="dropdown-item" to="/profile" hidden={!(user != null)}>Profile</Link></li>
                            <li><button className="dropdown-item" onClick={logout} hidden={!(user != null)}>Log Out</button></li>
                        </ul>
                    </span>
                </div>
            </div>
        </nav>
    )
}

export default Topbar;
