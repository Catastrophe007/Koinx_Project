import * as NATS from 'nats';
import dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config();

async function start() {
  try {
    // Make sure we have a NATS_HOST
    if (!process.env.NATS_HOST) {
      console.warn('NATS_HOST environment variable not set, using default: nats://localhost:4222');
      process.env.NATS_HOST = 'nats://localhost:4222';
    }

    console.log(`Connecting to NATS server at: ${process.env.NATS_HOST}`);
    
    // Connect to NATS with proper error handling and timeout
    const nc = await NATS.connect({ 
      servers: process.env.NATS_HOST,
      timeout: 5000,
      reconnect: true,
      maxReconnectAttempts: -1 // Unlimited reconnect attempts
    });
    
    console.log('✅ Connected to NATS successfully');
    console.log(`Server ID: ${nc.info.server_id}`);
    console.log(`Server Version: ${nc.info.version}`);
    
    // Create string codec for encoding messages - IMPORTANT CHANGE
    const sc = NATS.StringCodec();
    
    // Test immediate publish to verify connection
    try {
      nc.publish("crypto.update", sc.encode(JSON.stringify({ 
        trigger: "initial_test",
        timestamp: new Date().toISOString() 
      })));
      console.log("✅ Initial test message published");
    } catch (err) {
      console.error('❌ Failed to publish initial test message:', err);
    }
    
    // Set up subscription to our own topic to verify messages are flowing
    const sub = nc.subscribe("crypto.update", {
      callback: (err, msg) => {
        if (err) {
          console.error('Subscription error:', err);
          return;
        }
        const data = sc.decode(msg.data);
        console.log(`✅ Message received on ${msg.subject}:`, data);
      }
    });
    console.log("✅ Subscription to crypto.update established");
    
    // Schedule the cron job
    console.log("Starting cron schedule (every minute)...");
    cron.schedule('*/15 * * * *', () => {
      try {
        // Use the StringCodec instead of Buffer - IMPORTANT CHANGE
        nc.publish("crypto.update", sc.encode(JSON.stringify({ 
          trigger: "update",
          timestamp: new Date().toISOString() 
        })));
        console.log(`🔄 Event published at ${new Date().toLocaleTimeString()}: update`);
      } catch (err) {
        console.error('❌ Failed to publish scheduled event:', err);
      }
    });

    // Handle connection closed event
    nc.closed().then(() => {
      console.log("NATS connection closed");
    }).catch((err) => {
      console.error('NATS connection closed with error:', err);
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      console.log("Shutting down...");
      await sub.unsubscribe();
      await nc.drain();
      process.exit(0);
    });
    
  } catch (err) {
    console.error('❌ Failed to connect to NATS:', err);
    console.error('Error details:', err.message);
    process.exit(1);
  }
}

// Start the application
start();