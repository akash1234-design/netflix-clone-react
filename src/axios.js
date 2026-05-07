import axios from "axios";

console.log("API Key:", process.env.REACT_APP_TMDB_API_KEY); // Ye line add kar

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
    language: "en-US"
  }
});

export default instance;