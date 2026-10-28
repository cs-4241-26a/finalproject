
# Board Game Tracker

Live deployment link: [https\://board-game-tracker-kbud.onrender.com/](https://board-game-tracker-kbud.onrender.com/)

Presentation link: [https\://www\.youtube.com/watch?v=smHqGjBcOVQ](https://www.youtube.com/watch?v=smHqGjBcOVQ)

## Description

We created a board game tracker to record and display information about board games. We have a list of games that can be played. This includes official games that have images and custom cards as well as unofficial, user-added games. Anyone can add new games to the tracker. There are also matches of games, which have information about the players, who won, what their hands were (for card games), and any notes about the match. Anyone is able to view matches, which can be accessed from the home page (most recent matches), game page (matches of that game), or user page (matches played by that user).

We also track users of the application. Users can create an account by entering a new username and the password they want to set at the login screen, and can log back in by entering their existing username and password. Users with an account have achievements that are awarded for playing and winning matches and can add a profile picture (from a list of options) and a bio. This information is all displayed on a user page along with a list of matches that user has played in. Non-users also have a user page that only shows their name and the matches they have played in, as they do not have other profile information tracked.

To use the application, you can explore different games/matches/users without logging in. However, if you want to log in, you can create an account by clicking in the top-right and choosing any username and password.

## Technologies used:

* **React**: We used React as our main development framework, with our pages and several common components implemented using React. We also used react-router-dom for page management and navigation.  
* **Bootstrap**: We used Bootstrap as our CSS framework and used it to style most components on the site. Some additional CSS is provided for custom styling on a few pages.  
* **MongoDB**: We used MongoDB Atlas as our database and interfaced with it using the mongodb js library.  
* **Passport**: We used Passport to manage login and authentication.

## Challenges:

One thing we had difficulty with was implementing Bootstrap. Only one group member was familiar with it, so the rest of us had to learn it so that we could implement some styling as we developed. We also had challenges with coordinating the server and database calls with the front end. Some endpoint calls, especially the filtered get requests and the modify requests, did not behave as expected and needed to be re-worked after implementation to work better with the actual use cases from the front end. 

Additionally there were a few times we had different ideas of naming conventions and needed to work on communication to share what our code was doing so another could use it. An example of this was that many sections of code needed to know if the user was logged in and login made it so all data about the user was available with the user variable, but at first glance it is not intuitive that a non null user means you are logged in.

## Contributions

Luke:

* Created draft layout for the home page  
* Wrote server endpoints and database calls for the game and match tables  
* Set up and managed Mongo database and Render deployment  
* Created forms for adding games and matches (later improved and styled by other team members)  
* Implemented update and delete buttons for games and matches  
* Added sample matches  
* Miscellaneous style improvements throughout (moved pages down so they are not covered by topbar, added margins to various elements, adjusting placement of match/game card images, etc.)

Max:

* Create a draft for the Topbar  
* Did login, users, and made sure most user data was saved in user when modified (bio, username, password) The auth routes for changing bio, username, password, deleting accounts etc.  
* Implemented the search bar and search page for searching for games and users  
* Redesigned and implemented the games and user cards  
* Added card game support for games like Coup, Uno, and the standard 52-card deck, with a functional and easy to use hand pickler and added all of the card images.  
* Created the Submit Match, Add Game, and edit game menus.  
* Added Win conditions for automatic winners for certain games.   
* Match page showing starting hands of the players.  
* Added crown on top of winner on the match cards and the match page.   
* Added Win/Loss Record on user and profile page as well as top player on the game pages. 

Ryan:

* I focused on the profile page and user page. I did the initial user page with picture, bio, and fields for modifying username and password before Max finished login and connected them to logged in users, with space to add achievements and past matches. After that I repurposed Luke's delete match button and used the match list he created to list a player's matches on the profile page. I also wrote the code for displaying achievements, calculating when they are awarded, and changing profile pictures. I did most of the user page since it was basically the same as profile, just with less information and a few if clauses for if a user had an account or not, but I forgot to add the bio, which Max noticed and fixed. Not coding related but I also did the pictures for achievements and default profile pictures. The chess pieces and dice favicon were found online.

Lex:

* Designed initial drafts of the match and game pages  
* Implemented Bootstrap framework  
* Styled all pages of the website consistently using Bootstrap  
* Did art for the “I love games” profile picture