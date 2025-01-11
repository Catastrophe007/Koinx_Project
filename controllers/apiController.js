import {Coin} from '../models/coins.js';

export const apiController = {
    getStats: async (req, res) => {
      try {
        const coins = req.query.coin;
        if (!coins) return res.status(400).json({ message: "Please provide coin" });
  
        const coinsArray = coins.split(",");
        const result = {};
  
        for (let coin of coinsArray) {
            // console.log(coin);
          const data = await Coin.findOne(
            { coin: coin }, 
            {},
            { sort: { $natural: -1 } }
          );
  
          if (data) {
            result[coin] = {
              price: data.price,
              market_cap: data.market_cap,
              change_24h: data.change_24h,
            };
          }
        }
  
        if (Object.keys(result).length === 0) {
          return res
            .status(404)
            .json({ message: "No stats found. Check coin names properly." });
        }
  
        return res.status(200).json(result);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  };
  