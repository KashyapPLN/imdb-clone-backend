import { ObjectId } from 'mongodb';
import { client } from './index.js';
import express from 'express';
const router = express.Router();

// Add actor
router.post('/', async (req, res) => {
    try {
        const actor = req.body;
        const result = await client.db('imbd-clone-app').collection('actors').insertOne(actor);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add actor' });
    }
});

// Get all actors
router.get('/',  async (req, res) => {
    try {
        const actors = await client.db('imbd-clone-app').collection('actors').find().toArray();
        res.json(actors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch actors' });
    }
});


// Get a specific actor
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const actor = await client.db('imbd-clone-app').collection('actors').findOne({ id: Number(id) });
        if (!actor) {
            return res.status(404).json({ error: 'actor not found' });
        }
        res.json(actor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch actor' });
    }
});


// Update an actor data
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedActor = req.body;
        const result = await client.db('imbd-clone-app').collection('actors').updateOne(
            { id: id },
            { $set: updatedActor }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'actor not found' });
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update actor' });
    }
});

// Delete an actor
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.db('imbd-clone-app').collection('actors').deleteOne({ id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'actor not found' });
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete actor' });
    }
});

export const actorsRouter = router;