// Game-select page: shows who is logged in and one card per game from /api/games.
// Adding a game means adding an entry to GAMES on the server; nothing here changes.

const playerName = document.getElementById("player-name");
const list = document.getElementById("game-list");
const errorText = document.getElementById("home-error");
const logoutButton = document.getElementById("logout-button");

async function getJson(url) {
    const res = await fetch(url);
    if (res.status === 401) {
        // Session expired: back to the login page.
        window.location.href = "/login";
        throw new Error("Not logged in");
    }
    if (!res.ok) throw new Error(`${url} answered ${res.status}`);
    return res.json();
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function gameCard(game, topScore) {
    const item = el("li");
    const link = el("a", "game-card");
    link.href = game.path;
 
    if (game.thumbnail) {
        const img = el("img", "game-thumb");
        img.src = game.thumbnail;
        img.alt = "";
        link.append(img);
    }
 
    link.append(el("span", "game-title", game.title));
    if (game.blurb) link.append(el("span", "game-blurb", game.blurb));
 
    const best = topScore
        ? `HIGH SCORE ${topScore.score} · ${topScore.username}`
        : "NO HIGH SCORE YET";
    link.append(el("span", "game-best", best));
    link.append(el("span", "game-play", "PLAY ▶"));
 
    item.append(link);
    return item;
}
 
function comingSoonCard() {
    const item = el("li");
    const card = el("div", "game-card coming-soon");
    card.append(el("span", "game-title", "???"));
    card.append(el("span", "game-blurb", "More games coming soon."));
    item.append(card);
    return item;
}

async function load() {
    try {
        const [me, games] = await Promise.all([getJson("/api/me"), getJson("/api/games")]);
        playerName.textContent = me.username;
 
        // One leaderboard request per game, for the high score on each card.
        const tops = await Promise.all(
            games.map((g) =>
                getJson(`/api/scores?game=${encodeURIComponent(g.id)}`)
                    .then((scores) => scores[0])
                    .catch(() => undefined)
            )
        );
 
        list.replaceChildren(...games.map((g, i) => gameCard(g, tops[i])), comingSoonCard());
    } catch (err) {
        if (err.message !== "Not logged in") {
            errorText.textContent = "Couldn't load the games. Try refreshing the page.";
            console.error(err);
        }
    }
}
 
logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    try {
        await fetch("/logout", { method: "POST" });
    } finally {
        window.location.href = "/login";
    }
});
 
load();