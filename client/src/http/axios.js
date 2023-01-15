import axios from "axios";

const options = {
	baseURL: "http://localhost:3001",
	withCredentials: true,
};

const $axios = axios.create(options);

$axios.interceptors.request.use((config) => {
	const userToken = localStorage.getItem("token");

	config.headers.authorization = `Barear ${userToken}`;

	return config;
});

$axios.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const requestConfig = error.config;

		try {
			if (error.response.status != 401 || !requestConfig || requestConfig._isRetry) {
				throw error;
			}
			requestConfig._isRetry = true;

			const refresh = await $axios.indGet("auth/refresh");
			localStorage.setItem("token", refresh.data.accessToken);

			return $axios.request(requestConfig);
		} catch (e) {
			return Promise.reject(error);
		}
	}
);

$axios.indGet = function (url) {
	return axios.get(url, options);
};

export { $axios as default, options };
