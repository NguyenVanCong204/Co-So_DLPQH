import axios from 'axios';
import { toast } from 'react-toastify';
const apiAdmin = axios.create({
    baseURL: `http://localhost:3001/api/admin`,
});

apiAdmin.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiAdmin.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenRefresh');
            toast.error('Bạn chưa đăng nhập');
            window.location.href = '/admin/login';
        }

        return Promise.reject(err);
    },
);
export default apiAdmin;
