This final project is brought to you by Hawthorn Wood, Jonathan Tran, Jacob Camoin, and Jonah Weber. For the final project, we're planning a sort of musical rube goldberg machine. Here's the idea. The website itself starts as a blank canvas you can move around with mouse, and a toolkit to the side. This tool kit has a bunch of objects you can drag onto the canvas. These objects are things like circles, rectangles, and triangles. If you drag them onto the canvas, they become a part of it. Then, if you click on the object you made, you can edit it's instrument, size, rotation, all that kind of stuff. Other objects in the toolkit is entity spawners. What entity spawners are is things that summon entities like balls that are affected by gravity. When these entities hit the objects, they play that object's instrument. So, if a spawner summons an entity that hits a trumpet rectangle then a violin circle, it will play a trumpet then a violin. Finally, you can grab a killbox toolkit which kills any entities it touches to prevent tons of entities from cluttering the space. Some more things to note is that you can adjust the canvas's bpm and how/when each spawner spawns entities. 

For project management, we'll be doing a task system where we essentially give someone a task to complete, then they complete it. Some of the frameworks will will be using are matter, express, howler, canvas, pixijs, and react. Matter is useful as a really good 2d Rigidbody physics engine. This will make it so we don't have to do the physics ourselves. Howler is an audio library which should make implementing audio easy, which is important since this project is heavily audio based. Express is just really easy for servers. React is used for front end management for things like the toolkit. Canvas and PixiJS for graphics so that the user can actually tell whats happening. We'll try to use pixijs for the most part but canvas will be useful as a fallback. 





- matter https://brm.io/matter-js/
- express
- howler https://howlerjs.com/
- canvas
- react
- pixijs https://pixijs.com/8.x/guides/getting-started/intro

