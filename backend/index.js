import express from "express";
import cors from "cors";
import cookeiParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import authMiddleware from "./middlewares/authentication.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.options("file/:id", cors());
app.use(cookeiParser());
app.use("/auth", authRoutes);

// Connections
connectDB();

// app.use("/",(req,res)=>{
//   res.send("hello world")
// })

// Routes
//auth
import authRoutes from "./routes/authentication.js";
app.use("/auth", authRoutes);

//dashboard
import dashboardRoutes from "./routes/DashboardData.js";
app.use("/dashboard", authMiddleware, dashboardRoutes);

//file
import fileRoutes from "./routes/file.js";
app.use("/file", authMiddleware, fileRoutes);

//album
import albumRoutes from "./routes/album.js";
app.use("/album", authMiddleware, albumRoutes);

app.listen(PORT, () => {
  console.log("Your server is running on port " + PORT);
});
