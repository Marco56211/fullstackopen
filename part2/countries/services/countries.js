import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY


const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather"

const getWeather = (lat, long) => {
  const request = axios.get(`${weatherBaseUrl}?lat=${lat}&lon=${long}&appid=${api_key}&units=metric`);
  return request.then(response => response.data);
};

const getAll = () => {
  const request = axios.get(`${baseUrl}/api/all`)
  return request.then(response => response.data)
}






export default { 
  getAll: getAll, 
  getWeather : getWeather

}