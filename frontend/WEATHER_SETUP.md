# Weather API Setup Instructions

To get real weather data in your Soil Detection app, you need to set up a free OpenWeatherMap API key.

## Steps to Get Your API Key:

1. **Sign up for OpenWeatherMap**
   - Go to https://openweathermap.org/
   - Click "Sign Up" and create a free account
   - Verify your email address

2. **Get Your API Key**
   - After signing in, go to https://home.openweathermap.org/api_keys
   - Copy your default API key (it will look like a long string of letters and numbers)
   - Note: It may take a few minutes to a few hours for a new API key to become active

3. **Update the JavaScript File**
   - Open `frontend/script.js`
   - Find line 499: `const API_KEY = 'YOUR_API_KEY_HERE';`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

4. **Test the Weather Feature**
   - Open the app in your browser
   - Allow location permissions when prompted
   - The weather section should now show real data for your location

## Features Included:

- **Current Weather**: Temperature, conditions, and humidity for your location
- **5-Day Forecast**: Weather predictions for the next 5 days
- **Smart Monsoon Alerts**: Predicts rain based on humidity and cloud cover
- **Location-Based**: Automatically detects your location
- **Error Handling**: Falls back to default data if location/API fails

## Troubleshooting:

- **API Key Not Working**: Wait a few hours after generating the key, as it can take time to activate
- **Location Permission Denied**: Make sure to allow location access in your browser
- **Weather Not Updating**: Check browser console for error messages

## API Limits:

- Free tier allows 1,000 calls per day
- Weather updates every 10 minutes to stay within limits
- Current weather + 5-day forecast uses 2 calls per update

The app will work without an API key using default weather data, but real weather data provides much more accurate and useful information for farming decisions.
