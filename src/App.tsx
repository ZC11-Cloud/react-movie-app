import Search from "./components/Search.tsx";
import { useState } from "react";
const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
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
            </div>
        </main>
    );
};

export default App;
