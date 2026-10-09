# Arcade Website - Featuring Galaxy Attackers

### Live on Render: https://arcade-website-h4xy.onrender.com 

### Demo Video: https://wpi0-my.sharepoint.com/:v:/g/personal/fsregan_wpi_edu/IQBCMhdKHpgxSKTgREukA9lSAQwRntG-xhhK1sDKmJwbb14

## Description

As a group, we worked on a Galaga-inspired, retro-themed game with a leaderboard for the top 9 scores (top 10 is too basic). The player of the game has the choice of creating their own account or playing as a guest. As the game goes on, the enemies get faster, and it becomes harder to progress. When the enemy charges at you, double points are received if you shoot it before it takes your life. You get 3 lives, and once you die, if your score is high enough to be in the top 9, you can see yourself on the leaderboard!

## Additional Info

Once you land on the login page, you can either make a new account by typing in a name and password, log in to an existing user (there is a dummy account for player1 (pass: arcade)), or play as a guest. 

After that, you will be presented with games you can play (with our original goal, it is only Galaxy Attackers). Select it, and you will be redirected to the game page. Instructions are at the bottom. Press Start to play. If you want to replay, press Reset.

## Technologies

HTML, CSS, JavaScript: used to build the website, style it, and create the interactive game

Canvas API: Used to render the game

Node.js and Express: Create the server and handle the login information

MongoDB: Store user account information along with scores for the leaderboard

Cookie Sessions: Maintain the user and guest sessions

Bcryptjs: Used for password hashing 

Render: Used to deploy the project itself

## Challenges

Deploying on Render raised new problems with case-sensitive naming. For example, in Player.js, the sprite being uppercase as "Sprites/galaxy_player.png" caused the robots to not show up in Render, when they did in localhost. Another challenge was testing with MongoDB. Since one member had the database and the .env wasn’t included in GitHub, that meant that in order to test and make changes, members had to make another database for themselves. 

## Responsibilities

**Ella Brown**: Worked on HTML, CSS visuals, button functionality, background sprite, and gameplay (player lives, points, collision, and movement). The game was created with JavaScript and the Canvas API.

**Eris Ropi**: Worked on the user login information and was in charge of the MongoDB database that allowed the leaderboard to remain after the website closes. Used cookie sessions to keep track of the users. Helped with api.js, server.js, and login.html in order to achieve proper logins. 

**Hung Dao**: Designed the login and game select page. Added a leaderboard to the games and connected it to the game. Helped with login by making the website work with a dummy account before actual database work.

**Finn Regan**: Created all of the game sprites (player, enemies with variants, player and enemy bullets, and scrolling background), as well as all audio assets (not heard in the video). Enemy behavior: enemies spawn offscreen, come into their “home state”, then at a random interval, dive across to the other side shooting bullets, then dive at the player, then teleport to the top and return to their home. I created all of the collisions between enemies, players, and their bullets. Created an enemy manager which controls when and where enemies spawn, giving enemy blocks a distinct sprite, as well as making enemies more difficult the higher your score is.
