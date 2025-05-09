import type { Movies } from "../types/movies.ts";
interface MovieCardProps {
    movie: Movies;
}
const MovieCard = ({ movie }: MovieCardProps) => {
    const {
        poster_path,
        title,
        vote_average,
        release_date,
        original_language,
    } = movie;
    return (
        <li className="movie-card">
            <img
                src={
                    poster_path
                        ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                        : "/public/no-movie.png"
                }
                alt={title}
            />
            <div className="mt-4">
                <h3>{title}</h3>
                <div className="content">
                    <div className="rating">
                        <img src="star.svg" alt="Star Icon" />
                        <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
                    </div>
                    <span>•</span>
                    <p className="lang">{original_language}</p>
                    <span>•</span>
                    <p className="year">
                        {release_date ? release_date.split("-")[0] : "N/A"}
                    </p>
                </div>
            </div>
        </li>
    );
};

export default MovieCard;
