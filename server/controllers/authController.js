import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customErrors.js";
import User from "../models/UserModel.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
	const isFirstAccount = (await User.countDocuments()) === 0;
	req.body.role = isFirstAccount ? "admin" : "user";

	const hashedPassword = await hashPassword(req.body.password);
	req.body.password = hashedPassword;

	const user = await User.create(req.body);

	return res.status(StatusCodes.CREATED).json({ msg: "User created !" });
};

export const login = async (req, res) => {
	// check if user exists
	// check if password is correct

	const user = await User.findOne({ email: req.body.email });

	const isValid =
		user && (await comparePassword(req.body.password, user.password));

	if (!isValid) throw new UnauthenticatedError("User not found");

	const token = createJWT({
		userId: user._id,
		role: user.role,
	});

	const oneDay = 1000 * 60 * 60 * 24;

	res.cookie("token", token, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === "production",
		sameSite: "none",
	});

	res.status(StatusCodes.OK).json({ msg: "User logged in successfully!" });
};

export const logout = async (req, res) => {
	res.cookie("token", "logout", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});

	res.status(StatusCodes.OK).json({ msg: "user logged out" });
};
