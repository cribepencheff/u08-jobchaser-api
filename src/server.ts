import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
// import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

app.use((err: any, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
