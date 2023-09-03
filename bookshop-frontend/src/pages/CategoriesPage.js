import React, { useState, useEffect } from 'react';
import { getBooksByCategory, getAllCategories } from '../api/categories';
import styles from '../styles/BookCard.module.css';

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const allCategories = await getAllCategories();
            console.log("All categories:", allCategories);
            setCategories(allCategories);
            setSelectedCategory(allCategories[0]?.name);
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            console.log("Selected category name:", selectedCategory);
            async function fetchBooks() {
                const booksFromCategory = await getBooksByCategory(selectedCategory);
                console.log("Books from selected category:", booksFromCategory);
                setBooks(booksFromCategory);
            }
            fetchBooks();
        }
    }, [selectedCategory]);

    return (
        <div>
            <h1>Выберите категорию</h1>
            <select
                value={selectedCategory}
                onChange={(e) => {
                    setSelectedCategory(e.target.value);
                }}
            >
                {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>

            <div>
                {loading ? <div>Загрузка...</div> :
                    books.map(book => (
                        <div key={book.id} className={styles.card}>
                            <h2>{book.title}</h2>
                            <img src={book.coverUrl} alt={`Обложка книги "${book.title}"`} style={{width: '200px', height: '200px'}} />
                            <p>Категория: {book.categoryname}</p>
                            <p>Автор: {book.authorname}</p>
                            <p>Стоимость: {book.price} RUB</p>
                            <div>{book.description}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default CategoriesPage;
