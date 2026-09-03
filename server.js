import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import { connectDB } from "./config/db.js";
import quoteRoutes from "./routes/quoteRoutes.js"; // <-- IMPORT QUOTE ROUTES HERE
import contactRoutes from './routes/contactRoutes.js';

// Force Google Public DNS to bypass local ISP SRV lookup blocks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect to DB immediately for local server instance
connectDB();

// Routes
app.use("/api/quotes", quoteRoutes); // <-- MOUNT QUOTE ROUTES HERE
app.use('/api/contact', contactRoutes);
// Root route (for testing)
app.get("/", (req, res) => res.send("Backend is running!"));

// ONLY listen locally (Vercel ignores app.listen)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;