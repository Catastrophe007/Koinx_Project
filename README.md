

---

# Cryptocurrency Price and Deviation API

This project is a server-side application developed using Node.js and MongoDB. It implements background jobs to fetch cryptocurrency data, exposes APIs to retrieve the latest data and price deviation for specific coins, and runs periodic tasks to update the database.

## Features
1. **Background Job**: Fetches cryptocurrency data every 2 hours from CoinGecko API for Bitcoin, Matic, and Ethereum, and stores the details in MongoDB.
2. **API Endpoints**:
   - `/api/stats`: Returns the latest cryptocurrency data (price, market cap, and 24-hour change) for multiple coins.
   - `/api/deviation`: Returns the standard deviation of the cryptocurrency's price for the last 100 records for multiple coins.

## Setup Instructions

### Prerequisites
1. **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. **MongoDB**: Make sure you have a running MongoDB instance.
3. **Redis**: Ensure that Redis is installed and running on your machine.

### Environment Variables Setup
Before running the application, you need to configure the environment variables in a `.env` file in the root directory:

```bash
PORT=3000 # Port for the server to run on
COINGECKO_API_KEY=your_coingecko_api_key_here # Your CoinGecko API Key
REDIS_PORT=6379 # Redis Port
MONGODB_URI=mongodb://localhost:27017/cryptocurrency_db # MongoDB connection URI
HOST=localhost # Host for server
```

### Install Dependencies

```bash
npm install
```

### Running the Application

#### 1. Start the Background Queue (fetch data every 2 hours)
Run the following command to start the background job that fetches the cryptocurrency data from CoinGecko:

```bash
node queue.js
```

This script will run in the background, fetching the data every 2 hours.

#### 2. Start the Worker to Enact Queue
Run the following command to start the worker that processes the queued tasks:

```bash
node worker.js
```

#### 3. Start the Server
To start the application server (for handling API requests), run the following command:

```bash
npm run dev
```

The server will run on the port specified in the `.env` file (default `3000`).

### API Endpoints

#### 1. `/api/stats`
Fetches the latest data for the requested cryptocurrencies.

**Query Parameters:**
- `coin`: A comma-separated list of cryptocurrency names. It can be one or more of the following: `bitcoin`, `matic`, `ethereum`.

**Sample Request:**
```http
GET http://localhost:3000/api/stats?coin=bitcoin,ethereum
```

**Sample Response:**
```json
{
  "bitcoin": {
    "price": 40000,
    "marketCap": 800000000,
    "24hChange": 3.4
  },
  "ethereum": {
    "price": 2500,
    "marketCap": 300000000,
    "24hChange": 2.1
  }
}
```

#### 2. `/api/deviation`
Calculates the standard deviation of the price for the requested cryptocurrencies, using the last 100 stored records.

**Query Parameters:**
- `coin`: A comma-separated list of cryptocurrency names. It can be one or more of the following: `bitcoin`, `matic`, `ethereum`.

**Sample Request:**
```http
GET http://localhost:3000/api/deviation?coin=bitcoin,ethereum
```

**Sample Response:**
```json
{
  "bitcoin": {
    "deviation": 4082.48
  },
  "ethereum": {
    "deviation": 120.56
  }
}
```

---

