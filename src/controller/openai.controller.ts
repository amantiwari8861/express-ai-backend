import type { RequestHandler } from "express";
import openai from "../config/openai.config.js";
import type { ResponseInput } from "openai/resources/responses/responses.js";

const INPUT: ResponseInput = [
  {
    role: "system",
    content: "You are a helpful assistant.",
  },
];

const ChatWithOpenAI: RequestHandler = async (req, res) => {
  const model = process.env.AI_MODEL || "gpt-3.5";
  const { message } = req.body;
  INPUT.push({
    role: "user",
    content: message,
  });
  console.log(model, INPUT);

  const response = await openai.responses.create({
    model: model,
    input: INPUT,
    // input: [
    //   {
    //     role: "system",
    //     content: "You are a helpful assistant.",
    //   },
    //   {
    //     role: "user",
    //     content: message,
    //   },
    // ],
    tools: [
      {
        type: "web_search_preview",
      },
    ],
    store: true,
    include: ["web_search_call.action.sources"],
  });
  console.log(response);

  res.send({ success: true, message: response.output_text });
};





import fs from "fs";
const generateImageWithOpenAI: RequestHandler = async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = process.env.IMAGE_AI_MODEL || "gpt-image-1";

    const result = await openai.images.generate({
      model,
      prompt,
    });

    if (!result.data?.length) {
      return res.status(500).json({
        success: false,
        message: "No image was generated.",
      });
    }

    const imageBase64 = result.data[0]!.b64_json!;

    const imageBytes = Buffer.from(imageBase64, "base64");

    const fileName = `${Date.now()}.png`;

    fs.writeFileSync(fileName, imageBytes);

    return res.json({
      success: true,
      fileName,
      base64: imageBase64,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Image generation failed.",
    });
  }
};

const analyzeSentiment: RequestHandler = async (req, res) => {
  const model = process.env.AI_MODEL || "gpt-3.5";
  const { review } = req.body;
  const response = await openai.responses.create({
    model: model,
    input: [
      {
        role: "system",
        content:
          "You are a helpful assistant. give me answer in 1 word POSITIVE, NEGATIVE or NEUTRAL onlyaccording to the review. if you are not able to detect the sentiment then give me answer as neutral.",
      },
      {
        role: "user",
        content: review,
      },
    ],
  });
  console.log(response);

  res.send({ success: true, sentiment: response.output_text });
};
export { ChatWithOpenAI, generateImageWithOpenAI, analyzeSentiment };