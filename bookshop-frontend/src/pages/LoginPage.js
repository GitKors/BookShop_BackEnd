import React, { useState } from 'react';
import { loginUser } from '../api/users'; 

function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        const userData = {
            login,
            password,
        };

        try {
            const response = await loginUser(userData);
            const data = response.data;
            console.log("Server response:", response.data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Токен сохранен:', data.token);
                // 
                // 
                alert("Пользователь успешно вошел в систему!");
            } else {
                alert(data.message || "Ошибка входа");
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    };

    return (
        <div>
            <h1>Вход</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Логин:
                    <input type="text" name="login" value={login} onChange={e => setLogin(e.target.value)} />
                </label>
                <br />
                <label>
                    Пароль:
                    <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

export default LoginPage;
