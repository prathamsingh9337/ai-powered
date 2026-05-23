const express = require("express");

const router = express.Router();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",

  apiKey:
    process.env.OPENROUTER_API_KEY,
});

router.post("/", async (req, res) => {

  try {

    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({
        error: "userMessage required",
      });
    }

    const completion =
      await client.chat.completions.create({

    model: "meta-llama/llama-3-8b-instruct",

      messages: [
        {
          role: "system",

          content:
            "You are an AI health assistant.",
        },

        {
          role: "user",

          content: userMessage,
        },
      ],
    });

    const botReply =
      completion.choices[0]
        .message.content;

    res.json({
      botReply,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "AI request failed",
    });
  }
});

module.exports = router;
