import axios from 'axios'

function getENV(key) {
  return import.meta.env[key]
}

const $api = axios.create({
  baseURL: getENV('VITE_API_BASE_URL'),
  timeout: '1000'
})

const weatherData = {
  lat: 0,
  lon: 0,
  icon: '',
  desc: '',
  current_temp: 0,
  max_temp: 0,
  min_temp: 0,
  wind_speed: 0,
  gust: 0,
  name: '',
  id: 0
}

export async function getLocalGEO(lat, lon) {
  let LocalCityName
  await $api
    .get(`data/2.5/weather?lat=${lat}&lon=${lon}&appid=${getENV('VITE_API_KEY')}`)
    .then((response) => {
      LocalCityName = response.data.name
    })
  return LocalCityName
}

async function getGEO(city) {
  await $api
    .get(`geo/1.0/direct?q=${city}&limit=1&appid=${getENV('VITE_API_KEY')}`)
    .then((response) => {
      weatherData.lat = response.data[0].lat
      weatherData.lon = response.data[0].lon
    })
}
export async function getWeather(city) {
  await getGEO(city)

  await $api
    .get(
      `data/2.5/weather?lat=${weatherData.lat}&lon=${weatherData.lon}&units=metric&appid=${getENV('VITE_API_KEY')}`
    )
    .then((response) => {
      weatherData.icon = response.data.weather[0].icon
      weatherData.desc = response.data.weather[0].description
      weatherData.current_temp = response.data.main.temp
      weatherData.max_temp = response.data.main.temp_max
      weatherData.min_temp = response.data.main.temp_min
      weatherData.wind_speed = response.data.wind.speed
      weatherData.gust = response.data.wind.gust
      weatherData.name = response.data.name
      weatherData.id = response.data.id
    })
  return {
    icon: weatherData.icon,
    desc: weatherData.desc,
    current_temp: weatherData.current_temp,
    min_temp: weatherData.min_temp,
    max_temp: weatherData.max_temp,
    wind_speed: weatherData.wind_speed,
    gust: weatherData.gust,
    name: weatherData.name
  }
}
