import { Link } from "react-router-dom"
import ProfilePicture from "../ProfilePicture"

function MatchCard({ match, gameImage, profilePictures = {} }) {
    return (
        <Link to={`/match/${match._id}`} className="card flex-row overflow-hidden text-reset text-decoration-none" style={{height: "120px"}}>
            <img
                src={ gameImage ? `/gamePictures/${gameImage}` : "/game-missing-image.png" }
                alt={ `Picture of ${match.gameName}` }
                width="90px"
                style={{objectFit: "cover"}}
            />
            <div className="card-body py-2">
                <div className="d-flex justify-content-between">
                    <h5 className="card-title mb-0">{match.gameName}</h5>
                    <small className="text-body-secondary">{match.datePlayed}</small>
                </div>
                <div className="d-flex justify-content-center gap-3">
                    {match.players.map((p, i) => (
                        <div key={i} className="d-flex flex-column align-items-center">
                            {/* Placeholder crown - swap for the crown image later. Invisible spacer keeps pictures lined up. */}
                            <small style={{visibility: p.won ? "visible" : "hidden", lineHeight: 1}}>👑</small>
                            <ProfilePicture name={profilePictures[p.name]} alttext={`${p.name}'s profile picture`} width="36px" height="36px" />
                            <small style={{lineHeight: 1.2}}>{p.name.length > 20 ? p.name.slice(0,17) + "..." : p.name}</small>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    )
}
export default MatchCard;
