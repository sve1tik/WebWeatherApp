<script setup>
import { getWeather, getLocalGEO } from "./getWeather.js";
import { onMounted, ref } from 'vue';
import iziToast from 'iziToast';


iziToast.settings({
	timeout: 10000,
	position: 'topRight',
	resetOnHover: true,
	icon: 'material-icons',
	transitionIn: 'flipInX',
	transitionOut: 'flipOutX',
});


let city = ref();
let weatherData = ref({
	currentTemp: null,
	icon: null,
	desc: null,
	gust: null,
	maxTemp: null,
	minTemp: null,
	windSpeed: null,
	name: null
});


onMounted(() => {
	navigator.geolocation.getCurrentPosition(position => {
		const { latitude, longitude } = position.coords;
		getLocalGEO(latitude, longitude).then(response => {
			sendCity(response)
		});
	})
}
);

function sendCity(city) {
	if (!city) {
		iziToast.error({
			title: 'Error',
			message: 'Enter the city',
		});
		return 0
	}
	getWeather(city).then(response => {
		weatherData.value.currentTemp = response.current_temp;
		weatherData.value.icon = response.icon;
		weatherData.value.desc = response.desc;
		weatherData.value.gust = response.gust;
		weatherData.value.maxTemp = response.max_temp;
		weatherData.value.minTemp = response.min_temp;
		weatherData.value.windSpeed = response.wind_speed;
		weatherData.value.name = response.name;
	});
}
</script>

<template>
	<main>
		<section>
			<div class="container">
				<form @submit.prevent="sendCity(city)" class="d-grid row-gap-3 pt-lg-3">
					<div class="form-floating">
						<input type="text" v-model="city" placeholder="Enter city name" class="form-control w-100" name="city">
						<label for="city" class="label">Enter city name</label>
					</div>
					<button type="submit" class="btn btn-success">Send city</button>
				</form>
			</div>
		</section>
		<section class="weather">
			<div class="container">
				<div class="content card justify-content-center">
					<div class="content__wrapper card-body d-flex column-gap-5">
						<div>
							<p class="card-title">{{ city || weatherData.name }}</p>
							<h2 class="card-title">Weather: </h2>
							<img :src="`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`" alt="" class="card-img">
							<p class="card-text">{{ weatherData.desc }}</p>
						</div>
						<div>
							<div>
								<p class="card-text">Current temperature: {{ weatherData.currentTemp }}°C</p>
								<p class="card-text">Wind speed: {{ weatherData.windSpeed }} m/s</p>
								<p class="card-text">Max temperature: {{ weatherData.maxTemp }}°C</p>
								<p class="card-text">Min temperature: {{ weatherData.minTemp }}°C</p>
								<p class="card-text">Gust: {{ weatherData.gust }} m/s</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<style scoped>
form {
	width: 100%;
}

.weather {
	padding-top: 100px;
}


.content>img {
	width: 100px;
}
</style>
