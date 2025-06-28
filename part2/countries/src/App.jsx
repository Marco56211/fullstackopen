
import { useState , useEffect } from 'react'
import countriesService from '/services/countries.js'
import Country from '/components/Countries.jsx'


function App() {
  const [count, setCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState([])



  const filteredCountries = countries.filter((country) => country.name.common.toLowerCase().includes(searchTerm))

  
  function generateUniqueId() {
    return crypto.randomUUID();
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  

  useEffect(() => { 
    countriesService
    .getAll()
    .then(initialCountries => {
      console.log(initialCountries)
      setCountries(initialCountries)
    })
  }, [])


 

  return (
    <>
 
      <h1>Countries</h1>
      <div className="card">
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
     
        <ul>
        
        {filteredCountries.length === 1 ? (
          filteredCountries.map((country, index) => {
            const uniqueKey = generateUniqueId();
            return (
              <Country
                key={uniqueKey}
                country={country.name.common}
                flagUrl={country.flags.png}
                capital={country.capital ? country.capital[0] : 'N/A'}
                languages={country.languages}
              />
            );
          })
        ) : filteredCountries.length === 1 ? (
  filteredCountries.map((country, index) => {
    const uniqueKey = generateUniqueId();
    return (
      <Country
        key={uniqueKey}
        country={country.name.common}
      />
    );
  })
) : filteredCountries.length < 10 ? (
  filteredCountries.map((country, index) => {
    const uniqueKey = generateUniqueId();
    return (
      <Country
        key={uniqueKey}
        countryName={country.name.common}

        
        flagUrl={country.flags.png}
        capital={country.capital[0]}
        languages={country.languages}
        latlng={country.latlng}

      />
    );
  })

) : (
  <p>Please refine the curated list of countries using the filter.</p>
)}



      </ul>
       
      </div>
   
    </>
  )
}


const Filter = ({ searchTerm, handleSearchChange }) => {

  return (
    <div>
      filter: <input type="text" value={searchTerm} onChange={handleSearchChange} />
    </div>
  )
}





export default App
