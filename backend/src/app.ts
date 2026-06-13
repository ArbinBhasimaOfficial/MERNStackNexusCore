import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import redis from "./config/redis.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("API is Running");
});

app.get("/redis-test", async (req, res) => {
  await redis.set("message", "Hello Redis");
  const value = await redis.get("message");
  res.json({
    value,
  });
});

const startServer = async () => {
  try {
    await connectDb();

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
