import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import registerPortfolioRoutes from "./portfolioRoutes.js";
import registerUserFileRoutes from "./userFileRoutes.js";

dotenv.config();

const app = express();

// DB init
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})
let collection = null
let users = null
let widgets = null

openDB();

// Auth init
const redirect_url = "https://portfolio-maker-le6y.onrender.com/pfolio/"
app.use(session({ 
    secret: process.env.PASSPORT_SECRET, 
    resave: false, 
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.get('/auth/github',
passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/' }),
function(req, res) {
    res.redirect(redirect_url + req.user._id);
});

app.post('/auth/local',

    function(req, res, next) {
        console.log("POST /auth/local");
        console.log("Body:", req.body);
        next();
    },

    passport.authenticate('local', { failureRedirect: '/' }),

    function(req, res) {
        console.log("Authenticating local user");
        console.log("User:", req.user);

        res.redirect(redirect_url + req.user._id);
    }
);

app.get('/auth/logout', function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

passport.serializeUser(function(user, done) {
    console.log(`Serializing: ${JSON.stringify(user)}`)
    done(null, user._id);
});

passport.deserializeUser(async function(obj, done) {
    const user = await users.findOne({ _id: new ObjectId(obj) })
    console.log(`Deserializing: ${obj} --> ${JSON.stringify(user)}`)
    done(null, user);
});

passport.use(new LocalStrategy(
  async function(username, password, done) {
    // create user obj
    let user_obj = { username: username }
    
    const user = await users.findOne(user_obj)
    console.log(`Searching for local user: ${JSON.stringify(user_obj)}`)

    // if user doesn't exist, create it
    if (!user) {
        user_obj.password = password
        await users.insertOne( user_obj )
        return done(null, user_obj);
    }

    // User exists, but password is wrong
    if (user.password !== password) {
        return done(null, false);
    }

    return done(null, user);
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_CLIENTSECRET,
    callbackURL: "https://portfolio-maker-le6y.onrender.com/auth/github/callback"
},
async function(accessToken, refreshToken, profile, done) {
    // console.log(JSON.stringify(profile))
    let user_obj = {username: profile.username, githubID: profile.id}
    let user = await users.findOne({ githubID: user_obj.githubID })

    if (!user) {
        // insertOne returns { insertedId }, not the new user
        const result = await users.insertOne( user_obj )
        user = { _id: result.insertedId }
    }
    
    user_obj._id = user._id
    done(null, user_obj)
}
));

app.get('/user/username', ensureAuthenticated, function(req, res) {
  res.json(req.user.username);
});

app.post('/user/widgets', express.json(), async (req, res) => {
    console.log(`Post Received: ${JSON.stringify( req.body )}`)

    if (widgets !== null) {
        const docs = await widgets.find({_id: new ObjectId("6abc36b3651066defb89b1ca")}).toArray()
        res.json( docs )
    }
})

registerPortfolioRoutes(app, client, ensureAuthenticated);
registerUserFileRoutes(app, client, ensureAuthenticated);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);


async function openDB() {
    await client.connect();
    // collection = client.db("todo").collection("items");
    users = client.db("portfolio_maker").collection("users");
    widgets = client.db("portfolio_maker").collection("widgets");
    console.log("Connected to DB");
};

function ensureAuthenticated(req, res, next) {
    console.log("Ensuring auth", req.isAuthenticated());

    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).send("Unauthorized");
}