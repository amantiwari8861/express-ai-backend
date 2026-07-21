import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import openAiRouter from "./routes/openai.routes.js";
import corsConfig from "./config/cors.config.js";
dotenv.config({ quiet: true });

const PORT = Number(process.env.PORT || 8080);
const HOST_NAME = process.env.HOST_NAME || "localhost";

const app = express();
app.use(morgan("dev"));
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Server is Up And Running!");
});

app.use("/ai", openAiRouter);

app.listen(PORT, HOST_NAME, () => {
  console.log(`listening on http://${HOST_NAME}:${PORT}`);
});
