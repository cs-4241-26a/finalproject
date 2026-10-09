Luke Ciarletta  
Max Gingold  
Lex Johnson  
Ryan Veith

We would like to create a board game tracker website. Users can create accounts which enables them to add board games and matches played. Users can create matches of a game and include usernames of other users that played as well as all players scores and who won. We will provide a list of 5-10 official board games (Catan and Coup, among others), but users can add their own games as well. We will also maintain a list of achievements (such as 10 games played on the website) that will be tracked per user. There will be search options for users and games.

Technologies we want to use:
* Javascript  
* MongoDB  
* Express  
* Node js	  
* Favicon library  
* Cookie-session library  
* passport-github2 to use Auth0 if possible
* React (potentially)

Users will have:
* Username  
* Password  
* Profile Picture (optional) \- selected from a list of small predetermined profile pictures  
* Bio (optional) \- string  
* Obtained achievements \- (list of what achievements you have gotten)

Each board game will have fields for:
* Name of game  
* Picture of game (optional)  
* Description of game  
* What function to use to determine the winner (max/min score) (optional)  
* User-added tags (list of strings) \- select from predefined list of strings
   
Each match of a game will have fields for:
* What game it is 
* Who the players were (list of strings) \- supposed to be usernames of accounts  
  * These are stored as strings but displayed as a link to the user with that username if they exist  
* What score each player got (if applicable)
* Who won the game (player name)
* Other notes/comments (string)