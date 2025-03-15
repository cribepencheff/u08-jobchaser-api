import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
// Import routes here

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes here

app.get("/", (req, res) => {
  res.send("Node.js and Express.js with TypeScript");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
