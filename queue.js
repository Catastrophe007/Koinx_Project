import { Queue } from "bullmq";
import express from "express";
import dotenv from "dotenv";
import axios from "axios";

import { Coin } from "./models/coins.js";

// const app=express();
dotenv.config();



export const redisOptions = { host: process.env.HOST, port: process.env.RPORT };

const retrieveQueue = new Queue("retrieveQueue", { connection: redisOptions });
console.log("queue started");


async function addJob(job) {
  const options = { repeat: { cron: "* */2 * * * "}};
  await retrieveQueue.add(job.name, job, options);
}




addJob({ name: "retrieveCoinData" });



