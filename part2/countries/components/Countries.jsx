
const Country = ({ countryName, flagUrl, languages, capital, filterCountries}) => {
  
    return (
      <div>
      <h3>{countryName}</h3>
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
      </div>
      </div>
    )
  }
    
    export default Country