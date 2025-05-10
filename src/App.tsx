import Search from "./components/Search.tsx";
import Spinner from "./components/Spinner.tsx";
import MovieCard from "./components/MovieCard.tsx";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import type { Movies, MovieApiResponse } from "./types/movies.ts";
import { getTrendingMovies, updateSearchCount } from "./appwrite.ts";

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
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [movieList, setMovieList] = useState<Movies[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [trendingMovies, setTrendingMovies] = useState<Movies[]>([]);
    useDebounce(
        () => {
            setDebouncedSearchTerm(searchTerm);
        },
        1000,
        [searchTerm]
    );
    const fetchMovies = async (query = ""): Promise<void> => {
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
            const data: MovieApiResponse = await response.json();
            if (!data.results || data.results.length === 0) {
                setErrorMessage("Failed to fetch movies");
                setMovieList([]);
                return;
            }
            setMovieList(data.results);

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            setErrorMessage("Error fetching movies. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const loadTrendingMovies = async () => {
        try {
            const documents = (await getTrendingMovies()) || [];
            const movies: Movies[] = documents.map((doc) => ({
                id: doc.id,
                title: doc.title,
                poster_path: doc.poster_path,
                poster_url: doc.poster_url,
                vote_average: doc.vote_average,
                release_date: doc.release_date,
                original_language: doc.original_language,
            }));
            setTrendingMovies(movies);
        } catch (error) {
            console.log("Error fetching trending movies:", error);
        }
    };
    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);
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
                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.id}>
                                    <p>{index + 1}</p>
                                    <img
                                        src={movie.poster_url}
                                        alt={movie.title}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="all-movies">
                    <h2 className="mt-[20px]">All Movies</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-50">{errorMessage}</p>
                    ) : (
                        <ul className="text-white">
                            {movieList.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                ></MovieCard>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;
