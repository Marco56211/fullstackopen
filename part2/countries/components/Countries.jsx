
const Country = ({ countryName, flagUrl, languages, capital, filterCountries}) => {
  
    return (
      <li>
      <h3>{countryName}</h3>
      <img src={flagUrl} alt={`Flag of ${countryName}`} width="50" />
      <p>Capital: {capital}</p>
      <p>Languages: {languages}</p>
      </li>
    )
  }
    
    export default Country