import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ city }) => {
  const [weather, setWeather] = useState({});
  const apiKey = process.env.REACT_APP_API_KEY;
  const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

  useEffect(() => {
    axios.get(url).then((response) => {
      setWeather(response.data.current);
    });
  }, [weather]);

  if (Object.entries(weather).length === 0) {
    return <div>Fetching weather...</div>;
  } else {
    return (
      <div>
        <h2>Weather in {city}</h2>
        <p>temperature: {weather.temperature} Celcius</p>
        <img src={weather.weather_icons} alt="weather-icons" />
        <p>
          Wind: {weather.wind_speed} mph, direction {weather.wind_dir}
        </p>
      </div>
    );
  }
};

export default Weather;
