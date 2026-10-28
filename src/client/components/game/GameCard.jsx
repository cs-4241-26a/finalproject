import { Link } from "react-router-dom"

function GameCard({ game }) {
    return (
        <Link to={`/game/${game.name}`} className="card flex-row text-reset text-decoration-none" style={{height: "120px"}}>
            <img
                src={ game.image ? `/gamePictures/${game.image}` : "/game-missing-image.png" }
                alt={ `Picture of ${game.name}` }
                width="90px"
                style={{objectFit: "cover"}}
            />
            <div className="card-body overflow-hidden">
                <h5 className="card-title">{game.name}</h5>
                <p className="card-text text-truncate">{game.description}</p>
                <div className="position-absolute bottom-0 mb-2">
                    {game.official && <span className="badge text-bg-success me-1">Official</span>}
                    {game.tags?.map((tag) => <span key={tag} className="badge text-bg-secondary me-1">{tag}</span>)}
                </div>
            </div>
        </Link>
    )
}
export default GameCard;
