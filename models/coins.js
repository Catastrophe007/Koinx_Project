import mongoose from 'mongoose';

const coinSchema = new mongoose.Schema({
  coin: String,
  timestamp: { type: Date, default: Date.now },
  price: Number,
  market_cap: Number,
  change_24h: Number
});

export const Coin = mongoose.model('Coin', coinSchema);