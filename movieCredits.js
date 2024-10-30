import { ObjectId } from 'mongodb';
import { client } from './index.js';
import express from 'express';
const router = express.Router();

// Add  movie credits for a movie
router.post('/', async (req, res) => {
    try {
        const movie = req.body;
        const result = await client.db('imbd-clone-app').collection('movie-credits').insertOne(movie);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create movie' });
    }
});

// Read all movies credits
router.get('/',  async (req, res) => {
    try {
        const movies = await client.db('imbd-clone-app').collection('movie-credits').find().toArray();
        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Read a specific movie
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await client.db('imbd-clone-app').collection('movie-credits').findOne({ id: Number(id) });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movie' });
    }
});




// Update a movie's credits
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMovie = req.body;
        const result = await client.db('imbd-clone-app').collection('movie-credits').updateOne(
            { id: Number(id) },
            { $set: updatedMovie }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update movie' });
    }
});



// Delete a movie
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.db('imbd-clone-app').collection('movie-credits').deleteOne({ id: Number(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete movie' });
    }
});



export const movieDetailsRouter = router;