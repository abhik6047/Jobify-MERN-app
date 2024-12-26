import axios from "axios";

const customFetch = axios.create({
	// baseURL: `${import.meta.env.BASE_URL}/api/v1`,
	baseURL: `/api/v1`,
});

export default customFetch;
