import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

const Main = () => {
    const [search, setSearch] = useState(""); // Search query
    const [bookData, setBookData] = useState([]); // All books data
    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const BOOKS_PER_PAGE = 20; // Number of books per page

    // List of random words to use as search queries
    const randomWords = ["science", "technology", "art", "fiction", "history", "nature", "adventure", "mystery", "fantasy", "education", "fire", "maths", "science"];

    // Fetch books from Google Books API with a random query
    const fetchRandomBooks = async (retryCount = 5) => {
        try {
            // Pick a random word from the list
            const randomQuery = randomWords[Math.floor(Math.random() * randomWords.length)];
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${randomQuery}&maxResults=40&key=AIzaSyA6SaT23KNiiA6DnUfUQTvFeyAcQEkwnSU`
            );
            const items = response.data.items || [];

            if (items.length === 0 && retryCount > 0) {
                // Retry with another random word if no books are returned
                return fetchRandomBooks(retryCount - 1);
            }

            shuffleArray(items); // Shuffle the results to randomize order
            setBookData(items);
            setTotalPages(Math.ceil(items.length / BOOKS_PER_PAGE)); // Calculate total pages
        } catch (err) {
            console.error("Error fetching books:", err);
        }
    };

    // Shuffle an array in place
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // Handle search
    const searchBook = (evt) => {
        if (evt.key === "Enter") {
            setCurrentPage(0); // Reset to the first page
            if (search.trim()) {
                fetchBooks(search);
            } else {
                fetchRandomBooks(); // Fetch random books if no query is entered
            }
        }
    };

    // Fetch books based on search query
    const fetchBooks = async (query) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&key=AIzaSyA6SaT23KNiiA6DnUfUQTvFeyAcQEkwnSU`
            );
            const items = response.data.items || [];
            setBookData(items);
            setTotalPages(Math.ceil(items.length / BOOKS_PER_PAGE)); // Calculate total pages
        } catch (err) {
            console.error("Error fetching books:", err);
        }
    };

    // Fetch random books on initial load
    useEffect(() => {
        fetchRandomBooks(); // Fetch random books by default
    }, []);

    // Get books for the current page
    const getCurrentPageBooks = () => {
        const startIndex = currentPage * BOOKS_PER_PAGE;
        return bookData.slice(startIndex, startIndex + BOOKS_PER_PAGE);
    };

    return (
        <>
            <div className="header">
                <div className="row1">
                    <h1>
                        A room without books is like
                        <br /> a body without a soul.
                    </h1>
                </div>
                <div className="row2">
                    <h2>Find Your Book</h2>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="Enter Your Book Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={searchBook}
                        />
                        <button onClick={fetchRandomBooks}>
                            <i className="fas fa-random"></i>
                        </button>
                    </div>
                    <img src="./images/bg2.png" alt="" />
                </div>
            </div>

            <div className="container">
                {bookData.length > 0 ? (
                    <Card book={getCurrentPageBooks()} />
                ) : (
                    <p>No books available. Try searching for something else!</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={index === currentPage ? "active" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default Main;
