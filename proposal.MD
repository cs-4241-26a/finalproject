# Names
Myer Cheng
Dexter Haehnichen
Thomas Gilbert
David Peterson

# Project Description
Our project is a WPI version of Geoguessr. It will be a web based game where players are shown locations from around campus and need to guess where the location is on a map. During a round, the player views a static outdoor image and clicks on a zoomable campus map to pinpoint where the photo was taken. Scores are calculated based on how close the guess was to the location.

We also plan on adding user accounts with OAuth to login, individual player score history, and the core gameplay loop using static outdoor locations.
Some stretch goals we have include a global scoreboard, indoor locations with floorplans, and a tutorial. 

# Technologies

## Front End
We will use React, Vite, TypeScript, and [MUI](https://mui.com/) for the frontend, with Leaflet.js handling the interactive map. 

## Back End
The backend will use Node.js, Express.js, and Passport.js for authentication. Data will be stored in a PostgreSQL database managed through Supabase.