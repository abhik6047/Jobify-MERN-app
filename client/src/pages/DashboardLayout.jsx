/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/Dashboard";
import BigSidebar from "../components/BigSidebar";
import Navbar from "../components/Navbar";
import SmallSidebar from "../components/SmallSidebar";
import customFetch from "../utils/customFetch";

export const loader = async () => {
	try {
		const { data } = await customFetch.get("/users/current-user");
		return data;
	} catch (error) {
		console.log(error);
		return redirect("/");
	}
};

const DashboardContext = createContext();

const DashboardLayout = ({ isDarkThemeEnabled }) => {
	const user = useLoaderData();
	const navigate = useNavigate();

	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);

	const toggleDarkTheme = () => {
		const newDarkTheme = !isDarkTheme;
		setIsDarkTheme(newDarkTheme);
		document.body.classList.toggle("dark-theme", newDarkTheme);
		localStorage.setItem("darkTheme", newDarkTheme);
	};

	const toggleSidebar = () => {
		setShowSidebar(!showSidebar);
	};

	const logoutUser = async () => {
		navigate("/");
		await customFetch.get("/auth/logout");
		toast.success("Logging out...");
	};

	return (
		<DashboardContext.Provider
			value={{
				user,
				showSidebar,
				isDarkTheme,
				toggleDarkTheme,
				toggleSidebar,
				logoutUser,
			}}
		>
			<Wrapper>
				<main className="dashboard">
					<SmallSidebar />
					<BigSidebar />
					<div>
						<Navbar />
						<div>
							<div className="dashboard-page">
								<Outlet context={{ user }} />
							</div>
						</div>
					</div>
				</main>
			</Wrapper>
		</DashboardContext.Provider>
	);
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
