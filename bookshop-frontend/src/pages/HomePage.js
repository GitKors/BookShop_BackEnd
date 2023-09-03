import React, { useState, useEffect } from 'react';
import { getBooks } from '../api/books';  
import styles from '../styles/BookCard.module.css';  

function HomePage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getBooks();
                setBooks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка получения книг:', error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    function truncateText(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length) + "...";
    }

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h1>Домашняя страница</h1>
            <div>
                {books.map(book => (
                    <div key={book.id} className={styles.card}>
                        <h2>{book.title}</h2>
                        <img src={book.coverUrl} alt={`Обложка книги "${book.title}"`} style={{width: '200px', height: '200px'}} />
                        <p>Категории: {book.categoryname || 'Категории не указаны'}</p>
                        <p>Автор: {book.authorname}</p>
                        <p>Стоимость: {book.price} {book.currency}RUB</p>
                        <p>Рейтинг: {Number(book.averagerating).toFixed(2)}</p>
                        <div className={styles.cardContent}>
                            <p className={styles.cutOff}>
                                {truncateText(book.description)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;

