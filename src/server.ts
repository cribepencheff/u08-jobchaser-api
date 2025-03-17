import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
import userRoutes from "./routes/userRoutes"

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
