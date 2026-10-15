CS4241 Final

1. A brief description of what you created, and a link to the project itself (two paragraphs of text)
   
https://musicmachinefinalproject.onrender.com/

What we made is a physics-based music maker, kinda like a rube goldberg machine. How it works is you are presented with several options for things you can place onto the sandbox in the middle. The rectangle, triangle, and circle options all give you blocks of various shapes (as listed). The spawner creates a ball entity every 2 seconds that can interact with the blocks. The killbox deletes entities when they touch it. Finally, the select tool selects blocks to be edited, and the remove tool simply removes all blocks. The things you place and delete on this canvas are saved to the server. 

Editing with the select tool allows you to change various properties inside of blocks. So you can adjust the angle with the angle parameter (woah), the pitch with the pitch parameter (no way), and the instrument with, you guessed it, the instrument parameter (who would have thought). When a ball entity hits the block, it will play the instrument and pitch as selected - the default being the piano at a pitch of C2. The currently available instruments are piano and trumpet, with both having pitch options from C2 to C4. 

2. Any additional instructions that might be needed to fully use your project (login information etc.)
   
No additional instructions are required, its all very intuitive. 

3. An outline of the technologies you used and how you used them.
   
We used matter.js, howler, and express for the project. Matter.js was used for the physics system, which helped a lot because writing a good physics system takes a lot of time. It handles labeling (tagging) all the blocks, events such as when blocks hit other blocks, mouse support with the blocks, and a bunch of other useful stuff. Matter.js was also used to do the graphics for the shapes. Howler was used as the audio engine, which is useful because it handles audio easily and can load it asynchronously. Express was used for the server side stuff so all the blocks can be stored. 

4. What challenges you faced in completing the project.
   
(Hawthorn) I've never used matter.js and howler before, so while still being relatively new to js learning how to use outside frameworks was a challenge. A difficult part of matter was figuring out how I'd make the blocks store their instrument and pitch, and how to connect those to the .wav files I had. After research and looking at matter.js's documentation I found bodies (the shapes) have a bunch of information associated with them, with one such piece of information being the label. So, I just concatenated the instrument and pitch into the label and used that directly as the names of the .wav files. Overall just learning all the different parts of matter.js was a challenge, there's a lot to it. Another challenge was getting the sounds to not buffer until a user input has been detected, then just blast your ears. When a sound played through howler the browser puts a hold onto it until the first time a user shows they're doing stuff on the website, so without it all the sounds will just wait until they all play at once. We weren't able to bypass the browser putting a hold on it, but we did add a start screen which forced user input before the physics part started (I didn't program that part though). The most challenging challenge of all though was making sure everyone did the work for the assignment on time. 

(Jonathan) The hardest part for me was making sure that the Render functionality in Matter.js worked properly during testing and deployment. The Render functionality is capable for small-scale, basic graphics rendering. I was originally going to have other effects shown on the spawned entities, however I had decided to abandon the concept due to needing a different graphics framework to implement everything properly. One of the issues that took up the most time for me is the fact that wireframes for rendered shapes are turned on by default in Matter.js. If wireframes are on, any color changes made will not be visible. I used HTTP server hosting to test the rendered shapes, which requires fully shutting down the server and reopening it on a separate window to load any changes done.

(Jonah) The first challenge i encountered was Keeping the physics world after a refresh. Matter.js runs in the browser, so every refresh wiped the world. I added a small Express server that stores a plain-data copy of each shape (type, position, size, angle and note) and sends it back when the page loads. The server never runs any physics. It only remembers, and main.js rebuilds the real bodies from that data. I also encountered duplicate spawners from failed loads. When loading from the server failed, the fallback starter shapes were saved as new shapes each time, and the spawners piled up and flooded the screen with balls. Fallback shapes are now created without being saved, and the world is reset when the server starts.

(Jacob) I faced a challenge with connecting the ui to the rest of the phyiscs and the machine. I machine kept breaking when I was implementing my code, after some debugging and teamwork, i was able to work around the difficulties.

5. What each group member was responsible for designing / developing.
   
(Hawthorn) I was responsible for implementing the physics and all the logic that comes with it, the audio logic with it's .wav files, and also just being an ideas guy. 

(Jonathan) I implemented the graphics for the music machine. This includes the colors of each part that is interacted with on the canvas.

(Jonah) I built the server side of the project: an Express server.js that stores each shape and saves it to a file, with routes to add, update, delete and list shapes. I also wrote the code in main.js that sends every change to the server and rebuilds the physics world from it on refresh, so the user’s world is still there after reloading

(Jacob) I added the ui to the music machine. including the start screen, and the buttons on the left bar menu, as well as the right bar menu where you can adjust and choose the instrument type, pitch and angle of a block.

6. A link to your project video.
   
https://drive.google.com/file/d/1CgCOeruGx6pWHc-YdjFWDoqt9ob7OdE7/view?usp=drive_link



