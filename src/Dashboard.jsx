import { useState, useEffect } from "react";
import axios from "axios";
import requests from "./requests";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [ratingData, setRatingData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // 3 pages ek saath fetch = 60 movies
      const page1 = axios.get(`https://api.themoviedb.org/3${requests.fetchTrending}&page=1`);
      const page2 = axios.get(`https://api.themoviedb.org/3${requests.fetchTrending}&page=2`);
      const page3 = axios.get(`https://api.themoviedb.org/3${requests.fetchTrending}&page=3`);

      const allData = await Promise.all([page1, page2, page3]);
      const movieResults = allData.flatMap(res => res.data.results);

      setMovies(movieResults);

      // Genre Distribution ke liye data banao
      const genreCount = {};
      movieResults.forEach(movie => {
        movie.genre_ids?.forEach(id => {
          genreCount[id] = (genreCount[id] || 0) + 1;
        });
      });

      const genreMap = {28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",18:"Drama",10751:"Family",14:"Fantasy",27:"Horror",10749:"Romance",878:"Sci-Fi",53:"Thriller"};

      const genreChartData = Object.keys(genreCount).map(id => ({
        name: genreMap[id] || "Other",
        value: genreCount[id]
      }));
      setGenreData(genreChartData);

      // Top 10 Rated Movies - ab 60 mein se top 10
      const topRated = [...movieResults]
     .sort((a, b) => b.vote_average - a.vote_average)
     .slice(0, 10)
     .map(movie => ({
          name: (movie.title || movie.name).substring(0,15), // Naam chote kar diye chart ke liye
          rating: movie.vote_average
        }));
      setRatingData(topRated);
    }
    fetchData();
  }, []);

  const COLORS = ['#E50914', '#B81D24', '#FF6B6B', '#FF8E53', '#FF6F00', '#FFD166', '#06D6A0', '#118AB2', '#073B4C', '#7209B7'];

  return (
    <div className="bg-[#111] text-white p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-[#E50914]">Netflix Analytics Pro</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Top 10 Rated */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Top 10 Trending by Rating</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={100} interval={0} />
              <YAxis stroke="#888" domain={[0, 10]} />
              <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
              <Bar dataKey="rating" fill="#E50914" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Genre Distribution */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Genre Distribution - Trending</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-[#1a1a1a] p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
          <li>Total trending movies/shows analyzed: {movies.length}</li>
          <li>Highest rated: {ratingData[0]?.name} - {ratingData[0]?.rating?.toFixed(1)}/10</li>
          <li>Most common genre in trending: {genreData.sort((a,b) => b.value - a.value)[0]?.name}</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;