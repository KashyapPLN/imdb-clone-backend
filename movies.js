import { ObjectId } from 'mongodb';
import { client } from './index.js';
import express from 'express';
const router = express.Router();

// Create a movie
router.post('/', async (req, res) => {
    try {
        const moviesToAdd = Array.isArray(req.body) ? req.body : [req.body]; // Ensure moviesToAdd is an array

        const result = await client.db('imbd-clone-app')
            .collection('movies')
            .updateOne(
                {}, // Empty filter to match the first document
                {
                    $push: { all: { $each: moviesToAdd } } // Use $each to add multiple movies if needed
                }
            );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Movies added successfully' });
        } else {
            res.status(404).json({ error: 'Document not found or updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add movies to the array' });
    }
});

// Read all movies from array
router.get('/:arrayName', async (req, res) => {
    try {
        const { arrayName } = req.params;

        // Validate the array name
        const validArrayNames = ['popular', 'topRated', 'trending','all'];
        if (!validArrayNames.includes(arrayName)) {
            return res.status(400).json({ error: 'Invalid array name' });
        }

        // Query the database
        const movies = await client.db('imbd-clone-app').collection('movies').findOne({ [arrayName]: { $exists: true } });
       
        if (!movies) {
            return res.status(404).json({ error: 'Movies not found for the specified array' });
        }

        // Extract the specific array
        const arrayData = movies[arrayName];

        res.json(arrayData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});


// Read a specific movie from array 

router.get('/:arrayName/:id', async (req, res) => {
    try {
        const { arrayName } = req.params;
        const id = parseInt(req.params.id); // Convert id to a number

        // Validate the array name
        const validArrayNames = ['popular', 'topRated', 'trending','all'];
        if (!validArrayNames.includes(arrayName)) {
            return res.status(400).json({ error: 'Invalid array name' });
        }

        // Fetch the document
        const movies = await client
            .db('imbd-clone-app')
            .collection('movies')
            .findOne({ [arrayName]: { $exists: true } });

        if (!movies || !movies[arrayName]) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Find the specific movie by id in the array
        const movie = movies[arrayName].find(m => m.id === id);

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movie' });
    }
});

// Update a movie in the specified array
router.put('/:arrayName/:id', async (req, res) => {
    try {
        const { arrayName } = req.params;
        const id = parseInt(req.params.id); // Convert id to a number
        const updateData = req.body; // New data to update the movie

        // Validate the array name
        const validArrayNames = ['popular', 'topRated', 'trending','all'];
        if (!validArrayNames.includes(arrayName)) {
            return res.status(400).json({ error: 'Invalid array name' });
        }

        // Update the movie in the specified array
        const result = await client.db('imbd-clone-app').collection('movies').updateOne(
            { [arrayName]: { $elemMatch: { id: id } } },
            { $set: { [`${arrayName}.$`]: updateData } } // `$` finds the matching element in the array
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Movie not found or update failed' });
        }

        res.json({ message: 'Movie updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update movie' });
    }
});

// Delete a movie from the specified array
router.delete('/:arrayName/:id', async (req, res) => {
    try {
        const { arrayName } = req.params;
        const id = parseInt(req.params.id); // Convert id to a number

        // Validate the array name
        const validArrayNames = ['popular', 'topRated', 'trending','all'];
        if (!validArrayNames.includes(arrayName)) {
            return res.status(400).json({ error: 'Invalid array name' });
        }

        // Delete the movie from the specified array
        const result = await client.db('imbd-clone-app').collection('movies').updateOne(
            { [arrayName]: { $elemMatch: { id: id } } },
            { $pull: { [arrayName]: { id: id } } } // `$pull` removes the element with matching id
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Movie not found or delete failed' });
        }

        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete movie' });
    }
});


export const moviesRouter = router;