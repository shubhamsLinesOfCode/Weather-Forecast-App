const apiKey = "c08aa9ac53034c2f62193dfc0c7ab907";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast/";

const searchBox = document.querySelector(".searchBox input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const weatherSection = document.querySelector("section");
weatherSection.classList.add("min-h-[375px]"); // Adjust 400px to your desired height
const recentSearchesDropdown = document.getElementById("recentSearches");

// Maximum number of recent searches to store
const MAX_RECENT_SEARCHES = 10;

// Function to format date
function formatDate(dt) {
  const date = new Date(dt * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Function to get weather icon URL
function getWeatherIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// Function to get recent searches from localStorage
function getRecentSearches() {
  const searches = localStorage.getItem("recentSearches");
  return searches ? JSON.parse(searches) : [];
}

// Function to add a city to recent searches
function addToRecentSearches(city) {
  let searches = getRecentSearches();
  searches = searches.filter(
    (search) => search.toLowerCase() !== city.toLowerCase()
  );
  searches.unshift(city);
  searches = searches.slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem("recentSearches", JSON.stringify(searches));
  updateRecentSearchesDropdown();
}

// Function to update the recent searches dropdown
function updateRecentSearchesDropdown() {
  const searches = getRecentSearches();
  //above line always first to fetch the recentSearches
  if (searches.length === 0) {
    recentSearchesDropdown.classList.add("hidden");
    return;
  }

  recentSearchesDropdown.innerHTML = searches
    .map(
      (city) =>
        `<div class="recent-city p-2 hover:bg-gray-100 cursor-pointer">${city}</div>`
    )
    .join("");

  const cityElements = recentSearchesDropdown.querySelectorAll(".recent-city");
  cityElements.forEach((element) => {
    element.addEventListener("click", () => {
      checkWeather(element.textContent.trim());
      recentSearchesDropdown.classList.add("hidden");
      //searchBox.value = element.textContent.trim();
      searchBox.value = "";
    });
  });
}

// Show/hide dropdown based on input focus
searchBox.addEventListener("focus", () => {
  const searches = getRecentSearches();
  if (searches.length > 0) {
    recentSearchesDropdown.classList.remove("hidden");
  }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (event) => {
  if (!event.target.closest(".searchBox")) {
    recentSearchesDropdown.classList.add("hidden");
  }
});

// Function to get weather and forecast by coordinates
async function getWeatherByCoords(latitude, longitude) {
  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(
        `${weatherUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      ),
      fetch(
        `${forecastUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      ),
    ]);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error("Weather data not found");
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();
    displayWeatherAndForecast(weatherData, forecastData);
  } catch (error) {
    showError("Unable to fetch weather data");
  }
}

// Function to get current location
function getCurrentLocation() {
  weatherSection.innerHTML = `<div class="p-4">
            <p class="text-blue-500">Fetching your location...</p>
        </div>`;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            showError("Please allow location access to use this feature");
            break;
          case error.POSITION_UNAVAILABLE:
            showError("Location information unavailable");
            break;
          case error.TIMEOUT:
            showError("Location request timed out");
            break;
          default:
            showError("An error occurred while getting location");
        }
      }
    );
  } else {
    showError("Geolocation is not supported by your browser");
  }
}

// Function to display weather and forecast data
function displayWeatherAndForecast(weatherData, forecastData) {
  // Get daily forecasts (one forecast per day)
  const dailyForecasts = forecastData.list.reduce((acc, forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = forecast;
    }
    return acc;
  }, {});

  // Convert to array and get first 5 days
  const fiveDayForecast = Object.values(dailyForecasts).slice(1, 6);

  weatherSection.innerHTML = `<div class="weather-info rounded-lg text-slate-600">
            <!-- Current Weather -->
            <div class="current-weather mb-3 bg-white/15 p-3 rounded-lg">
                <h2 class="text-xl font-bold mb-1">${weatherData.name}</h2>
                <div class="flex items-center">
                    <img src="${getWeatherIconUrl(
                      weatherData.weather[0].icon
                    )}" alt="Weather icon" class="w-12 h-12">
                    <div class="temp text-3xl ml-2">${Math.round(
                      weatherData.main.temp
                    )}°C</div>
                </div>
                <div class="description text-lg mb-2 capitalize">${
                  weatherData.weather[0].description
                }</div>
                <div class="details grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <div class="label text-gray-400">Humidity</div>
                        <div class="value">${weatherData.main.humidity}%</div>
                    </div>
                    <div>
                        <div class="label text-gray-400">Wind Speed</div>
                        <div class="value">${weatherData.wind.speed} km/h</div>
                    </div>
                </div>
            </div>

            <!-- 5-Day Forecast -->
            <div class="forecast">
                <h3 class="text-lg font-semibold mb-2">5-Day Forecast</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
                    ${fiveDayForecast
                      .map(
                        (day) => `
                        <div class="forecast-day p-1.5 bg-white/25 rounded-lg text-center">
                            <div class="text-sm font-medium">${formatDate(
                              day.dt
                            )}</div>
                            <img src="${getWeatherIconUrl(
                              day.weather[0].icon
                            )}" alt="Weather icon" class="w-6 h-6 mx-auto my-0.5">
                            <div class="text-sm font-bold">${Math.round(
                              day.main.temp
                            )}°C</div>
                            <div class="text-[12px] space-y-0.5">
                                <div class="flex items-center justify-center gap-0.5">
                                    <span class="text-[11px]">💧</span>
                                    <span>${day.main.humidity}%</span>
                                </div>
                                <div class="flex items-center justify-center gap-0.5">
                                    <span class="text-[11px]">💨</span>
                                    <span>${Math.round(
                                      day.wind.speed
                                    )} km/h</span>
                                </div>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        </div>`;
}

// Function to show error messages
function showError(message) {
  weatherSection.innerHTML = `
        <div class="error p-4 bg-transparent rounded-lg shadow-md">
            <p class="text-red-500">${message}</p>
        </div>
    `;
}

async function checkWeather(city) {
  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`),
      fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`),
    ]);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error("City not found");
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();
    displayWeatherAndForecast(weatherData, forecastData);
    addToRecentSearches(city);
  } catch (error) {
    showError("City not found. Please try again.");
  }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  if (searchBox.value.trim() !== "") {
    checkWeather(searchBox.value);
    searchBox.value = "";
  }
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && searchBox.value.trim() !== "") {
    checkWeather(searchBox.value);
  }
});

locationBtn.addEventListener("click", getCurrentLocation);

// Initialize recent searches dropdown
updateRecentSearchesDropdown();
