import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();
import Subscription from "../models/Subscription.js";
import data from './mock.js';


mongoose.connect(process.env.DATABASE_URL).then(() => console.log("DB Connected"));

await Subscription.deleteMany({});
await Subscription.insertMany(data);
console.log("DB Seeding Successful!");

mongoose.connection.close();