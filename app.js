import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import Subscription from './models/Subscription.js';
import cors from 'cors';


mongoose.connect(process.env.DATABASE_URL).then(() => console.log("Connected to DB"));

const app = express();

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch(e) {
      if(e.name === "CastError") res.status(404).send({ message: "Cannot find given id"});
      else if (e.name === "ValidationError") res.status(400).send({ message: e.message });
      else res.status(500).send({ message: e.message });
    }
  }
}

app.get('/subscriptions', asyncHandler(async (req, res) => {
  const sort = req.query["sort"];

  const sortOption = (sort === "price") ? 
    { price: 'asc' } : { createdAt: 'asc' }

  const subscription = await Subscription.find().sort(sortOption);

  res.send(subscription);
}));
app.get('/subscriptions/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;

  const subscription = await Subscription.findById(id);

  if(subscription) res.send(subscription);
  else res.status(404).send({ message: "Cannot found given id." });
}));

app.post('/subscriptions', asyncHandler(async (req, res) => {
  const newSubscription = await Subscription.create(req.body);

  res.status(201).send(newSubscription);
}));

app.patch('/subscriptions/:id', asyncHandler(async (req, res) => {
  const id = req.params["id"];
  const subscription = await Subscription.findById(id);

  if(subscription) {
    Object.keys(req.body).forEach((key) => {
      subscription[key] = req.body[key];
    });
    await subscription.save();
    res.send(subscription);
  } else res.status(404).send({ message: "Cannot find given id." });
}));

app.delete('/subscriptions/:id', asyncHandler(async (req, res) => {
  const id = req.params["id"];
  const subscription = await Subscription.findByIdAndDelete(id);

  if(subscription) res.sendStatus(204);
  else res.status(404).send({ "message": "Cannot find given id." });
}));


app.listen(3000, () => console.log("Server Started"));