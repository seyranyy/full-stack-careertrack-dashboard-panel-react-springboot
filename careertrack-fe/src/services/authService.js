import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth'; // Backend adresin

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            // Backend'den gelen sihirli anahtarı (JWT) tarayıcı hafızasına alıyoruz
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userEmail', email);
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : "Bağlantı hatası!";
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
};