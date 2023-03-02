import axios from "axios";

const options = {
	baseURL: "http://localhost:3001",
	withCredentials: true,
};

const $axios = axios.create(options);

$axios.interceptors.request.use((config) => {
	const userToken = localStorage.getItem("token");
	const object = config;

	object.headers.authorization = `Barear ${userToken}`;

	return object;
});

$axios.interceptors.response.use(
	(config) => config,
	async (error) => {
		const requestConfig = error.config;

		try {
			if (error.response.status !== 401 || !requestConfig || requestConfig.isRetry) {
				throw error;
			}
			requestConfig.isRetry = true;

			const refresh = await $axios.indGet("auth/refresh");
			localStorage.setItem("token", refresh.data.accessToken);

			return $axios.request(requestConfig);
		} catch (e) {
			return Promise.reject(error);
		}
	},
);

$axios.indGet = (url) => axios.get(url, options);

$axios.indPost = (url, value) => axios.post(url, value, options);

export { options };
export default $axios;
