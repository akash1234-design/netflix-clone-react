import React, { useState, useEffect } from "react";
import axios from './axios';
import requests from './requests'; 
import "./Banner.css";

function Banner() {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const handlePlay = async () => {
    const movieName = movie?.title || movie?.name || movie?.original_name;
    const YOUTUBE_API_KEY = "AIzaSyAsOGVHMF6zAYFsnvlMtkrsAKDW5Ah9iH4"; // <-- Copy wali key
    
    if (!movieName) {
      alert("Movie not loaded yet");
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            q: `${movieName} official trailer`,
            key: YOUTUBE_API_KEY,
            maxResults: 1,
            type: 'video'
          }
        }
      );
      
      const videoId = response.data.items[0]?.id?.videoId;
      
      if (videoId) {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      } else {
        alert("Trailer not found on YouTube");
      }
    } catch (error) {
      console.log(error);
      alert("YouTube API error. Check console.");
    }
  };

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(
        "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
        )`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className="banner__buttons">
          <button className="banner__button" onClick={handlePlay}>Play</button>
          <button className="banner__button">My List</button>
        </div>

        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>

      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;