import React, { useState, useEffect } from 'react';
import { getBooks, deleteBook, addBook } from '../api/books';
import '../styles/BookListPage.css';
import styles from '../styles/BookCard.module.css';

function BookListPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [categoryId, setCategoryId] = useState('1');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [authorName, setAuthorName] = useState('');

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

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleDelete = async (bookId) => {
        try {
            await deleteBook(bookId); 
            setBooks(books.filter(book => book.id !== bookId));
        } catch (error) {
            console.error('Ошибка удаления книги:', error);
        }
    };

    const isFormComplete = title && authorName && categoryId && description && price && coverUrl;

    const handleAddBook = async (event) => {
        event.preventDefault();
    
        const bookData = {
            title: title,
            authorId: authorId,
            categoryId: categoryId,
            description: description,
            price: price,
            coverUrl: coverUrl,
            authorName: authorName
        };
    
        try {
            const newBook = await addBook(bookData);
            setBooks(prevBooks => [newBook, ...prevBooks]);
            alert("Книга успешно добавлена!");
        } catch (error) {
            console.error("Ошибка добавления книги:", error);
        }
    };

    function truncateText(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length) + "...";
    }

    return (
        <>
 
            <button onClick={handleOpenModal}>Добавить книгу</button>
            
            {isModalOpen && (
                <div>
                    <h2>Добавить книгу</h2>
                    <form onSubmit={handleAddBook}>
                        <p>Название</p>
                        <input type="text" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} />
            
                        <p>Имя Автора</p>
                        <input type="text" placeholder="Имя Автора" value={authorName} onChange={e => setAuthorName(e.target.value)} />

                        <p>ID Категории (1-Роман; 2-Детектив; 3-Повесть)</p>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                            <option value="1">1 - Роман</option>
                            <option value="2">2 - Детектив</option>
                            <option value="3">3 - Повесть</option>
                        </select>
                        
                        <p>Описание</p>
                        <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} />
            
                        <p>Цена(RUB)</p>
                        <input type="number" placeholder="Цена" value={price} onChange={e => setPrice(Number(e.target.value))} />
            
                        <p>URL Обложки</p>
                        <input type="text" placeholder="URL Обложки" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
            
                        <button type="submit" disabled={!isFormComplete}>Добавить</button>
                    </form>
                    <button onClick={handleCloseModal}>Закрыть</button>
                </div>
            )}

            <div>
                {books.map(book => (
                    <div key={book.id} className={styles.card}>
                        <h2>{book.title}</h2>
                        <img src={book.coverUrl} alt={`Обложка книги "${book.title}"`} style={{width: '200px', height: '200px'}} />
                        <p>Категории: {book.categoryname || 'Категории не указаны'}</p>
                        <p>Автор: {book.authorname}</p>
                        <p>Стоимость: {book.price} {book.currency}RUB</p>
                        <p>Рейтинг: {book.averagerating ? Number(book.averagerating).toFixed(2) : 'N/A'}</p>
                        <div className={styles.cardContent}>
                            <p className={styles.cutOff}>
                                {truncateText(book.description)}
                            </p>
                        </div>
                        <button className="deleteButton" onClick={() => handleDelete(book.id)}>Удалить</button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default BookListPage;
