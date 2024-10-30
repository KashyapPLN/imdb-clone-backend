import { client } from "./index.js";
import { ObjectId } from "mongodb";
import express from 'express';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const router = express.Router()


router.post('/signup', async (req, res) => {
  console.log(req.body);
  const { emailId, password, name } = req.body;

  if (!emailId || !password) {
    return res.status(400).send({ msg: 'EmailId and password are required!' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const database = client.db('imbd-clone-app');
    const collection = database.collection('users');

    // Check if the user already exists
    const existingUser = await collection.findOne({ emailId });
    if (existingUser) {
      return res.status(409).send({ msg: 'User with this email already exists!' });
    }

    // If user does not exist, create a new user
    const user = { _id: emailId, password: hashedPassword, name };
    await collection.insertOne(user);
    res.status(201).send({ msg: 'User signed up successfully' });

  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).send({ msg: 'Internal Server Error' });
  } finally {
    // Ensure the database connection is closed properly
    await client.close();
  }
});


  router.post('/login', async (req, res) => {
    const { emailId, password} = req.body;
    
    if (!emailId || !password) {
      return res.status(400).send('Email and password are required');
    }
  
    try {
      const database = client.db('imbd-clone-app');
      const collection = database.collection('users');
  
      const user = await collection.findOne({ _id: emailId });
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send('Invalid password');
      }
    const userName= user.name
      const token = jwt.sign({ emailId: user._id,name:user.name }, process.env.SECRET_KEY, { expiresIn: '1h' });
  
      res.status(200).send({msg:"Login Successful",token:token});
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  router.get('/user-data/:emailId', async (req, res) => {
    const emailId = req.params.emailId;
  console.log("emai lis",emailId);
    try {
      const database = client.db('imbd-clone-app');
      const collection = database.collection('users');
  
      const user = await collection.findOne({ _id: emailId });
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.status(200).json({
        name: user.name || '',
        age: user.age || '',
        mobile: user.mobile || '',
        dob: user.dob || '',
        gender: user.gender || ''
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.put('/user-data', async (req, res) => {
       const { name, age, mobile, dob, gender,emailId } = req.body;
  
    try {
      const database = client.db('imbd-clone-app');
      const collection = database.collection('users');
  
      const updateFields = {};
      if (name) updateFields.name = name;
      if (age) updateFields.age = age;
      if (mobile) updateFields.mobile = mobile;
      if (dob) updateFields.dob = dob;
      if (gender) updateFields.gender = gender;
  
      await collection.updateOne({ _id: emailId }, { $set: updateFields });
  
      res.status(200).send({msg:'User data updated successfully'});
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
 
  export const userRouter = router;