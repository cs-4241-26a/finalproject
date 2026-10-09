Gompei's Lost & Found - CS4241 Final Project
===

Noah Freeman
Zackary Perry

## Gompei's Lost & Found - https://finalproject-freeman-perry.onrender.com/

## Demo Video - https://youtu.be/wA56caS0G-k?si=f7vpV60scTQUbecB

### Description:
This final project submission is a Lost & Found service specifically catered towards the WPI community. Students and faculty can use the service to make posts about personal items that have gone missing, or to report other items that were found by themselves on campus. Upon creating an account and signing in, a site visitor will be able to view a corkboard of various submissions made to the service, along with the ability to filter them by poster, post type, and whether or not the post has already been resolved. A user can then go on to make a post of their own. Each post requires a title, with the option of adding a description and image as well. 

Once a post has been made and thus added to the corkboard, other users aside from the poster can visit the post and start threads on it to communicate with the poster. Threads are private been the creater of the thread and the poster that they're reaching out to, meaning no other users can view these conversations. If a poster feels satisfied with a conversation they had in a thread (i.e., a lost item was found, they were able to return a missing belonging to another user. etc.), then they can mark their post as resolved, adding it to the list of archives within the server database.

### Some Instructions
To fully use Gompei's Lost & Found, a user will first need to register an account and then sign in with it. The account requires a username, password, display name, and the optional inclusion of a user's residence hall.


### Technologies Used
For the backend of the website, Node.js and Express were used to configure a modular REST API using ES modular syntax and custom route layering. MongoDB was used as a cloud-based host for the data that needed to be stored, such as posts and message threads, with the use of Mongoose allowing for the implementation of structured schemas. For account authentication in particular, jsonwebtoken was used to ensure stateless token signing so that users are continously checked to see if they're properly logged in. Finally, bcryptjs is used to guarantee secure password hashing upon the creation of a user account before the information becomes stored in the server database.

For the frontend of the website, React and TypeScript were used alongside Vite. Material UI and many of its components were used for appearances. The client uses FileReader to import images from the deivce and then convert them to Base64 encoded images stored in the db.


### Challenges Faced/Achievements
Continuous Session Invalidation Checking: An active token tracking set was layered into the authentication middleware, allowing GET /auth/logout to instantly revoke tokens server-side before their expiration. Tokens are stored in browser http only cookies and persist through refreshes allowing the user to stay logged in.

Strict DTO & Response Enveloping: Every backend endpoint adheres to a standardized SimpleResponse format, which is an equivalent to a JSON message but with the inclusion of a status message and boolean describing whether a given request was successful or not.

Base64 String to Image conversion: MondoDB stores JSONs specifically, meaning that item images that appear on our website had to be transported and stored entirely as text strings. The frontend would then need to convert the Base64 strings to their respectives images and vice versa

### Group Delegation
Noah and Zack initially worked together to conceptualize and design how Gompei's Lost & Found would work as a website. Following the submission of our Project Proposal, the work was then divided. Noah worked on the frontend implementation of the website, while Zack worked on the backend implementation of the website.