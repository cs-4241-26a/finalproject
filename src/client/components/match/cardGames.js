// Card sets and the games that use them.
// A card set is a list of groups (shown as tabs in the hand picker), each with a list of cards:
//   { name, image, label, copies }
//   name:   what gets saved in a match's hand
//   image:  path inside public/cardPictures/
//   label:  optional shorter text to show under the picture (defaults to name)
//   copies: how many of this card exist in the game's deck, so no more than that can be dealt in a match

const UNO_COLORS = ["Red", "Green", "Blue", "Yellow"]
const UNO_VALUES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Skip", "Reverse", "Draw 2"]

const SUITS = [
    { name: "Clubs", symbol: "♣" },
    { name: "Diamonds", symbol: "♦" },
    { name: "Hearts", symbol: "♥" },
    { name: "Spades", symbol: "♠" }
]
const RANKS = [
    { name: "Ace", label: "A" }, ...[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => ({ name: String(n), label: String(n) })),
    { name: "Jack", label: "J" }, { name: "Queen", label: "Q" }, { name: "King", label: "K" }
]

const COUP_CARDS = [{
    name: "Cards",
    cards: ["Duke", "Assassin", "Captain", "Ambassador", "Contessa"]
        .map(name => ({ name, image: `coupCards/${name}.png`, copies: 3 }))
}]

const UNO_CARDS = [
    ...UNO_COLORS.map(color => ({
        name: color,
        cards: UNO_VALUES.map(value => ({
            name: `${color} ${value}`,
            label: value, // the picture shows the color
            image: `unoCards/${color.toLowerCase()}/${color}_${value.replaceAll(" ", "_")}.jpg`,
            copies: value === "0" ? 1 : 2 // each color has one 0 and two of everything else
        }))
    })),
    {
        name: "Wild",
        cards: [
            { name: "Wild", image: "unoCards/wild/Wild.jpg", copies: 4 },
            { name: "Wild Draw 4", image: "unoCards/wild/Wild_Draw_4.jpg", copies: 4 }
        ]
    }
]

// The standard 52-card deck (no jokers), one group per suit
export const STANDARD_DECK = SUITS.map(suit => ({
    name: suit.name,
    cards: RANKS.map(rank => ({
        name: `${rank.name} of ${suit.name}`,
        label: `${rank.label}${suit.symbol}`,
        image: `cardDeck/${suit.name.toLowerCase()}/${rank.name.toLowerCase()}_of_${suit.name.toLowerCase()}.png`,
        copies: 1
    }))
}))

// Games that record each player's starting hand, keyed by the exact game name.
//   groups:  the card set to pick from
//   maxHand: most cards a starting hand can have
// To support another card game, add an entry here.
export const CARD_GAMES = {
    Coup: { groups: COUP_CARDS, maxHand: 2 },
    Uno: { groups: UNO_CARDS, maxHand: 7 }
}

/**
 * The cards and hand size to use for a game's starting hands, or null if the game doesn't record hands.
 * Built-in games (CARD_GAMES) come first. A game made with the game form uses the standard
 * 52-card deck, if it was set up as a card game where each player gets a starting hand.
 */
export const getHandRules = (game) => {
    if (!game) return null
    if (CARD_GAMES[game.name]) return CARD_GAMES[game.name]
    if (game.cardGame && game.dealsHand) return { groups: STANDARD_DECK, maxHand: game.handSize }
    return null
}

// Finds a card by name, so a stored hand (a list of card names) can be shown with pictures
export const findCard = (game, cardName) => {
    const cards = game.groups.flatMap(group => group.cards)
    return cards.find(card => card.name === cardName) ?? { name: cardName, image: null }
}
