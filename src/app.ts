import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares or routes
// e.g.

app.get("/", (req: Request, res: Response) => {
  res.send("welcome 2 documed!!! :)");
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
