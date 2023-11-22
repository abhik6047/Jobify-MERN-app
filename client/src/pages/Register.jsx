import { Form, redirect, Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import Logo from "../components/Logo";
import { FormRow, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	try {
		await customFetch.post("/auth/register", data);
		toast.success("Registration successful");
		return redirect("/login");
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return error;
	}
};

const Register = () => {
	return (
		<Wrapper>
			<Form method="post" className="form">
				<Logo />
				<h4>Register</h4>
				<FormRow type="text" name="name" labelText="First Name" />
				<FormRow type="text" name="lastName" labelText="Last Name" />
				<FormRow type="text" name="location" labelText="Location" />
				<FormRow type="email" name="email" />
				<FormRow type="password" name="password" />
				<SubmitBtn />
				<p>
					Already a member?
					<Link to="/login" className="member-btn">
						Login
					</Link>
				</p>
			</Form>
		</Wrapper>
	);
};
export default Register;
