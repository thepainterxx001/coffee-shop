import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5001 || process.env.PORT;

// middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// routes


// connect to DB then start server
(async () => {
  try {
    app.listen(PORT, () => console.log("Server started on PORT:", PORT));
  } catch (err) {
    console.log("Server failed to start", err);
    process.exit(0);
  }
})();