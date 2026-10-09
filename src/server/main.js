import 'dotenv/config'
import express from "express";
import ViteExpress from "vite-express";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import plannerRouter from './planner.js';

const app = express();
const appdata = []
let gpa = 0.0
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@${process.env.HOST}`
const client = new MongoClient( uri )
let db
app.use( express.json() )
app.use('/data', plannerRouter);

app.post( '/read', async ( req, res ) => {
  const {userId} = req.body
  const formEntry = db.collection('entries')
  const userGPA = db.collection('gpa')

  const allEntries = await formEntry.find({id: userId}).toArray()
  const gpaRecord = await userGPA.findOne({id: userId})
  
  return res.json({
    entries: allEntries,
    gpa: gpaRecord
  })

})

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const users = db.collection("users");

    const existingUser = await users.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username,
      password: hashedPassword,
    });

    res.json({
      success: true,
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create account.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const users = db.collection("users");

    const user = await users.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    console.log("Password matches:", passwordMatches);

    if (!passwordMatches) {
      return res.json({
        success: false,
        message: "Incorrect username or password.",
      });
    }

    res.json({
      success: true,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
})

app.post( '/add', async ( req,res ) => {
  const {userId, assignmenttype, gradeletter, cmts} = req.body
  const formEntry = db.collection('entries')
  const userGPA = db.collection('gpa')
  let newGPA = 0.0

  const newEntry = {
    id: userId,
    assignmenttype: assignmenttype,
    gradeletter: gradeletter,
    cmts: cmts,
  }
  await formEntry.insertOne(newEntry)
  const userEntries = await formEntry.find({ id: userId }).toArray()
  if (gpa == 0.0){
    if (gradeletter == "a"){
      newGPA = 4.0
    } else if (gradeletter == "b"){
      newGPA = 3.0
    } else if (gradeletter == "c"){
      newGPA = 2.0
    } else if (gradeletter == 'd'){
      newGPA = 1.0
    }
    gpa = newGPA
  } else {
    userEntries.forEach( entry => {
      const grade = entry.gradeletter
      if (grade == "a"){
        newGPA += 4.0
      } else if (grade == "b"){
        newGPA += 3.0
      } else if (grade == "c"){
        newGPA += 2.0
      } else if (grade == 'd'){
        newGPA += 1.0
      }
    })
    gpa = (newGPA / userEntries.length).toFixed(2)
  }
  if (await userGPA.findOne({id: userId})){
    await userGPA.updateOne( 
      {id: userId},
      {$set:{GPA: gpa}}
    )
  } else{
    await userGPA.insertOne({id: userId, GPA: gpa})
  }
  res.json({
    entries: userEntries,
    updatedGPA: gpa 
  })
})

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const users = db.collection("users");

    const existingUser = await users.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username,
      password: hashedPassword,
    });

    res.json({
      success: true,
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create account.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const users = db.collection("users");

    const user = await users.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.json({
        success: false,
        message: "Incorrect username or password.",
      });
    }

    res.json({
      success: true,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
});

app.get("/api/readings", async (req, res) => {
  try {
    const userId = req.query.userId;

    const readings = await db
      .collection("readings")
      .find({ userId: userId })
      .toArray();

    res.json(readings);
  } catch (error) {
    console.error("Error getting readings:", error);
    res.status(500).json({ error: "Could not get readings." });
  }
});

app.post("/api/readings", async (req, res) => {
  try {
    const newReading = {
      userId: req.body.userId,
      title: req.body.title,
      author: req.body.author,
      course: req.body.course,
      type: req.body.type,
      url: req.body.url,
      pagesRead: Number(req.body.pagesRead),
      totalPages: Number(req.body.totalPages),
      status: req.body.status,
      dueDate: req.body.dueDate,
      notes: req.body.notes,
    };

    newReading.percentComplete = Math.round(
      (newReading.pagesRead / newReading.totalPages) * 100
    );

    const result = await db.collection("readings").insertOne(newReading);

    newReading._id = result.insertedId;

    res.json(newReading);
  } catch (error) {
    console.error("Error adding reading:", error);
    res.status(500).json({ error: "Could not add reading." });
  }
});

app.put("/api/readings/:id", async (req, res) => {
  try {
    const pagesRead = Number(req.body.pagesRead);
    const totalPages = Number(req.body.totalPages);

    const updatedReading = {
      title: req.body.title,
      author: req.body.author,
      course: req.body.course,
      type: req.body.type,
      url: req.body.url,
      pagesRead: pagesRead,
      totalPages: totalPages,
      status: req.body.status,
      dueDate: req.body.dueDate,
      notes: req.body.notes,
      percentComplete: Math.round((pagesRead / totalPages) * 100),
    };

    const result = await db
      .collection("readings")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id)},
        { $set: updatedReading },
        { returnDocument: "after" }
      );

    if (!result) {
      return res.status(404).json({ error: "Reading not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating reading:", error);
    res.status(500).json({ error: "Could not update reading." });
  }
});

app.delete("/api/readings/:id", async (req, res) => {
  try {
    const result = await db.collection("readings").deleteOne({
      _id: new ObjectId(req.params.id), userId: req.query.userId,
    });

    if (result.deleteCount === 0) {
      return res.status(404).json({ error: "Reading not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting reading:", error);
    res.status(500).json({ error: "Could not delete reading." });
  }
});

function serializeApplication(application) {
  const { _id, ...fields } = application;
  return { id: _id.toString(), ...fields };
}

app.get("/api/applications", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const applications = await db
      .collection("applications")
      .find({ userId })
      .sort({ dateApplied: -1 })
      .toArray();

    res.json(applications.map(serializeApplication));
  } catch (error) {
    console.error("Error loading applications:", error);
    res.status(500).json({ error: "Could not load applications." });
  }
});

app.post("/api/applications", async (req, res) => {
  const { company, role, dateApplied, resume, status, userId } = req.body;

  if (!company || !role || !dateApplied || !status || !userId) {
    return res.status(400).json({
      error: "Company, role, date applied, status, and user ID are required.",
    });
  }

  const application = {
    company,
    role,
    dateApplied,
    resume: resume || "",
    status,
    userId,
  };

  try {
    const result = await db.collection("applications").insertOne(application);
    res.status(201).json(
      serializeApplication({ _id: result.insertedId, ...application }),
    );
  } catch (error) {
    console.error("Error adding application:", error);
    res.status(500).json({ error: "Could not add application." });
  }
});

app.put("/api/applications/:id", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Application not found." });
  }

  try {
    const result = await db.collection("applications").findOneAndUpdate(
      { _id: new ObjectId(req.params.id), userId },
      { $set: { status: req.body.status } },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.json(serializeApplication(result));
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ error: "Could not update application." });
  }
});

app.delete("/api/applications/:id", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: "Application not found." });
  }

  try {
    const result = await db.collection("applications").findOneAndDelete({
      _id: new ObjectId(req.params.id),
      userId,
    });

    if (!result) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.json(serializeApplication(result));
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ error: "Could not delete application." });
  }
});

async function startServer() {
  try {
    await client.connect();

    db = client.db("pluna");
    app.locals.db = db;

    console.log("Connected to MongoDB");

    ViteExpress.listen(app, 3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
startServer();