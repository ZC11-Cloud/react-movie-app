import Search from "./components/Search.tsx";
import Spinner from "./components/Spinner.tsx";
import { useEffect, useState } from "react";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};
interface Movies {
    id: number;
    title: string;
}
const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [movieList, setMovieList] = useState<Movies[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/discover/movie?&language=zh-CN&sort_by=popularity.desc`,
                API_OPTIONS
            );
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
        fetchMovies();
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
                <section className="all-movies">
                    <h2 className="mt-[20px]">All Movies</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-50">{errorMessage}</p>
                    ) : (
                        <ul className="text-white">
                            {movieList.map((movie) => (
                                <li key={movie.id}>{movie.title}</li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;
