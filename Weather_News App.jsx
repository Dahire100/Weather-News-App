import { useState } from "react";

export default function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [clothing, setClothing] = useState("");

  const weatherApiKey = "cb6538f8a8fc4df1be492634250201";
  const newsApiKey = "pub_738530ff71d970dd17a9883859d0314d340a3";

  const getInformation = async () => {
    if (!location) {
      alert("⚠️ Please enter a city name!");
      return;
    }

    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}&days=3&aqi=yes`;
    const newsUrl = `https://newsdata.io/api/1/news?apikey=${newsApiKey}&country=in&language=en`;

    try {
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();
      if (weatherData.error) throw new Error(weatherData.error.message);
      setWeather(weatherData);
      recommendClothing(weatherData.current.temp_c);
    } catch (error) {
      setWeather(null);
      alert("⚠️ Error fetching weather data.");
    }

    try {
      const newsResponse = await fetch(newsUrl);
      const newsData = await newsResponse.json();
      if (!newsData.results || newsData.results.length === 0) throw new Error("No news found.");
      setNews(newsData.results.slice(0, 5));
    } catch (error) {
      setNews([]);
    }
  };

  const recommendClothing = (temp) => {
    if (temp < 10) setClothing("🧥 It's cold! Wear a heavy coat, gloves, and a hat.");
    else if (temp < 20) setClothing("🧣 A light jacket or sweater would be perfect.");
    else if (temp < 30) setClothing("👕 A t-shirt and jeans should be fine.");
    else setClothing("🩳 It's hot! Wear light and breathable clothing.");
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-2xl text-black border border-gray-300">
        <h2 className="text-3xl font-extrabold text-gray-800">🌤️ Weather & 📰 News App</h2>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city name"
          className="w-full p-3 border rounded mt-4 text-lg"
        />
        <button
          onClick={getInformation}
          className="w-full bg-pink-500 text-white font-bold p-3 rounded mt-4 hover:bg-pink-600 transition duration-300"
        >
          Get Info
        </button>
        
        {weather && (
          <div className="bg-blue-200 p-5 rounded-xl mt-6 shadow-md border border-blue-300">
            <h3 className="text-xl font-bold">🌎 {weather.location.name}, {weather.location.country}</h3>
            <p className="text-lg">🌡️ Temperature: {weather.current.temp_c}°C</p>
            <p className="text-lg">🌥️ Condition: {weather.current.condition.text}</p>
            <img src={weather.current.condition.icon} alt="weather icon" className="mx-auto mt-2" />
            <h4 className="font-bold mt-4">📅 3-Day Forecast</h4>
            {weather.forecast.forecastday.map(day => (
              <p key={day.date} className="text-lg">📌 {day.date}: {day.day.avgtemp_c}°C, {day.day.condition.text}</p>
            ))}
          </div>
        )}

        {news.length > 0 && (
          <div className="bg-yellow-200 p-5 rounded-xl mt-6 shadow-md border border-yellow-300">
            <h3 className="text-xl font-bold">📰 Latest News</h3>
            {news.map((article, index) => (
              <div key={index} className="mt-4">
                <p className="font-bold text-lg">🗞️ {article.title}</p>
                <p>{article.description || "No description available."}</p>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">🔗 Read more</a>
                <hr className="my-3 border-gray-400" />
              </div>
            ))}
          </div>
        )}

        {clothing && (
          <div className="bg-purple-400 text-white p-5 rounded-xl mt-6 shadow-md border border-purple-300">
            <h3 className="text-xl font-bold">👕 Clothing Recommendation</h3>
            <p className="text-lg">{clothing}</p>
          </div>
        )}
      </div>
    </div>
  );
}
