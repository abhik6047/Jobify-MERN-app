import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

// Custom imports
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

// public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// Middleware imports
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5100;

// Middlewares
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use("*", (req, res) => {
	res.status(404).json({ msg: "No found !" });
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
