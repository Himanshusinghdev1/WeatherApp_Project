const apiKey = 'ad839b87cf90127b6592eb57fadfac42'; // OpenWeatherMap API key

document.getElementById('weather-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

async function getWeatherData(city) {
    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const currentWeatherData = await currentWeatherResponse.json();
        
        if (currentWeatherData.cod === '404') {
            alert('City not found. Please enter a valid city.');
            return;
        }

        displayCurrentWeather(currentWeatherData);

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();

        if (forecastData.cod === '404') {
            alert('Forecast data not available.');
            return;
        }

        displayWeeklyForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again later.');
    }
}

function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('current-weather').textContent = `Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}`;
    document.getElementById('weather-result').classList.remove('hidden');
}

function displayWeeklyForecast(data) {
    const forecastContainer = document.getElementById('weekly-forecast');
    forecastContainer.innerHTML = '';

    const dailyData = data.list.filter((reading) => reading.dt_txt.includes('12:00:00'));

    dailyData.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <span>${new Date(day.dt * 1000).toLocaleDateString()}</span>
            <span>Temp: ${day.main.temp}°C</span>
            <span>${day.weather[0].description}</span>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}
