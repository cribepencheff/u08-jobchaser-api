import express, { Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import savedJobsRoutes from "./routes/savedJobsRoutes";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const app = express();
const corsOptions = {
  // 3001 for NextJS since our backend uses 3000
  origin: NODE_ENV === 'production' ? 'https://your-production-url.com' : 'http://localhost:3001',
  // TODO: Add function for production URL (https://my-production-url.com)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/saved-jobs", savedJobsRoutes);

// Global Error Handling
app.use((err: any, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`ENV: ${NODE_ENV}`);
});
