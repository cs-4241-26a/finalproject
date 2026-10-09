
# CS 4241 Final Project Proposal

Members: Noah Freeman, Zack Perry

## Lost & Found Board

Our project proposal is to create an application that hosts a board where users can post items as lost or found. 

### Purpose / Stakeholders

Give people an easy to use tool to help find lost items.
- Users: Students, Faculty
- Places: Universities (WPI)

### Technologies

Frontend: Typescript, React, Material UI
Backend: Express, Mongodb

### Fundamentals

The application will have user accounts. When signed in, a user can make a post to the board. A post can be marked as either lost or found by the poster. A lost post reports an item of the user as lost hoping people will find it. A found post reports that an item with no owner has been found and is looking for the owner. A post can be responded to, starting a private ‘chat’, where another user can report a lost item as found or report a found item as theirs. A response to a post is private and can contain additional details. The posting user can reply back and forth, coordinating a meetup or drop spot for item return. A post can be resolved, edited, or deleted by the posting user at any time. Resolving a post removes it from the board and it will continue to be saved in the archive. Deleting a post completely removes it.

### Rough Operations

- Posts with user creds: Post a post, Post message, Post sign-in, Post get board, Post get post, Post delete post, Post delete user
- Posts without user creds: Post a new user
- Get operations: Get sign-out
- Update with user creds: Update post, Edit user info

### Some Conceptual Constraints

Must be signed in to view anything or perform any actions. Frontend maintains credentials locally and will restrict access to the login page if not signed-in. The server requires user credentials for most actions and authenticates each request before returning data. Usernames are unique, passwords are not. Messages are private between the original poster and another user

### Rough Pages
- Main: Login page — Input user creds or make a new account
- Lost & Found board — shows all posts, can search and set filters
- Post details — Dedicated to one post, displays user’s messages, can make new messages

### Rough Dialogs
- Create user — From login page
- Create post — From board
