
import React, { useState , useEffect} from 'react';


import countriesService from '/services/countries.js'



const Country = ({ countryName, flagUrl, languages, capital, latlng }) => {

  const [weather, setWeather] = useState(null); // Initialize as null or an empty object

  useEffect(() => {
    if (latlng && latlng.length === 2) {
      countriesService
      .getWeather(latlng[0], latlng[1])
        .then(weatherData => {
          setWeather(weatherData);
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
          setWeather(null); // Reset or handle error state
        });
    }
  }, [latlng]); 



  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div>
      <h3>{countryName}</h3>
      <button onClick={toggleInfo}>
        {showInfo ? 'Hide Info' : 'Show Info'}
      </button>
  
      {showInfo && (
        <div>
          <img src={flagUrl} alt={`Flag of ${countryName}`} width="50" />
          <p>Capital: {capital}</p>
          <div>
            <h3>Languages:</h3>
            {languages && Object.keys(languages).length > 0 ? (
              <ul>
                {Object.entries(languages).map(([code, name]) => (
                  <li key={code}>
                    {name} ({code})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No languages listed.</p>
            )}
            {weather && (
        <div>
          <h3>Weather in {capital}:</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Conditions: {weather.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
      {!weather && <p>Loading weather...</p>}
          </div>
        </div>
      )}
    </div>
  );
            }
    export default Country