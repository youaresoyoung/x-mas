import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { initSoket, isNicknameInUse } from "./socket/index.ts";
import { getUserColor } from "./utils/color.ts";

const isDev = process.env.NODE_ENV === "development";

dotenv.config({
  path: isDev ? ".env.local" : ".env",
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: isDev ? process.env.CLIENT_DEV_URL : process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("tiny"));

app.post("/api/entrance", (req, res) => {
  const { nickname } = req.body;

  const trimmed = nickname.trim();
  if (trimmed.length < 2 || trimmed.length > 10) {
    return res.status(400).json({
      available: false,
      message: "Nickname must be between 2 and 10 characters",
    });
  }

  const isAvailable = !isNicknameInUse(trimmed);

  if (!isAvailable) {
    return res.json({
      available: false,
      error: "This nickname is already in use",
    });
  }

  const tempUserId = `${trimmed}-${Date.now()}`;
  const color = getUserColor(tempUserId);

  return res.json({
    available: true,
    color,
  });
});

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initSoket(server);
