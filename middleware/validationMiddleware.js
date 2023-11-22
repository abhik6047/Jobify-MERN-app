import {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} from "../errors/customErrors.js";
import { body, param, validationResult } from "express-validator";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import { mongoose } from "mongoose";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

const withValidationError = (validateValues) => {
	return [
		validateValues,
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const errorMessages = errors.array().map((error) => error.msg);

				if (errorMessages[0].startsWith("No job")) {
					throw new NotFoundError(errorMessages);
				}

				if (errorMessages[0].startsWith("Not authorized")) {
					throw new UnauthorizedError("Not authorized to access this route.");
				}

				throw new BadRequestError(errorMessages);
			}
			next();
		},
	];
};

export const validateJobInput = withValidationError([
	body("company").notEmpty().withMessage("company is required"),
	body("position").notEmpty().withMessage("position is required"),
	body("jobLocation").notEmpty().withMessage("job location is required"),
	body("jobStatus")
		.isIn(Object.values(JOB_STATUS))
		.withMessage("invalid status value"),
	body("jobType")
		.isIn(Object.values(JOB_TYPE))
		.withMessage("invalid type value"),
]);

export const validateIdParam = withValidationError([
	param("id").custom(async (value, { req }) => {
		const isValidId = mongoose.Types.ObjectId.isValid(value);
		if (!isValidId) throw new BadRequestError("Invalid MongoDB Id");

		const job = await Job.findById(value);

		if (!job) {
			throw new NotFoundError(`No job with id ${value} found`);
		}

		const isAdmin = req.user.role === "admin";
		const isOwner = req.user.userId === job.createdBy.toString();

		if (!isAdmin && !isOwner) {
			throw new UnauthorizedError("Not authorized to access this route.");
		}
	}),
]);

export const validateRegisterInput = withValidationError([
	body("name").notEmpty().withMessage("Name is required"),
	body("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("invalid email format")
		.custom(async (email) => {
			const user = await User.findOne({ email });

			if (user) {
				throw new BadRequestError("email already exists");
			}
		}),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({
			min: 8,
		})
		.withMessage("password must be 8 characters long"),
	body("location").notEmpty().withMessage("Location is required"),
	body("lastName").notEmpty().withMessage("last name is required"),
]);

export const validateLoginInput = withValidationError([
	body("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("invalid email format"),
	body("password").notEmpty().withMessage("Password is required"),
]);

export const validateUpdateUserInput = withValidationError([
	body("name").notEmpty().withMessage("Name is required"),
	body("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email format")
		.custom(async (email, { req }) => {
			const user = await User.findOne({ email });

			if (user && user._id.toString() !== req.user.userId) {
				throw new BadRequestError("Email already exists");
			}
		}),
	body("location").notEmpty().withMessage("Location is required"),
	body("lastName").notEmpty().withMessage("Last name is required"),
]);
