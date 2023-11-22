import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import { Link } from "react-router-dom";
import { Logo } from "../components";

const Landing = () => {
	return (
		<Wrapper>
			<nav>
				<Logo />
			</nav>
			<div className="container page">
				<div className="info">
					<h1>
						Job <span>Tracking</span> App
					</h1>
					<p>
						{`Jobify is your personal job tracking assistant, simplifying the job
						search process like never before. With Jobify, you can effortlessly
						monitor your job applications, including the companies you've
						applied to, application statuses, job types, and positions. It's
						your secret weapon to staying organized and proactive in your job
						hunt, putting you on the path to landing your dream job.`}
					</p>
					<Link to="/register" className="btn register-link">
						Register
					</Link>
					<Link to="/login" className="btn">
						Login / Demo user
					</Link>
				</div>
				<img src={main} alt="Job Hunt" className="img main-img" />
			</div>
		</Wrapper>
	);
};

export default Landing;
