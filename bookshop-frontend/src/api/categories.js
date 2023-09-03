export const getBooksByCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/v1/books?category=${categoryId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        
    });

    const data = await response.json();
    console.log("API по категории:", data);
    return data;
    
};

export const getAllCategories = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/v1/books/categories`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
};
