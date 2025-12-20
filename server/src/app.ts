import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? process.env.CLIENT_DEV_URL
        : process.env.CLIENT_URL,
  })
);
app.use(helmet());
app.use(morgan("tiny"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
