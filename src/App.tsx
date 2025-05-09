import Search from "./components/Search.tsx";
import Spinner from "./components/Spinner.tsx";
import MovieCard from "./components/MovieCard.tsx";
import { useEffect, useState } from "react";
import type { Movies } from "./types/movies.ts";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [movieList, setMovieList] = useState<Movies[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fetchMovies = async (query = "") => {
        setIsLoading(true);
        try {
            const endPoint = query
                ? `${API_BASE_URL}/search/movie?&language=zh-CN&query=${encodeURIComponent(
                      query
                  )}`
                : `${API_BASE_URL}/discover/movie?&language=zh-CN&sort_by=popularity.desc`;
            const response = await fetch(endPoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await response.json();
            if (data.Response === "False") {
                setErrorMessage(data.Error || "Failed to fetch movies");
                setMovieList([]);
                return;
            }
            setMovieList(data.results);
        } catch (error) {
            console.error("Error fetching movies:", error);
            setErrorMessage("Error fetching movies. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchMovies(searchTerm);
    }, [searchTerm]);
    return (
        <main>
            <div className="pattern"></div>
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>
                        Find <span className="text-gradient">Movies</span>{" "}
                        You'll Enjoy Without the Hassle
                    </h1>
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    ></Search>
                </header>
                <section className="all-movies">
                    <h2 className="mt-[20px]">All Movies</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-50">{errorMessage}</p>
                    ) : (
                        <ul className="text-white">
                            {movieList.map((movie) => (
                                <MovieCard movie={movie}></MovieCard>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;
