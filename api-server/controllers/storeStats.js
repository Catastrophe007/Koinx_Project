import axios from 'axios';
import { Coin } from '../models/coins.js';


export async function storeCryptoStats(){
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
