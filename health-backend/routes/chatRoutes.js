const express = require("express");

const router = express.Router();

const OpenAI = require("openai");

const createRetriever =
  require("../rag/retriever");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",

  apiKey:
    process.env.OPENROUTER_API_KEY,
});

router.post("/", async (req, res) => {

  try {

    const { userMessage } = req.body;

    // RETRIEVE RELEVANT DOCS
    const retriever =
      await createRetriever();

    const relevantDocs =
      await retriever.invoke(userMessage);

    // CREATE CONTEXT
    const context =
      relevantDocs
        .map(doc => doc.pageContent)
        .join("\n");

    // SEND TO AI
    const completion =
      await client.chat.completions.create({

      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "system",

          content: `
You are an AI health assistant.

Use this medical context:

${context}
          `,
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
      error: "RAG failed",
    });
  }
});

module.exports = router;