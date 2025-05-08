interface SearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const Search = ({ searchTerm, setSearchTerm }: SearchProps) => {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search through thousands of movies"
                />
            </div>
        </div>
    );
};

export default Search;
