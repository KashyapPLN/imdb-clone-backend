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



app.use('/user',userRouter);
app.use('/movie',moviesRouter); 
app.use('/movie-details',movieDetailsRouter); 
app.use('/person',personsRouter); 
app.use('/actor',actorsRouter); 
app.listen(PORT,()=>console.log(`App Started in ${PORT}`));