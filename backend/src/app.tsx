import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/db.js";
import redis from "./config/redis.js"; // This imports your ioredis instance
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Required so your Next.js frontend can interact with this backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Crucial for passing cookies/sessions back and forth
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("API is Running");
});
app.use("/api/auth", authRoutes);
app.get("/redis-test", async (req, res) => {
  try {
    // ioredis uses standard async/await commands
    await redis.set("message", "Hello Redis");
    const value = await redis.get("message");
    res.json({ value });
  } catch (err: any) {
    console.error("Redis operational test error:", err.message);
    res.status(500).json({ error: "Redis failed to respond" });
  }
});

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDb();
    console.log("MongoDB Handshake Complete");

    // Note: With ioredis, you DO NOT need to call redis.connect().
    // It connects automatically as soon as it's imported above!

    const PORT = process.env.PORT || 1570;

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
