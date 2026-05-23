const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
}));

app.use(express.json());

const chatRoutes =
  require("./routes/chatRoutes");

app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send(
    "AI Health Backend Running 🚀"
  );
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});
