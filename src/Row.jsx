import React, { useState, useEffect } from 'react';
import axios from './axios';
import YouTube from 'react-youtube';
import './Row.css';

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //.env file se API key nikal rahe hain
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  // Row ka data load karne ke liye
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  // YouTube player ke options
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  // Poster pe click karne par trailer chalega
  const handleClick = (movie) => {
    // Agar trailer chal raha hai to band kar do
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      // Nahi to naya trailer fetch karo
      // Movie aur TV show ke liye alag URL hota hai
      const type = movie.media_type === "tv"? "tv" : "movie";

      fetch(`https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=${API_KEY}`)
       .then((res) => res.json())
       .then((data) => {
          if (data.results && data.results.length > 0) {
            // Sirf "Trailer" type ka video nikalna, warna pehla wala le lo
            const trailer = data.results.find(
              (vid) => vid.type === "Trailer" && vid.site === "YouTube"
            ) || data.results[0];
            setTrailerUrl(trailer.key);
          } else {
            console.log("Is movie/show ka trailer nahi mila TMDB pe.");
            // Yaha kuch nahi hoga, image hi dikhti rahegi. App crash nahi hoga.
          }
        })
       .catch((error) => {
          console.log("Trailer fetch karne mein error:", error);
        });
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${
              isLargeRow? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>

      {/* Agar trailerUrl hai tabhi YouTube player dikhao */}
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;