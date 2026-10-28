import { useState } from "react"
import { findCard } from "./cardGames"

const showFallbackPicture = (e) => {
    e.target.onerror = null // avoid looping if the fallback is missing too
    e.target.src = "/game-missing-image.png"
}

// A card picture with its label below. card is { name, image, label }, image being a path inside public/cardPictures/
export function CardFace({ card }) {
    return (
        <div className="d-flex flex-column align-items-center text-center" style={{width: "60px"}}>
            <img src={card.image ? `/cardPictures/${card.image}` : "/game-missing-image.png"}
                 onError={showFallbackPicture} alt={`${card.name} card`} width="50px" height="70px" />
            <small>{card.label ?? card.name}</small>
        </div>
    )
}

/**
 * Picks a starting hand: choose cards from a dropdown (one tab per group), click a chosen card to remove it.
 * The caller owns the hand, so it can also track the cards dealt to the other players.
 * @param game { groups, maxHand }, like an entry of CARD_GAMES
 * @param hand The names of the cards in this player's hand
 * @param onChange Called with the new list of card names when a card is added or removed
 * @param dealt How many of each card have been dealt to all players in this match, as { cardName: count }.
 *              A card is disabled once all of its copies are dealt.
 */
function HandPicker({ game, hand, onChange, dealt }) {
    const [tab, setTab] = useState(0)

    const addCard = (card) => onChange([...hand, card.name])
    const removeCard = (index) => onChange(hand.filter((_, i) => i !== index))
    const isAvailable = (card) => hand.length < game.maxHand && (dealt[card.name] ?? 0) < card.copies

    return (
        <div>
            <div className="dropdown d-inline-block">
                {/* auto-close "outside" keeps the menu open while adding several cards */}
                <button className="btn btn-outline-secondary dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" data-bs-auto-close="outside">
                    Choose starting hand ({hand.length}/{game.maxHand})
                </button>
                <div className="dropdown-menu p-2" style={{width: "420px", maxHeight: "360px", overflowY: "auto"}}>
                    {game.groups.length > 1 && (
                        <ul className="nav nav-tabs mb-2">
                            {game.groups.map((group, i) => (
                                <li key={group.name} className="nav-item">
                                    <button type="button" className={`nav-link ${i === tab ? "active" : ""}`}
                                            onClick={() => setTab(i)}>
                                        {group.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="d-flex flex-wrap gap-2">
                        {game.groups[tab].cards.map(card => (
                            <button key={card.name} type="button" className="btn btn-light p-1"
                                    disabled={!isAvailable(card)} onClick={() => addCard(card)}>
                                <CardFace card={card} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-2">
                {hand.map((cardName, i) => (
                    <button key={i} type="button" className="btn btn-light p-1" title="Click to remove"
                            onClick={() => removeCard(i)}>
                        <CardFace card={findCard(game, cardName)} />
                    </button>
                ))}
            </div>
        </div>
    )
}
export default HandPicker;
