# Weather-Forecast-App

## Overview

The Weather Forecast App is a web application that allows users to search for current weather conditions and a 5-day weather forecast for any city. The app utilizes the OpenWeatherMap API to fetch weather data and provides a user-friendly interface to display the information.

## Features

- Search for weather by city name.
- Display current weather conditions, including temp., humidity, & wind speed.
- Show a 5-day weather forecast with daily temperatures and weather icons.
- Store and display recent searches for quick access.
- Use geolocation to fetch weather data for the user's current location.

## Technologies Used

- HTML
- CSS (with Tailwind CSS for styling)
- JavaScript
- OpenWeatherMap API

## Getting Started

### Installation

1. Clone the repository:
   ```git clone https://github.com/shubhamsLinesOfCode/weather-forecast-app.git

   ```
2. Navigate to the project directory:
   ```cd weather-forecast-app

   ```
3. Open the `index.html` file in your web browser to view the app.

### API Key

To use the OpenWeatherMap API, you need to sign up for a free account and obtain an API key. Replace the placeholder API key in `src/app.js` with your actual API key:

## Obtaining and Using Your API Key

To use the Weather Forecast App, you need to obtain your own API key from OpenWeatherMap. Follow these steps:

1. **Create an Account**:

   - Visit [OpenWeatherMap](https://openweathermap.org/) and sign up for a free account.

2. **Get Your API Key**:

   - Log in to your account and navigate to the "API keys" section.
   - Copy the default API key or create a new one.

3. **Replace the API Key in the Project**:

   - Open the `src/app.js` file in your project.
   - Find the line:
     ```javascript
     const apiKey = "c08aa9ac53034c2f62193dfc0c7ab907";
     ```
   - Replace it with your API key:
     ```javascript
     const apiKey = "your_actual_api_key_here";
     ```

4. **Save and Run**:
   - Save your changes and open the `index.html` file in your web browser.

If you encounter any issues, feel free to reach out for help!

## Usage

- Enter a city name in the search box and click the search button or press Enter to get the weather information.
- Click the location button to fetch weather data for your current location.
- Recent searches will be stored and displayed in a dropdown for easy access.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather data API.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
