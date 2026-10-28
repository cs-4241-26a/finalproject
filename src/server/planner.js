import {Router} from 'express';
import {ObjectId} from 'mongodb';

const router = Router();


const tasks = (req) => req.app.locals.db.collection('tasks');

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    res.json(await tasks(req).find({ userId }).toArray());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, task, category, deadline } = req.body;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    if (!task || !deadline) {
      return res.status(400).json({error: 'Task and deadline are required'});
    }
    res.json(
      await tasks(req).insertOne({
        userId,
        task,
        category,
        deadline,
        creationDate: new Date().toISOString(),
      })
    );} 
    catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not add task' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { userId, task, category, deadline } = req.body;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const result = await tasks(req).updateOne(
      {_id: new ObjectId(id), userId},
      {$set: { task, category, deadline }}
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update task' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { userId, id } = req.body;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const result = await tasks(req).deleteOne({_id: new ObjectId(id), userId});

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result);
    } 
    catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete task' });
  }
});

export default router;