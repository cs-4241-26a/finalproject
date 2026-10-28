import { Link } from "react-router-dom"
import ProfilePicture from "./ProfilePicture"

function UserCard({user}) {
    return (
        <Link to={`/user/${user.username}`} className="card align-items-center overflow-hidden text-reset text-decoration-none" style={{minWidth: "80px"}}>
            <ProfilePicture name={user.profilePicture} alttext={user.username+"'s profile picture"} width="80px" height="80px"/>
            {/* The card is at least as wide as the picture and grows to fit longer usernames */}
            <div className="text-center text-nowrap my-1 px-2">{user.username}</div>
        </Link>
    )
}
export default UserCard;
