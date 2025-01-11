import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'
// import { retrieveCoinData } from './queue.js';
import routes from './routes/route.js';

dotenv.config();

const app=express();
const PORT=process.env.PORT || 5000;

app.use('/api',routes);

app.listen(PORT,async ()=>{
  console.log(`Server running on port ${PORT}`);
  connectDB();
  console.log("Db connected");
})

// retrieveCoinData().then(data=>{
//   console.log("Data:",data);
// }).catch(error=>{
//   console.error("Error:",error);
// })