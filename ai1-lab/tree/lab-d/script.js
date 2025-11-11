async function getWeather() {
    const city = document.getElementById('city-input').value.trim();
    const results = document.getElementById('weather-results');

    if (!city) {
        results.innerHTML = "<p>⚠️ Wpisz nazwę miasta!</p>";
        return;
    }

    const apiKey = "1766c633d1f9ddf5e100093372fd3c56";

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", currentUrl);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const currentData = JSON.parse(xhr.responseText);
            console.log("Odpowiedź current weather:", currentData);

            const currentDate = new Date(currentData.dt * 1000).toLocaleString('pl-PL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
            });

            results.innerHTML = `
                <h3>Obecna pogoda:</h3>
                <div class="main-weather">
                    <h2>${currentData.name}</h2>
                    <p class="date">${currentDate}</p>
                    <div class="main-weather-info">
                        <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="${currentData.weather[0].description}">
                        <div>
                            <p class="temp">${Math.round(currentData.main.temp)}°C</p>
                            <p class="desc">${currentData.weather[0].description}</p>
                            <p>💧 Wilgotność: ${currentData.main.humidity}% &nbsp; 💨 ${currentData.wind.speed} m/s</p>
                            <p>🔽 Ciśnienie: ${currentData.main.pressure} hPa</p>
                            <p>🌡️ Odczuwalna: ${Math.round(currentData.main.feels_like)}°C</p>
                        </div>
                    </div>
                </div>
                <h3>Prognoza godzinowa</h3>
            `;

            loadForecast(city, apiKey);
        } else {
            results.innerHTML = `<p>❌ Nie znaleziono miasta: <strong>${city}</strong>.</p>`;
        }
    };
    xhr.onerror = function () {
        console.error("❌ Błąd żądania XMLHttpRequest");
        results.innerHTML = "<p>⚠️ Błąd podczas pobierania aktualnej pogody.</p>";
    };
    xhr.send();
}

async function loadForecast(city, apiKey) {
    const results = document.getElementById('weather-results');
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Odpowiedź forecast:", data);

        if (data.cod == 200 || data.cod === "200") {
            let html = results.innerHTML;
            html += `<div class="forecast-grid">`;

            data.list.forEach(forecast => {
                const time = new Date(forecast.dt * 1000).toLocaleString('pl-PL', {
                    weekday: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                html += `
                    <div class="forecast-card">
                        <div class="forecast-main">
                            <p class="time">${time}</p>
                            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
                            <p class="temp">${Math.round(forecast.main.temp)}°C</p>
                            <p class="desc">${forecast.weather[0].description}</p>
                        </div>
                        <div class="forecast-details">
                            <p>💧 Wilgotność: ${forecast.main.humidity}%</p>
                            <p>💨 Wiatr: ${forecast.wind.speed} m/s</p>
                            <p>🔽 Ciśnienie: ${forecast.main.pressure} hPa</p>
                            <p>🌡️ Odczuwalna: ${Math.round(forecast.main.feels_like)}°C</p>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
            results.innerHTML = html;
        } else {
            results.innerHTML += `<p>❌ Nie udało się pobrać prognozy.</p>`;
        }
    } catch (error) {
        console.error("Błąd Fetch API:", error);
        results.innerHTML += "<p>⚠️ Wystąpił błąd podczas pobierania prognozy.</p>";
    }
}
