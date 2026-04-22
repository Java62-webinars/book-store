const BOOKS_URL = 'http://localhost:8000/book-shop/books';

export const fetchBooks = async () => {
    const response = await fetch(BOOKS_URL);

    if (!response.ok) {
        throw new Error(`Failed to load books: ${response.status}`);
    }

    return response.json();
};

export const createBookRequest = async (book) => {
    const response = await fetch(BOOKS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create book: ${response.status}`);
    }

    return response.json();
};

export const updateBookRequest = async (originalIsbn, book) => {
    const response = await fetch(`${BOOKS_URL}/${originalIsbn}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update book: ${response.status}`);
    }

    return response.json();
};

export const changeAvailabilityRequest = async (isbn, flagOutOfStock) => {
    const response = await fetch(`${BOOKS_URL}/${isbn}/availability`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({flagOutOfStock}),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to change availability: ${response.status}`);
    }

    return response.json();
};