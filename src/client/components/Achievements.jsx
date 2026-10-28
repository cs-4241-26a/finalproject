import { useState, useEffect } from "react"
import AwardAchievementsFunction from "./AwardAchievementsFunction"

function Achievements({username}) { 
    // Storing an achivement in an dictionaly where key is achivement number and an achivement is a array of achivement name, description
    const LIST_OF_ACHIVEMENTS = {
        "1": ["Known Player", "Create an account", "profile"],
        "2": ["Starting out", "Play your first match", "1Card"],
        "3": ["Getting into it", "Participate in 5 matches", "5Card"],
        "4": ["Player of games", "Participate in 10 matches", "10Card"],
        "5": ["Veteran Boardgamer", "Participate in 50 or more matches", "50Card"],
        "6": ["Winner!", "Win your first match", "1Crown"],
        "7": ["Deus ex Machina", "Win 10 or more matches", "10Crown"],
        "8": ["Explorer", "Play 3 different games", "3Cards"],
        "9": ["Jack of all trades", "Play 10 or more different games", "10Cards"],
        "10": ["Dedication", "Win 5 different matches of the same game", "5Crowns"]
    }

    const [completedAchievements, setCompletedAchievements] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (username != "") {
                // Get the current users achievements from server
                const userResponse = await fetch("/getUserByName", 
                    {method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( {username} ) 
                    }
                )
                let userData = await userResponse.json();
                
                // If user has no achievemnts it is a new account so double check for them
                if (userData != null && userData.achievements != null && userData.achievements.length == 0) {
                    await AwardAchievementsFunction([username])

                    // Get updated user since achievemnts will have changed
                    // Get the current users achievements from server
                    const updatedUserResponse = await fetch("/getUserByName", 
                        {method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify( {username} ) 
                        }
                    )
                    userData = await updatedUserResponse.json();
                }

                if (userData != null) {
                    //Get a list of completed achivements
                    //TODO: update userData.achievements with the naming scheme implemented when creating users
                    if (userData.achievements != null) {
                        setCompletedAchievements(userData.achievements)
                    }
                }
            }
        }
        fetchData()
    }, [username])

    // Given an achivement from LIST_OF_ACHIVEMETNS and a boolean of is it completed or not draw it
    const drawAchievement = function(key, achievement, completed) {
        const completedColor = completed ? "#FFD700":"#A3A3A3"
        //const style_color = `width: 200px; height: 300px; background-color: ${completedColor};`
        return (
            <div title={achievement[1]} key={key} style={{border:"1px solid black", width: "100px", height: "100px", backgroundColor: `${completedColor}`, position:"relative", textAlign:"center"}}>
                <p title={achievement[1]}>
                    {achievement[0]}
                </p>
                <img style={{position:"absolute", top:"45px", right:"25px"}} src={"../../../achievementPictures/"+achievement[2]+".png"} alt={achievement[0]} width="50px" height="50px"/>
            </div>
        )
    }

        return (
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap:"auto"}}>
            {Object.entries(LIST_OF_ACHIVEMENTS).map( ([key, value]) => drawAchievement(key, value, completedAchievements.includes(key)) )}
        </div>
        )   
}
export default Achievements;
