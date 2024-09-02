import axios from "axios";

const axiosClient = axios.create({

  //baseURL: 'http://localhost:8000/api'
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('TOKEN');
      window.location.reload(); // Or use navigate to login route
    }
    throw error;
  }
);

export default axiosClient;