import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/indexRouter.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);

app.listen(process.env.PORT, console.log(`Listen on port ${process.env.PORT}`));
