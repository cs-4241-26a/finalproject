const express = require('express'),
      fs = require('fs'),
      app = express()

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

// id -> plain-data description of a body (type, position, size, angle, label)
const bodies = new Map()

const FILE = 'bodies.json'
// start fresh every time the server launches

fs.writeFileSync(FILE, '[]')

//or ->> we have to choose
// load saved bodies from disk when the server starts
try {
  for (const b of JSON.parse(fs.readFileSync(FILE, 'utf8'))) bodies.set(b.id, b)
} catch (e) { /* no file yet, start empty */ }

const persist = () => fs.writeFileSync(FILE, JSON.stringify([...bodies.values()]))

app.post( '/submit', (req, res) => {
  res.sendStatus(200)
})

app.post( '/debug', (req, res) => {
  console.log(req.body.message)
  res.sendStatus(200)
})

// main.js calls this on load to rebuild the world
app.get( '/bodies', (req, res) => {
  res.json([...bodies.values()])
})

// a new body was added
app.post( '/bodies', (req, res) => {
  const body = req.body
  if (!body || !body.id || !body.shapeType) {
    return res.status(400).json({ error: 'id and shapeType required' })
  }
  bodies.set(body.id, body)
  persist()
  res.sendStatus(201)
})

// a body was edited (label, angle, position)
app.put( '/bodies/:id', (req, res) => {
  const existing = bodies.get(req.params.id)
  if (!existing) return res.sendStatus(404)
  bodies.set(req.params.id, { ...existing, ...req.body, id: req.params.id })
  persist()
  res.sendStatus(200)
})

// a body was deleted
app.delete( '/bodies/:id', (req, res) => {
  bodies.delete(req.params.id)
  persist()
  res.sendStatus(200)
})

app.listen( process.env.PORT || 3000 )