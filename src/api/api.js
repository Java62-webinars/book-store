const BOOKS_URL = 'http://localhost:8000/book-shop/books'

export const fetchBooks = async () => {
    const responce = await fetch(BOOKS_URL);
    if (!responce.ok) {
        throw new Error(`Failed to load books: ${responce.status}`);
    }
    return responce.json();
};