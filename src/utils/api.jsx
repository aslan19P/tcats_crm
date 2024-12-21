import axios from "axios";
import { useGlobal } from "./global";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const useApi = () => {
    const { user, auth, logout } = useGlobal();
    const BASE_URL = 'https://api.tcats.uz';

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: {
            ...(user.accessToken && { Authorization: `Bearer ${user.accessToken}` }),
        },
    });


    axiosInstance.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && error.response.data.code === "token_not_valid") {
                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const refreshToken = user.refreshToken;
                        const response = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
                            refresh_token: refreshToken,
                        });

                        auth({
                            accessToken: response.data.access_token,
                            refreshToken: response.data.refresh_token,
                        });

                        processQueue(null, response.data.access_token);
                        isRefreshing = false;

                        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                        return axios(originalRequest);
                    } catch (e) {
                        processQueue(e, null);
                        isRefreshing = false;
                        logout();
                        return Promise.reject(e);
                    }
                }

                // Добавляем запрос в очередь до завершения обновления токена
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            if (error.response && error.response.status === 401 && error.response.data.code === "user_not_found") {
                logout();
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useApi;
