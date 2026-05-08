import React, { useState, useEffect } from 'react'
import axios from './axios'
import requests from './requests'
import './Banner.css'
import YouTube from 'react-youtube'

function Banner() {
    const [movie, setMovie] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("")

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(requests.fetchNetflixOriginals)
            setMovie(
                request.data.results[
                    Math.floor(Math.random() * request.data.results.length - 1)
                ]
            )
            return request
        }
        fetchData()
    }, [])

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    }

    const handleClick = async (movie) => {
        if (!movie?.id) return // Movie load nahi hui to crash mat karo
        
        if (trailerUrl) {
            setTrailerUrl('') // Video band kar do
        } else {
            // TMDB API se direct trailer nikalo - 100% accurate
            let fetchUrl = `/movie/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
            if (movie?.media_type === 'tv' || movie?.name) {
                fetchUrl = `/tv/${movie.id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
            }
            
            try {
                const request = await axios.get(fetchUrl)
                const trailer = request.data.results.find(
                    vid => vid.type === "Trailer" && vid.site === "YouTube"
                )
                
                if (trailer) {
                    setTrailerUrl(trailer.key)
                } else {
                    alert("Sorry, trailer available nahi hai is movie ka 😅")
                }
            } catch (error) {
                console.log(error)
                alert("Trailer load nahi ho paya. Try again.")
            }
        }
    }

    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str
    }

    return (
        <header className="banner">
            <div 
                className="banner__background"
                style={{
                    backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
                }}
            >
                <div className="banner__contents">
                    <h1 className="banner__title">
                        {movie?.title || movie?.name || movie?.original_name}
                    </h1>

                    <div className="banner__buttons">
                        <button className="banner__button" onClick={() => handleClick(movie)}>
                            {trailerUrl ? "Close" : "Play"}
                        </button>
                        <button className="banner__button">My List</button>
                    </div>

                    <h1 className="banner__description">
                        {truncate(movie?.overview, 150)}
                    </h1>
                </div>
                <div className="banner--fadeBottom" />
            </div>
            
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </header>
    )
}

export default Banner