import express from "express";
import cors from "cors";
const app = express();
import mongoose from "mongoose";
import apiRouter from "./router/Admin/api.js";
import apiRouterMember from "./router/Member/api.js";
import authRouter from "./router/Auth/auth.js";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

app.use("/public", express.static("public"));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", apiRouter);
app.use("/api/member", apiRouterMember);
app.use("/api", authRouter);

app.get("/", (req, res) => {
  res.send("Hello, Express.js!");
});

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Database is connected successfully"))
  .catch((err) => console.log("Database connection error : ", err));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
