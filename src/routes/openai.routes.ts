import express from "express";
import {
  analyzeSentiment,
  ChatWithOpenAI,
  generateImageWithOpenAI,
} from "../controller/openai.controller.js";

const openAiRouter = express.Router();

openAiRouter.get("/greet", (req, res) => {
  res.send("Hello Sir/Ma'am How can i help you ?");
});

openAiRouter.post("/chat-openai", ChatWithOpenAI);
openAiRouter.post("/generate-image", generateImageWithOpenAI);
openAiRouter.post("/analyze_sentiment", analyzeSentiment);

export default openAiRouter;
