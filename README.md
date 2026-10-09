## Utilicheck: Webware 2026a Final Project README


1. Description: Our team created a project called Utilicheck. The goal of the web application is to assist users discover avalible utility providers for their location, solving the issue of manually searching for various providers' avalibility when moving reisdences, or looking to consider other options. Instead of having to check multiple websites, users can simply input their address or ZIP code, and be provided with a list of Electric, Gas, Water, Internet, and Trash providers. Some of these listings include links to webpages or phone numbers, so users can do futher research on their own should a listing pique their interest.

For this project, the top 25 most populated cities in the US (and Worcester) were included in our dataset, targeting the areas where the most people live. There are a total of 1,167 supported ZIP codes within these cities, giving us near total coverage of the areas we're targeting. This is all accessible through a seamless, reactive frontend, with a user system managed by Clerk, with the capability to bookmark searches should a user desire to continue where they left off. You can find it here: https://team-of-four-or-less-webware-26a.onrender.com/

2. Additional Instructions: No additional instructions are required, the website is designed to be intuitive to a layperson

3. Technologies: We used a React + Vite setup for the frontend, and styling using Tailwind. Login is managed using Clerk, and it's hosted on Render. On the backend, we used PrismaORM and PostgreSQL, and hosted our database on Supabase.

4. Challenges: For the most part, our development process as a team went smoothly. For the backend, manually collecting trash and internet data was a chore, but it wasn't particularly difficult. On the frontend, mobile responsiveness posed a challenge, but it was overcome quickly as well.

5. Contributions:

Abhi Chillara - Designed Results Page and added API routes for backend to serve data to results page

Patrick Tirch - Designed Home Page, Navbar, Footer, Search Bar, and assisted in implementation of search feature

William Hanlon - Designed login page, authentication, bookmark features, and mobile design

Will Schieffer - Designing majority of schema, database data collection, Supabase setup and hosting

6. Video Submission: [LINK TO VIDEO HERE](https://drive.google.com/file/d/1_SEnjlkkPvvg8O9HmBAfMz8tD70Jydsa/view?usp=sharing)
