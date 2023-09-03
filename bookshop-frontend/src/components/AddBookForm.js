//Нет,не так!!!!!!

import React, { useState } from 'react';
import { addBook } from '../api/books';

function AddBookForm() {
    const [formData, setFormData] = useState({
        title: '',
        releaseYear: '',
        categories: '',
        author: '',
        price: '',
        currency: 'USD',
        rating: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addBook(formData);
            console.log('Книга добавлена:', response.data);
        } catch (error) {
            console.error('Ошибка добавления книги:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Название:
                <input name="title" value={formData.title} onChange={handleChange} />
            </label>
            <label>
                Год выпуска:
                <input type="number" name="releaseYear" value={formData.releaseYear} onChange={handleChange} />
            </label>
            <label>
                Категории (через запятую):
                <input name="categories" value={formData.categories} onChange={handleChange} />
            </label>
            <label>
                Автор:
                <input name="author" value={formData.author} onChange={handleChange} />
            </label>
            <label>
                Стоимость:
                <input type="number" name="price" value={formData.price} onChange={handleChange} />
            </label>
            <label>
                Валюта:
                <select name="currency" value={formData.currency} onChange={handleChange}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                    // Добавьте другие валюты при необходимости
                </select>
            </label>
            <label>
                Рейтинг:
                <input type="number" name="rating" value={formData.rating} onChange={handleChange} />
            </label>
            <button type="submit">Добавить книгу</button>
        </form>
    );
}

export default AddBookForm;
