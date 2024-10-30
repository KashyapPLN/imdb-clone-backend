import { ObjectId } from 'mongodb';
import { client } from './index.js';
import express from 'express';
const router = express.Router();

// Add person
router.post('/', async (req, res) => {
    try {
        const person = req.body;
        const result = await client.db('imbd-clone-app').collection('person').insertOne(person);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add person' });
    }
});

// Get all persons
router.get('/',  async (req, res) => {
    try {
        const persons = await client.db('imbd-clone-app').collection('person').find().toArray();
        res.json(persons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch persons' });
    }
});


// Get a specific person
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const person = await client.db('imbd-clone-app').collection('person').findOne({ id: Number(id) });
        if (!person) {
            return res.status(404).json({ error: 'person not found' });
        }
        res.json(person);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch person' });
    }
});


// Update a person data
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedperson = req.body;
        const result = await client.db('imbd-clone-app').collection('person').updateOne(
            { id: Number(id) },
            { $set: updatedperson }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'person not found' });
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update person' });
    }
});

// Delete a person
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.db('imbd-clone-app').collection('person').deleteOne({ id: Number(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'person not found' });
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete person' });
    }
});

export const personsRouter = router;