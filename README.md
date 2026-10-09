# WPI Guessr

[Play WPI Guessr](https://finalproject-mscf.onrender.com/)

Our project is a WPI version of Geoguessr. It is a web based game where players are shown locations from around campus and need to guess where the location is on a map. During a round, the player views a static outdoor image and clicks on a zoomable campus map to pinpoint where the photo was taken. Each game consists of 5 rounds. Scores are calculated based on how close the guess was to the location.

There are user accounts to login and save your progress. There is a global leaderboard where you can see how your best score compares to others.

## Instructions
To play the game, register for an account with a username and password. Once logged in, start the game. You will be presented with an image. Use the provided map to select where you believe the image was taken. 

To run locally:
1. Install [Volta](https://volta.sh/).
2. Run `apps/api/migrations/001_accounts.sql` in your Supabase SQL editor.
3. Install dependencies: `npm install`
4. Start the app: 
`DATABASE_URL='postgresql://...' SESSION_SECRET='replace-with-a-random-secret' npm run dev`

The web app runs at `http://localhost:5173`. The API runs at `http://localhost:3000`.

## Technologies Used
- **React & Vite**: The frontend user interface.
- **Leaflet & React-Leaflet**: The interactive map for players to select their guess locations.
- **Express & Node.js**: The backend API, managed game state, and handled routing.
- **Passport.js**: Local user authentication and session management.
- **PostgreSQL & Supabase**: User accounts, encrypted passwords, and game scores for the leaderboard.

## Challenges
- Connecting the front-end to the back-end was a bit of a chore. 
- Maintaining a consistent styling across the UI since multiple team members worked on different front-end components. 
- Stopping the user from being served the same level twice in the same game.
- Letting the user refresh their browser and not have their game state be messed up.

## Team Roles
- **Myer Cheng**: User account backend and API
- **Dexter Haehnichen**: Game Backend, taking pictures and mapping pictures to coordinates.
- **Thomas Gilbert**: Login and Lobby Front-end UI
- **David Peterson**: Game Frontend, API integration, taking pictures. 

## Project Video
[Watch our Demo Video](https://www.youtube.com/watch?v=KJuAP0hsRr0)
