import { CardFace } from "./HandPicker"
import { findCard } from "./cardGames"

// Dropdown showing the cards a player started a match with
// game is { groups, ... }, like an entry of CARD_GAMES, used to find each card's picture
function HandDropdown({ hand, game }) {
    return (
        <div className="dropdown-center mt-1">
            <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Starting hand
            </button>
            <div className="dropdown-menu p-2" style={{width: "max-content", maxWidth: "420px", maxHeight: "360px", overflowY: "auto"}}>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                    {hand.map((cardName, i) => <CardFace key={i} card={findCard(game, cardName)} />)}
                </div>
            </div>
        </div>
    )
}
export default HandDropdown;
