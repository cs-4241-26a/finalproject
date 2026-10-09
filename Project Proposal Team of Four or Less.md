Team Members: William Schieffer, Patrick Tirch, William Hanlon, Abhi Chillara

Our proposal is a web application that helps users discover available utility providers for their location. Rather than manually searching multiple provider websites to figure out what's serviceable at a given address, users will be able to enter their town (or another identifying field, if that proves easier to work with for lookup purposes) and receive a consolidated list of options across five categories: gas, electric, water, internet, and trash services. This solves a pain point for anyone moving to a new area or comparison-shopping for utilities, where the current process is fragmented and time-consuming.

For the scope of this project, we're limiting coverage to the top 200 U.S. metro areas by population. This keeps the dataset manageable for a project of this timeline while still covering the vast majority of potential users, and the underlying architecture will be built so that additional regions can be added later without significant rework. Our initial focus is on presenting which providers are available in a given area; as a stretch goal, we'd like to layer in average pricing information for each utility category if time permits, giving users a rough cost comparison alongside coverage data. We will seed the database from publicly available datasets and manually curated data for the top 200 metros, and write import scripts so the dataset can be extended later.

The application will be delivered through a reactive, responsive frontend that visually anchors results using the Google Maps API, so users can see their location and get a geographic sense of coverage areas rather than just a plain list. Authentication will be handled so that users can optionally save preferences or past searches, and the backend will be structured around a relational schema to model the many-to-many relationships between locations and providers cleanly.

Key technologies: 

* React \- Web Framework  
* Typescript \- Programming Language  
* Express.js \- Middleware  
* PostgreSQL \- Database  
* Node.js \-   
* Prettier \- Code hygiene  
* PrismaORM \- Schema manager for Postgres  
* OAuth via clerk \- Login / User management  
* Supabase \- Database Hosting (Larger free option than Mongo)  
* TailwindCSS \- Simpler styling  
* Docker \- Containers for local testing  
* Google Maps API \- Frontend API that will be used to display user’s location info