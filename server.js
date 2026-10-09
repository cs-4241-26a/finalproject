import "dotenv/config"
import express from "express";
import cookie from "cookie-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { api, connectDb, usersCollection } from "./api.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve /public relative to THIS file, not to whatever folder the host starts
// the process from. With a relative "public", a host that runs `node server.js`
// from another directory can't find the files, answers every request with an
// HTML 404 page, and the browser refuses it:
//   "Expected a JavaScript module script but the server responded with a MIME
//    type of text/html"
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");

// Belt and braces: state the content types the game depends on explicitly.
const TYPES = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use( cookie({
  name: 'session',
  keys: ['a7f3k9x2mQsda8pL4vN6wZ1bT5yR0dE3sH7', 'j9K2mP5vX8qL1asdnR4wT7yB0dF3sH6cA9z']
}))


app.post( '/login', async (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  if (req.body.guest){
    const randomNumber = Math.floor(Math.random() * 1000) + 1
    const guestUsername = `Guest${randomNumber}`
    req.session.username = guestUsername
    req.session.guest = true
    return res.json({ username: guestUsername})
  }
  const {username, password} = req.body
  
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  const existingUser = await usersCollection.findOne({username})

  if (existingUser == null){
    await usersCollection.insertOne( {
      username,
      password
    })
    
    req.session.username = username
    req.session.guest = false
    return res.json({ username })

  }
  if (existingUser.password == password){

    req.session.username = username
    req.session.guest = false
    return res.json({ username })
  }

  return res.status(401).json({error: "Incorrect password."})
})

app.post( '/logout', (req,res)=> {
  req.session = null;
  res.json({ ok: true})
});


app.use(api);

app.get("/login", (req, res) =>{
  res.sendFile(path.join(PUBLIC_DIR, "login.html"))
});

app.use(
  express.static(PUBLIC_DIR, {
    setHeaders(res, filePath) {
      const type = TYPES[path.extname(filePath).toLowerCase()];
      if (type) res.setHeader("Content-Type", type);
    },
  })
);

// A missing .js/.css/.mp3 should fail loudly as a plain 404, not come back as HTML.
app.use((req, res) => {
  res.status(404).type("text/plain").send(`Not found: ${req.path}`);
});

await connectDb();

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});