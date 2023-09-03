import React, { useState } from 'react';

function RegisterPage() {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        const userData = {
            username, 
            password,
        };

        try {
            const response = await fetch('http://localhost:3000/api/v1/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('token', data.token);
                
            } else {
                alert(data.message || "Ошибка регистрации");
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
        }
    };

    return (
        <div>
            <h1>Регистрация</h1>
            <form onSubmit={handleRegister}>
                <label>
                    Имя пользователя: 
                    <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Пароль:
                    <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <br />
                <label>
                    Подтверждение пароля:
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
}

export default RegisterPage;
