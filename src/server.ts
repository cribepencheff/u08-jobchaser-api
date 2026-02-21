import express, { Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import savedJobsRoutes from "./routes/savedJobsRoutes";

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV;
const app = express();
const corsOptions = {
  // 3000 for NextJS since our backend uses 4000
  origin:
    NODE_ENV === "production"
      ? "https://u07-jobchaser-cribepencheff.vercel.app"
      : "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "Backend is running!" });
});

// API-routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/saved-jobs", savedJobsRoutes);

// Global Error Handling
app.use(
  (
    err: any,
    _req: express.Request,
    res: Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong." });
  },
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`ENV: ${NODE_ENV}`);
});
