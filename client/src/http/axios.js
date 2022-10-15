import axios from "axios";

const axiosOptions = {
	baseURL: "http://localhost:3001",
	withCredentials: true,
};

const api = axios.create(axiosOptions);

api.interceptors.request.use((config) => {
	config.headers.Authorization = `Barear ${localStorage.getItem("token")}`;

	return config;
});

api.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const requestConfig = error.config;

		try {
			if (error.response.status !== 401 || !requestConfig || requestConfig._isRetry) {
				throw error;
			}
			requestConfig._isRetry = true;

			const response = await axios.get("auth/refresh", axiosOptions);
			localStorage.setItem("token", response.data.accessToken);

			return api.request(requestConfig);
		} catch (e) {
			return Promise.reject(error);
		}
	}
);

export { api as default };
