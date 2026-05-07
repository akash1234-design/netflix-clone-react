import Row from "./Row";
import Banner from "./Banner";
import Dashboard from "./Dashboard";
import requests from "./requests";

function App() {
  return (
    <div className="bg-[#111] min-h-screen">
      <Banner />
      <Row title="NETFLIX ORIGINALS" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
      <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
      <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
      <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
      <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
      <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
      
      {/* Analytics Dashboard */}
      <Dashboard />
    </div>
  );
}

export default App;