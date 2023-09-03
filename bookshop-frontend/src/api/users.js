import axios from 'axios';

const baseUserURL = 'http://localhost:3000/api/v1/user';

export const loginUser = (data) => {
    return axios.post(`${baseUserURL}/login`, data);
};

export const registerUser = (data) => {
    return axios.post(`${baseUserURL}/register`, data);
};

export const getUserData = (userId) => {
    const token = localStorage.getItem('token');
    console.log('токен:', token);
    
    if (!token) {
        console.error('Токен не найден!');
        return Promise.reject(new Error('Токен не найден'));
    }

    return axios.get(`${baseUserURL}/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};


export const updateUserData = (userId, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${baseUserURL}/${userId}`, data, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : undefined
        }
    });
};