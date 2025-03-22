import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import savedJobsRoutes from "./routes/savedJobsRoutes";

const PORT = process.env.PORT || 3000;
const app = express();
const corsOptions = {
  origin: 'http://localhost:3001', // 3001 for NextJS since our backend uses 3000
  // TODO: Add function for production URL (https://my-production-url.com)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/saved-jobs", savedJobsRoutes);

app.use((err: any, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
