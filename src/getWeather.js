import axios from 'axios'

function getENV(key) {
  return import.meta.env[key]
}

const $api = axios.create({
  baseURL: getENV('VITE_API_BASE_URL'),
  timeout: '1000'
})

export async function getWeather(city) {
  let lat = 0
  let lon = 0
  let icon = ''
  let desc = ''
  let current_temp = 0
  let max_temp = 0
  let min_temp = 0
  let wind_speed = 0
  let gust = 0
  await $api
    .get(`geo/1.0/direct?q=${city}&limit=1&appid=${getENV('VITE_API_KEY')}`)
    .then((response) => {
      lat = response.data[0].lat
      lon = response.data[0].lon
    })
  await $api
    .get(`data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${getENV('VITE_API_KEY')}`)
    .then((response) => {
      icon = response.data.weather[0].icon
      desc = response.data.weather[0].description
      current_temp = response.data.main.temp
      max_temp = response.data.main.temp_max
      min_temp = response.data.main.temp_min
      wind_speed = response.data.wind.speed
      gust = response.data.wind.gust
    })
  return {
    icon: icon,
    desc: desc,
    current_temp: current_temp,
    min_temp: min_temp,
    max_temp: max_temp,
    wind_speed: wind_speed,
    gust: gust
  }
}
