// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/users.routes.js";

const app = express();

// Middleware for CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',  
    credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Define routes
app.use("/api/v1/users", router);

// Error handling middleware should be last
app.use(errorHandler);

export default app;
