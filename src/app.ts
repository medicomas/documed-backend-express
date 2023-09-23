import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { router } from "./router";

dotenv.config();

const app = express();

app
  .use(cors())
  .use(express.json())
  .use(router);

export { app };
