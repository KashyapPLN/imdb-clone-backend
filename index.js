import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import { userRouter } from './user.js';
import { moviesRouter } from './movies.js';
import { actorsRouter } from './actors.js';
import { movieDetailsRouter } from './movieCredits.js';
import { personsRouter } from './person.js';

const app= express();
app.use(express.json());
app.use(cors());
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const PORT =process.env.PORT;

async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected");
    return client;
  }
  export const client = await createConnection();
app.get('/',function (req,res){
    res.send("Hello World");
});

// Search API endpoint
app.get('/search', async (req, res) => {
  const searchText = req.query.q;

  if (!searchText) {
    return res.status(400).json({ error: 'Search text is required' });
  }

  try {
  
    // Check for matching person
    const person = await client.db('imbd-clone-app').collection('person').findOne({ name: { $regex: searchText, $options: 'i' } });

    if (person) {
      return res.json({ type: 'person', data: [person] });
    }

    // Check for matching movie in the all array
    const movies = await client.db('imbd-clone-app').collection('movies').findOne({ all: { $exists: true } });
    console.log("The movies are ",movies.all.length);
    if (!movies) {
      return res.status(404).json({ error: 'Movies not found' });
    }

    // Filter matched movies from the 'all' array
   const matchedMovies = movies.all.filter(item => item.title && item.title.toLowerCase().includes(searchText.toLowerCase()));

    if (matchedMovies.length > 0) {
      return res.json({ type: 'movie', data: matchedMovies });
    }

    return res.status(404).json({ error: 'No matches found' });
  } catch (error) {
    console.error('Error during search:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/user',userRouter);
app.use('/movie',moviesRouter); 
app.use('/movie-details',movieDetailsRouter); 
app.use('/person',personsRouter); 
app.use('/actor',actorsRouter); 
app.listen(PORT,()=>console.log(`App Started in ${PORT}`));