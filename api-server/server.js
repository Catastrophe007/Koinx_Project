
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
// import { retrieveCoinData } from './queue.js';
import routes from './routes/route.js';
import * as NATS from 'nats';
import { storeCryptoStats } from './controllers/storeStats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const NATS_HOST = process.env.NATS_HOST;

// Start the server and initialize connections
const startServer = async () => {
  try {
    // Connect to NATS
    const nc = await NATS.connect({ 
      servers: NATS_HOST, 
    });
    console.log('Connected to NATS');

     // Connect to database
    await connectDB();
    console.log("DB connected");

        // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });


    // Set up NATS subscription
    const sc = NATS.StringCodec();
    const sub = nc.subscribe('crypto.update');
    (async () => {
      for await (const msg of sub) {
        console.log("Received:", sc.decode(msg.data));
        storeCryptoStats();
      }
    })().catch(err => {
      console.error("Subscription error:", err);
    });
   


    // Uncomment if you want to retrieve coin data
    /* 
    retrieveCoinData().then(data => {
      console.log("Data:", data);
    }).catch(error => {
      console.error("Error:", error);
    });
    */
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Middleware
app.use(express.json());
app.use('/api', routes);

// Start everything
startServer();

console.log("hello");