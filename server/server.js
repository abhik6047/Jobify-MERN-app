import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import morgan from "morgan";
dotenv.config();

// Custom imports
import authRouter from "./routes/authRouter.js";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";

// Middleware imports
import { authenticateUser } from "./middleware/authMiddleware.js";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5100;

// Middlewares
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);

app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
	res.send("API working");
});

app.use(errorHandlerMiddleware);

try {
	await mongoose.connect(process.env.MONGO_URL);
	app.listen(PORT, () => {
		console.log(`Server is listening on ${PORT}`);
	});
} catch (error) {
	console.log(error);
	process.exit(1);
}
