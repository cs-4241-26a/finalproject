//pass in all usernames to check for new achivemetns
async function AwardAchievementsFunction(listUsernames) { 

    // Function to get Achievements for a user
    const fetchAchievements = async (username) => {
        const userResponse = await fetch("/getUserByName", 
            {method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {username} ) 
            }
        )
        const userData = await userResponse.json();
        if (userData != null) {
            if (userData.achievements != null) {
                return(userData.achievements)
            }
        }    
        // No Achievements to return
        return([])
    }

    // Function to get Matches for a user
    const fetchMatches = async (username) => {
        const userResponse = await fetch("/getFilteredMatches", 
            {method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {"players.name":username} ) 
            }
        )
        const userData = await userResponse.json();
        return(userData)
    }

    // Go though all users in game and assign achivements to them
    for (const username of listUsernames) {
        const achievements = await fetchAchievements(username)
        const userMatches = await fetchMatches(username)
        const achivementLength = achievements.length
        if(!achievements.includes("1")) {
            // Create an account
            // This should really be a seperate case but is fine for now
            achievements.push("1")
        }
        if(!achievements.includes("2")) {
            // Play your first game
            achievements.push("2")
        }
        if(!achievements.includes("3")) {
            // Play your 5 games
            if (userMatches.length >= 5) {
                achievements.push("3")
            }
        }
        if(!achievements.includes("4")) {
            // Play your 10 games
            if (userMatches.length >= 10) {
                achievements.push("4")
            }
        }
        if(!achievements.includes("5")) {
            // Play your 50 games
            if (userMatches.length >= 50) {
                achievements.push("5")
            }
        }
        // 6 and 7 are number of won games
        if(!achievements.includes("7")) {
            const numberWonGames = userMatches.filter((match) => {
                    const self = (match.players.find((player) => player.name == username))
                    if (self !== undefined){
                        return (self.won)
                    }
                }).length
            
            // Win first
            if(!achievements.includes("6")) {
                if (numberWonGames >= 1) {
                    achievements.push("6")
                }
            }
            // Win 10
            if (numberWonGames >= 10) {
                achievements.push("7")
            }
        }
        // 8 and 9 are number of different types of games played
        if(!achievements.includes("9")) {
            // Count different game types
            const gameTypes = []
            for (const match of userMatches) {
                if (!gameTypes.includes(match.gameName)) {
                    gameTypes.push(match.gameName)
                }
            }
            console.log("games", gameTypes)
            // Play 10 different games
            if (gameTypes.length >= 10) {
                achievements.push("9")
            }
            
            // Play 3 differnet
            if (gameTypes.length >= 3) {
                achievements.push("8")
            }
        }
        //Win 5 different matches of the same game
        if(!achievements.includes("10")) {
            const wonGames = userMatches.filter((match) => {
                    const self = (match.players.find((player) => player.name == username))
                    if (self !== undefined){
                        return (self.won)
                    }
                })
            
            const gameTypes = {}
            for (const match of wonGames) {
                if (!(match.gameName in gameTypes)) {
                    gameTypes[match.gameName] = 1
                }
                else {
                    gameTypes[match.gameName] += 1
                }
            }
            for (const value of Object.values(gameTypes)) {
                if (value >= 5) {
                    achievements.push("10")
                }
            }
        }

        // send updates to server
        if (achievements.length != achivementLength) {
            // a new achivement was added so send it if user exists
            
            const doesUserExistResponse = await fetch("/getUserByName", 
                {method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {username} ) 
                }
            )
            const userExists = await doesUserExistResponse.json();

            if (userExists != null) {
                const userResponse = await fetch("/modifyUser", 
                    {method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( {"username":username, "update":{"achievements":achievements} } ) 
                    }
                )
            }
        }
    }
    //return
}
export default AwardAchievementsFunction;
