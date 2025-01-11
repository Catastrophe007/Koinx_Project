import { Worker } from "bullmq";
import {redisOptions} from "./queue.js";
import axios from "axios";
import { Coin } from "./models/coins.js";
import {connectDB} from './config/db.js'

connectDB().then(()=>{
  console.log("Db connected");
}).catch(error=>{
  console.error("Error:",error);
})

async function retrieveCoinData(){
  const key=process.env.KEY;
  // console.log("inside");
  const coinIds = ['bitcoin','matic-network','ethereum'];
    try {
     
      const ids = coinIds.join(',');
      // console.log("hello");
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        headers: {
          'X-CG-API-KEY': key,  
          'Accept': 'application/json'
        },
        params: {
          ids: ids,
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_change: true
        }
      });
      const data = response.data;
      // console.log("hello");
      // console.log(data);
      const coinDataArray = coinIds.map(coin => ({
        coin,
        price: data[coin].usd,
        market_cap: data[coin].usd_market_cap,
        change_24h: data[coin].usd_24h_change
      }));
      // console.log(coinDataArray);
      // if (!coinDataArray || !coinDataArray.usd) return null;

    

      await Coin.insertMany(coinDataArray);
      console.log('Coin data saved successfully.');
      return coinDataArray;
    } catch (error) {
      console.error('Error:', error.message);
      return error;
    }
  }


const jobHandlers = {
  retrieveCoinData: retrieveCoinData,
};

const processJob = async (job) => {
  const handler = jobHandlers[job.name];

  if (handler) {
    console.log(`Processing job: ${job.name}`);
    // console.log("hello");
    await handler(job);
  }
};

const worker = new Worker("retrieveQueue", processJob, { connection: redisOptions });

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

console.log("Worker started!");
