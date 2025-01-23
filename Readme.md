# LocalExplorerApp

A location-based activity recommendation application that uses Spring Boot, React, Google Maps API,Weather API, and Gemini API to suggest places to visit based on the user's location and preferences.

# How to Use

When you visit the website, you'll be greeted by an interactive map, a dropdown menu, and a Get Recommendations button. The dropdown allows you to select the type of places you'd like recommendations for, such as restaurants, cafes, parks, museums, or bars.

After selecting a place type, you click on the Get Recommendations button. The app will retrieve recommendations for nearby places based on your current location. These places are displayed as markers on the map, and a description of the top recommendation appears at the bottom of the page.

To navigate to a specific place, click on its marker on the map. The app will then display the walking directions from your current location to the selected place, helping you find your way easily.

## Table of Contents

1.  [Introduction](#introduction)
2.  [Features](#features)
3.  [Prerequisites](#prerequisites)
4.  [Installation](#installation)
    - [Backend Setup (Spring Boot)](#backend-setup-spring-boot)
    - [Frontend Setup (React)](#frontend-setup-react)
5.  [Configuration](#configuration)
    - [API Keys](#api-keys)
    - [CORS Configuration](#cors-configuration)
6.  [Running the Application](#running-the-application) - [Running the Backend](#running-the-backend) - [Running the Frontend](#running-the-frontend)
    7

## Introduction

LocalExplorerApp is designed to help users discover interesting places and activities in their vicinity. It leverages the user's location, weather information, and personalized recommendations from the Gemini API to provide a seamless and engaging experience.

## Features

- **Geolocation:** Determines the user's current location using the browser's geolocation API.
- **Weather Integration:** Fetches real-time weather data for the user's location.
- **Google Maps Integration:** Uses the Google Maps API to display nearby places and provide directions.
- **Gemini API Integration:** Generates personalized activity recommendations based on the user's location, weather, and preferences.
- **Place Type Filtering:** Allows users to filter places by type (e.g., restaurants, cafes, parks).
- **Swipeable Recommendations:** Provides a swipeable interface for browsing recommendations.
- **Interactive Map:** Displays places on an interactive Google Map.
- **Directions:** Provides walking directions to selected places.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK):** Version 17 or higher. You can download it from [Oracle](https://www.oracle.com/java/technologies/javase-downloads.html) or use an open-source distribution like [OpenJDK](https://openjdk.java.net/).
- **Node.js:** Version 16 or higher. You can download it from [https://nodejs.org/](https://nodejs.org/).
- **npm (Node Package Manager):** Usually comes with Node.js. Verify by running `npm -v` in your terminal. If you prefer, you can use [Yarn](https://yarnpkg.com/) instead.
- **A Google Cloud Platform (GCP) account** (for Google Maps API and Gemini API).
- **API Keys:** You'll need API keys for Google Maps API, WeatherAPI, and Gemini API. See the [Configuration](#configuration) section for details.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Said-ob7/LocalExplorerApp
    cd LocalExplorerApp
    ```

2.  **Project Structure:**

    The project has the following structure:

    ```
    LocalExplorerApp/
    ├── LocalExplorer/           # Spring Boot backend application
    │   ├── src/
    │   ├── pom.xml
    │   └── .env         # API keys (see Configuration)
    ├── LocalExplorerFront/          # React frontend application
    │   ├── src/
    │   ├── package.json
    │   └── .env         # API keys (see Configuration)
    ├── README.md
    └── .gitignore
    ```

### Backend Setup (Spring Boot)

1.  **Navigate to the backend directory:**

    ```bash
    cd LocalExplorer
    ```

2.  **Build the project using Maven:**

    ```bash
    mvn clean install
    ```

### Frontend Setup (React)

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../LocalExplorerFront
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

## Configuration

### API Keys

1.  **Obtain API Keys:**

    - **Google Maps API:**
      - Go to the [Google Cloud Console](https://console.cloud.google.com/).
      - Create a new project or select an existing one.
      - Enable the "Maps JavaScript API" and "Places API".
      - Create an API key.
      - **Important:** Restrict the API key to specific websites (your development URL: `http://localhost:5173` and your production domain) and the "Maps JavaScript API" and "Places API" to prevent unauthorized use.
    - **Gemini API:**
      - Go to the [Google AI Studio](https://makersuite.google.com/).
      - Create a new API key.
      - **Important:** Protect your Gemini API key and follow Google's guidelines for responsible AI development.
    - **WeatherAPI:**
      - Go to [https://www.weatherapi.com/](https://www.weatherapi.com/) and sign up for an account to obtain an API key.

2.  **Configure Environment Variables:**

    - Create a `.env` file in the `backend` directory and add the following:

      ```
      GEMINI_API_KEY=YOUR_GEMINI_API_KEY
      GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
      WEATHER_API_KEY=YOUR_WEATHER_API_KEY
      ```

      Replace `YOUR_GEMINI_API_KEY`, `YOUR_GOOGLE_MAPS_API_KEY`, and `YOUR_WEATHER_API_KEY` with your actual API keys.

    - Create a `.env` file in the `frontend` directory and add the following:

      ```
      VITE_REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
      ```

      Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual Google Maps API key. The `VITE_REACT_APP_` prefix is important for Vite to recognize the environment variable. **Note:** While the frontend needs the Google Maps API key, it's best practice to restrict its usage and protect it as much as possible.

    - **Important:** **Never commit your `.env` files to your repository.** Ensure that `.env` is included in your `.gitignore` file.

### CORS Configuration

The backend is configured to allow requests from `http://localhost:5173` by default. If your frontend runs on a different port, modify the `CorsConfig.java` file in the backend to include your frontend's URL.

```java
// CorsConfig.java
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // <-- Change this if needed
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
                "Accept", "Authorization", "Origin , Accept", "X-Requested-With",
                "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

}
```
