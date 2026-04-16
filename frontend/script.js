// Screen Navigation
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show the target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    // Update bottom navigation
    updateBottomNav(screenId);
}

// Bottom Navigation
function updateBottomNav(activeScreenId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.screen === activeScreenId) {
            item.classList.add('active');
        }
    });
}

// Tab Navigation (for Scanner screen)
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Show the target tab content
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
}

// Bottom Navigation Click Handlers
function initBottomNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.dataset.screen;
            showScreen(screenId);
        });
    });
}

// Quick Access Button Handlers
function initQuickAccess() {
    const accessButtons = document.querySelectorAll('.access-btn');
    
    accessButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Add ripple effect
            createRipple(button, event);
        });
    });
}

// Create Ripple Effect
function createRipple(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Camera and Soil Analysis Functionality
let stream = null;
let capturedImageData = null;

// Camera Management
async function startCamera() {
    try {
        const video = document.getElementById('video');
        const startBtn = document.getElementById('start-camera-btn');
        const captureBtn = document.getElementById('capture-btn');
        
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        video.srcObject = stream;
        video.classList.remove('hidden');
        startBtn.classList.add('hidden');
        captureBtn.classList.remove('hidden');
        
        showNotification('Camera started successfully!', 'success');
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showNotification('Failed to access camera. Please check permissions.', 'error');
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

function captureImage() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const capturedImageContainer = document.getElementById('captured-image-container');
    const capturedImage = document.getElementById('captured-image');
    const captureBtn = document.getElementById('capture-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image data
    capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
    capturedImage.src = capturedImageData;
    
    // Update UI
    video.classList.add('hidden');
    captureBtn.classList.add('hidden');
    analyzeBtn.classList.remove('hidden');
    capturedImageContainer.classList.remove('hidden');
    
    stopCamera();
    showNotification('Image captured successfully!', 'success');
}

function retakePhoto() {
    const video = document.getElementById('video');
    const capturedImageContainer = document.getElementById('captured-image-container');
    const captureBtn = document.getElementById('capture-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // Reset UI
    video.classList.remove('hidden');
    capturedImageContainer.classList.add('hidden');
    captureBtn.classList.remove('hidden');
    analyzeBtn.classList.add('hidden');
    
    capturedImageData = null;
    
    // Restart camera
    startCamera();
}

function uploadImage() {
    const fileInput = document.getElementById('file-input');
    
    // Trigger file selection
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                capturedImageData = e.target.result;
                displayUploadedImage(capturedImageData);
                showNotification('Image uploaded successfully!', 'success');
            };
            
            reader.readAsDataURL(file);
        } else {
            showNotification('Please select a valid image file', 'error');
        }
    });
}

function displayUploadedImage(imageData) {
    const capturedImageContainer = document.getElementById('captured-image-container');
    const capturedImage = document.getElementById('captured-image');
    const uploadBtn = document.getElementById('upload-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const video = document.getElementById('video');
    const placeholder = document.getElementById('scan-placeholder');
    
    // Display uploaded image
    capturedImage.src = imageData;
    capturedImageContainer.classList.remove('hidden');
    
    // Update UI
    video.classList.add('hidden');
    placeholder.classList.add('hidden');
    uploadBtn.classList.add('hidden');
    analyzeBtn.classList.remove('hidden');
}

async function analyzeSoil() {
    if (!capturedImageData) {
        showNotification('Please capture an image first', 'error');
        return;
    }
    
    const analyzeBtn = document.getElementById('analyze-btn');
    const originalText = analyzeBtn.innerHTML;
    
    try {
        // Show loading state
        analyzeBtn.innerHTML = '<span class="loading"></span> Analyzing...';
        analyzeBtn.disabled = true;
        
        // Simulate API call with mock data for demo
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
        
        // Mock analysis result based on random selection
        const mockResults = [
            {
                soilType: "Clay Loam",
                phLevel: "6.8",
                texture: "Fine-textured",
                color: "Dark Brown",
                moistureContent: "25%",
                nutrientContent: "High - Rich in organic matter",
                confidenceScore: 0.92,
                recommendedPlants: [
                    {
                        plantName: "Tomato",
                        scientificName: "Solanum lycopersicum",
                        description: "High-yield vegetable perfect for this soil type",
                        soilRequirements: "Well-drained, pH 6.0-7.0",
                        growingSteps: ["Prepare soil with compost", "Plant seedlings 24 inches apart", "Water regularly", "Add support stakes"],
                        careInstructions: ["Daily watering", "Weekly fertilizing", "Prune lower leaves", "Monitor for pests"],
                        growingPeriodDays: "60-80",
                        difficulty: "Medium",
                        successRate: "85"
                    },
                    {
                        plantName: "Lettuce",
                        scientificName: "Lactuca sativa",
                        description: "Fast-growing leafy green ideal for clay loam",
                        soilRequirements: "Moist, well-drained soil",
                        growingSteps: ["Till soil lightly", "Sow seeds shallow", "Thin seedlings", "Harvest outer leaves"],
                        careInstructions: ["Keep soil moist", "Partial shade in hot weather", "Regular harvesting"],
                        growingPeriodDays: "45-60",
                        difficulty: "Easy",
                        successRate: "90"
                    }
                ]
            },
            {
                soilType: "Sandy Loam",
                phLevel: "6.2",
                texture: "Medium-textured",
                color: "Light Brown",
                moistureContent: "15%",
                nutrientContent: "Medium - Good drainage",
                confidenceScore: 0.88,
                recommendedPlants: [
                    {
                        plantName: "Carrot",
                        scientificName: "Daucus carota",
                        description: "Root vegetable that thrives in sandy loam",
                        soilRequirements: "Loose, well-drained soil",
                        growingSteps: ["Remove rocks from soil", "Plant seeds 1/4 inch deep", "Thin to 2 inches apart", "Mulch to retain moisture"],
                        careInstructions: ["Even watering", "Weed regularly", "Harvest when mature"],
                        growingPeriodDays: "70-80",
                        difficulty: "Easy",
                        successRate: "82"
                    },
                    {
                        plantName: "Potato",
                        scientificName: "Solanum tuberosum",
                        description: "Staple crop suitable for sandy loam soils",
                        soilRequirements: "Well-drained, loose soil",
                        growingSteps: ["Plant seed potatoes", "Hill soil around stems", "Water consistently", "Harvest when tops die"],
                        careInstructions: ["Regular hilling", "Pest monitoring", "Proper drainage"],
                        growingPeriodDays: "90-120",
                        difficulty: "Medium",
                        successRate: "78"
                    }
                ]
            },
            {
                soilType: "Silt Loam",
                phLevel: "7.1",
                texture: "Fine-textured",
                color: "Medium Brown",
                moistureContent: "30%",
                nutrientContent: "Very High - Fertile soil",
                confidenceScore: 0.95,
                recommendedPlants: [
                    {
                        plantName: "Wheat",
                        scientificName: "Triticum aestivum",
                        description: "Cereal crop that excels in fertile silt loam",
                        soilRequirements: "Fertile, well-drained soil",
                        growingSteps: ["Prepare seedbed", "Sow seeds evenly", "Apply fertilizer", "Monitor growth stages"],
                        careInstructions: ["Irrigation during dry periods", "Disease monitoring", "Timely harvesting"],
                        growingPeriodDays: "120-150",
                        difficulty: "Medium",
                        successRate: "88"
                    },
                    {
                        plantName: "Soybean",
                        scientificName: "Glycine max",
                        description: "Legume crop perfect for nitrogen-rich silt loam",
                        soilRequirements: "Well-drained, fertile soil",
                        growingSteps: ["Inoculate seeds", "Plant in rows", "Control weeds", "Monitor pod development"],
                        careInstructions: ["Regular monitoring", "Proper irrigation", "Pest control"],
                        growingPeriodDays: "90-110",
                        difficulty: "Easy",
                        successRate: "92"
                    }
                ]
            }
        ];
        
        // Select random result for variety
        const analysisResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        
        // Display results
        displaySoilAnalysisResults(analysisResult);
        
        // Switch to results tab
        const resultsTab = document.querySelector('[data-tab="results"]');
        if (resultsTab) {
            resultsTab.click();
        }
        
        showNotification('Soil analysis completed successfully!', 'success');
        
    } catch (error) {
        console.error('Error analyzing soil:', error);
        showNotification('Failed to analyze soil. Please try again.', 'error');
    } finally {
        // Reset button state
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
    }
}

function displaySoilAnalysisResults(analysis) {
    // Show results container
    const resultsContainer = document.getElementById('soil-analysis-results');
    resultsContainer.classList.remove('hidden');
    
    // Update soil information
    document.getElementById('soil-type').textContent = analysis.soilType || 'N/A';
    document.getElementById('ph-level').textContent = analysis.phLevel || 'N/A';
    document.getElementById('soil-texture').textContent = analysis.texture || 'N/A';
    document.getElementById('soil-color').textContent = analysis.color || 'N/A';
    document.getElementById('moisture-content').textContent = analysis.moistureContent || 'N/A';
    document.getElementById('nutrient-content').textContent = analysis.nutrientContent || 'N/A';
    document.getElementById('confidence-score').textContent = 
        analysis.confidenceScore ? `${Math.round(analysis.confidenceScore * 100)}%` : 'N/A';
    
    // Display plant recommendations
    displayPlantRecommendations(analysis.recommendedPlants || []);
}

function displayPlantRecommendations(plants) {
    const plantsGrid = document.getElementById('plants-grid');
    plantsGrid.innerHTML = '';
    
    plants.forEach(plant => {
        const plantCard = createPlantCard(plant);
        plantsGrid.appendChild(plantCard);
    });
}

function createPlantCard(plant) {
    const card = document.createElement('div');
    card.className = 'plant-card';
    
    const difficultyClass = plant.difficulty ? plant.difficulty.toLowerCase() : 'medium';
    
    card.innerHTML = `
        <h4>${plant.plantName || 'Unknown Plant'}</h4>
        <div class="scientific-name">${plant.scientificName || 'N/A'}</div>
        <div class="description">${plant.description || 'No description available'}</div>
        <div class="soil-requirements">
            <strong>Soil Requirements:</strong> ${plant.soilRequirements || 'N/A'}
        </div>
        
        <div class="growing-steps">
            <h5>Growing Steps:</h5>
            <ul class="steps-list">
                ${(plant.growingSteps || []).map(step => `<li>${step}</li>`).join('')}
            </ul>
        </div>
        
        <div class="care-instructions">
            <h5>Care Instructions:</h5>
            <ul class="care-list">
                ${(plant.careInstructions || []).map(instruction => `<li>${instruction}</li>`).join('')}
            </ul>
        </div>
        
        <div class="plant-meta">
            <div class="period">
                <i class="fas fa-clock"></i>
                ${plant.growingPeriodDays || 'N/A'} days
            </div>
            <div class="difficulty ${difficultyClass}">
                ${plant.difficulty || 'Medium'}
            </div>
            <div class="success-rate">
                <i class="fas fa-chart-line"></i>
                ${plant.successRate || 'N/A'}%
            </div>
        </div>
    `;
    
    return card;
}

// Initialize Camera Controls
function initCameraControls() {
    const startBtn = document.getElementById('start-camera-btn');
    const captureBtn = document.getElementById('capture-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const uploadBtn = document.getElementById('upload-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startCamera);
    }
    
    if (captureBtn) {
        captureBtn.addEventListener('click', captureImage);
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeSoil);
    }
    
        
    if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadImage);
    }
}

// Scan Button Handler (updated for compatibility)
function initScanButton() {
    const scanButton = document.querySelector('.scan-btn');
    if (scanButton && !scanButton.id) {
        scanButton.addEventListener('click', () => {
            // Simulate scanning process for old functionality
            scanButton.innerHTML = '<span class="loading"></span> Scanning...';
            scanButton.disabled = true;
            
            setTimeout(() => {
                scanButton.innerHTML = 'Start Scanning';
                scanButton.disabled = false;
                // Show results tab
                const resultsTab = document.querySelector('[data-tab="results"]');
                if (resultsTab) {
                    resultsTab.click();
                }
            }, 3000);
        });
    }
}

// Disease Card Actions
function initDiseaseActions() {
    const viewDetailsButtons = document.querySelectorAll('.action-btn:not(.secondary)');
    const scanAgainButtons = document.querySelectorAll('.action-btn.secondary');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.disease-card');
            const diseaseName = card.querySelector('h3').textContent;
            showDiseaseDetails(diseaseName);
        });
    });
    
    scanAgainButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Switch to scan tab
            const scanTab = document.querySelector('[data-tab="scan"]');
            if (scanTab) {
                scanTab.click();
            }
        });
    });
}

// Show Disease Details (Modal or expanded view)
function showDiseaseDetails(diseaseName) {
    alert(`Detailed view for: ${diseaseName}\n\nThis would show comprehensive information about the disease, treatment options, and preventive measures.`);
}

// Filter Functionality
function initFilter() {
    const filterIcon = document.querySelector('.history-header i.fa-filter');
    if (filterIcon) {
        filterIcon.addEventListener('click', () => {
            alert('Filter options would appear here to filter scan history by date, crop type, or disease status.');
        });
    }
}

// Weather Data Update (real data from API)
async function updateWeatherData() {
    try {
        // Get user's location
        const position = await getCurrentLocation();
        const weatherData = await fetchWeatherData(position.lat, position.lon);
        
        // Update current weather
        updateCurrentWeather(weatherData.current);
        
        // Update forecast
        updateWeatherForecast(weatherData.forecast);
        
        // Show success notification (only on first load)
        if (!window.weatherLoaded) {
            showNotification('Weather data loaded successfully!', 'success');
            window.weatherLoaded = true;
        }
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        // Show user-friendly error message
        if (error.message.includes('API key not configured')) {
            showNotification('Weather API key needed. Check WEATHER_SETUP.md', 'error');
        } else if (error.message.includes('401') || error.message.includes('invalid or not activated')) {
            showNotification('API key issue. Wait 2 hours for activation or check key', 'error');
        } else if (error.message.includes('location')) {
            showNotification('Location access denied. Using default weather.', 'warning');
        } else {
            showNotification('Weather unavailable. Using default data.', 'warning');
        }
        
        // Fallback to default data if location/weather fails
        updateDefaultWeather();
    }
}

// Get user's current location
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                reject(new Error('Unable to retrieve your location'));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
}

// Test API key validity
async function testApiKey(API_KEY) {
    try {
        const testResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}&units=metric`
        );
        if (testResponse.ok) {
            const data = await testResponse.json();
            console.log('API key is valid! Test data:', data);
            return true;
        } else {
            console.error('API key test failed:', testResponse.status, testResponse.statusText);
            return false;
        }
    } catch (error) {
        console.error('API key test error:', error);
        return false;
    }
}

// Fetch weather data from OpenWeatherMap API
async function fetchWeatherData(lat, lon) {
    // IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key
    // Get your free key at: https://openweathermap.org/api
    const API_KEY = '97bba36204601646d1a8c11147729ca9'; // <-- REPLACE THIS WITH YOUR ACTUAL API KEY
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    
    // Check if API key is still the placeholder
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('Please replace YOUR_API_KEY_HERE with a real OpenWeatherMap API key');
        throw new Error('API key not configured. Please see WEATHER_SETUP.md for instructions.');
    }
    
    // Test API key first
    console.log('Testing API key...');
    const isKeyValid = await testApiKey(API_KEY);
    if (!isKeyValid) {
        throw new Error('API key is invalid or not activated. Please check: 1) Key is correct, 2) Wait 2 hours for activation, 3) Account is verified');
    }
    
    try {
        // Current weather
        const currentResponse = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!currentResponse.ok) {
            throw new Error(`Weather API error: ${currentResponse.status} ${currentResponse.statusText}`);
        }
        
        const currentData = await currentResponse.json();
        
        // Validate current weather data
        if (!currentData.main || !currentData.main.temp) {
            throw new Error('Invalid weather data received');
        }
        
        // 5-day forecast
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!forecastResponse.ok) {
            throw new Error(`Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`);
        }
        
        const forecastData = await forecastResponse.json();
        
        // Validate forecast data
        if (!forecastData.list || !Array.isArray(forecastData.list)) {
            throw new Error('Invalid forecast data received');
        }
        
        return {
            current: currentData,
            forecast: forecastData
        };
    } catch (error) {
        console.error('Weather API error:', error);
        throw error;
    }
}

// Update current weather display
function updateCurrentWeather(weather) {
    const tempElement = document.querySelector('.weather-temp');
    const conditionElement = document.querySelector('.weather-header p:nth-of-type(1)');
    const humidityElement = document.querySelector('.weather-header p:nth-of-type(2)');
    
    if (tempElement) tempElement.textContent = `${Math.round(weather.main.temp)}°C`;
    if (conditionElement) conditionElement.textContent = weather.weather[0].description;
    if (humidityElement) humidityElement.textContent = `Humidity: ${weather.main.humidity}%`;
    
    // Update monsoon alert based on weather conditions
    updateMonsoonAlert(weather);
}

// Update weather forecast display
function updateWeatherForecast(forecast) {
    const forecastContainer = document.querySelector('.weather-forecast');
    if (!forecastContainer) return;
    
    // Get daily forecasts (one per day)
    const dailyForecasts = getDailyForecasts(forecast.list);
    
    // Update forecast cards
    const forecastDays = forecastContainer.querySelectorAll('.forecast-day');
    dailyForecasts.slice(0, 5).forEach((dayData, index) => {
        if (forecastDays[index]) {
            const icon = forecastDays[index].querySelector('i');
            const dayName = forecastDays[index].querySelector('span:nth-of-type(1)');
            const temp = forecastDays[index].querySelector('span:nth-of-type(2)');
            
            // Update weather icon
            updateWeatherIcon(icon, dayData.weather[0].icon);
            
            // Update day name
            if (dayName) {
                const date = new Date(dayData.dt * 1000);
                dayName.textContent = getDayName(date);
            }
            
            // Update temperature
            if (temp) temp.textContent = `${Math.round(dayData.main.temp)}°`;
        }
    });
}

// Get daily forecasts from 3-hour data
function getDailyForecasts(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date] || item.dt > dailyData[date].dt) {
            dailyData[date] = item;
        }
    });
    
    return Object.values(dailyData);
}

// Update weather icon based on condition
function updateWeatherIcon(iconElement, iconCode) {
    if (!iconElement) return;
    
    const iconMap = {
        '01d': 'fas fa-sun',           // clear sky day
        '01n': 'fas fa-moon',          // clear sky night
        '02d': 'fas fa-cloud-sun',     // few clouds day
        '02n': 'fas fa-cloud-moon',    // few clouds night
        '03d': 'fas fa-cloud',         // scattered clouds
        '03n': 'fas fa-cloud',         // scattered clouds
        '04d': 'fas fa-cloud',         // broken clouds
        '04n': 'fas fa-cloud',         // broken clouds
        '09d': 'fas fa-cloud-rain',    // shower rain
        '09n': 'fas fa-cloud-rain',    // shower rain
        '10d': 'fas fa-cloud-sun-rain', // rain day
        '10n': 'fas fa-cloud-moon-rain', // rain night
        '11d': 'fas fa-bolt',          // thunderstorm
        '11n': 'fas fa-bolt',          // thunderstorm
        '13d': 'fas fa-snowflake',     // snow
        '13n': 'fas fa-snowflake',     // snow
        '50d': 'fas fa-smog',          // mist
        '50n': 'fas fa-smog'           // mist
    };
    
    iconElement.className = iconMap[iconCode] || 'fas fa-question';
}

// Get day name from date
function getDayName(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
}

// Update monsoon alert based on weather conditions
function updateMonsoonAlert(weather) {
    const alertElement = document.querySelector('.monsoon-alert');
    if (!alertElement) return;
    
    // Simple logic for monsoon prediction (you can make this more sophisticated)
    const humidity = weather.main.humidity;
    const clouds = weather.clouds.all;
    const rainProbability = weather.rain ? weather.rain['3h'] || 0 : 0;
    
    if (humidity > 80 && clouds > 60) {
        alertElement.textContent = 'High chance of rain in next 2-3 days';
        alertElement.style.display = 'inline-block';
    } else if (humidity > 70) {
        alertElement.textContent = 'Moderate rain possibility in 3-4 days';
        alertElement.style.display = 'inline-block';
    } else {
        alertElement.style.display = 'none';
    }
}

// Fallback weather data for when location/API fails
function updateDefaultWeather() {
    const tempElement = document.querySelector('.weather-temp');
    const conditionElement = document.querySelector('.weather-header p:nth-of-type(1)');
    const humidityElement = document.querySelector('.weather-header p:nth-of-type(2)');
    
    if (tempElement) tempElement.textContent = '28°C';
    if (conditionElement) conditionElement.textContent = 'Sunny, Light Breeze';
    if (humidityElement) humidityElement.textContent = 'Humidity: 65%';
    
    const alertElement = document.querySelector('.monsoon-alert');
    if (alertElement) {
        alertElement.textContent = 'Monsoon likely in 3 days';
        alertElement.style.display = 'inline-block';
    }
}

// Crop Price Updates (simulated)
function updateCropPrices() {
    const priceData = [
        { crop: 'Soybean', price: 3900 + Math.floor(Math.random() * 200), change: (Math.random() * 4 - 2).toFixed(1) },
        { crop: 'Wheat', price: 2150 + Math.floor(Math.random() * 100), change: (Math.random() * 3 - 1.5).toFixed(1) }
    ];
    
    const priceItems = document.querySelectorAll('.price-item');
    priceItems.forEach((item, index) => {
        if (priceData[index]) {
            const priceSpan = item.querySelector('.price');
            const changeSpan = item.querySelector('.change');
            
            if (priceSpan) priceSpan.textContent = `Rs ${priceData[index].price}`;
            if (changeSpan) {
                changeSpan.textContent = `${priceData[index].change > 0 ? '+' : ''}${priceData[index].change}%`;
                changeSpan.className = `change ${priceData[index].change > 0 ? 'positive' : 'negative'}`;
            }
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initBottomNavigation();
    initQuickAccess();
    initScanButton();
    initCameraControls();
    initDiseaseActions();
    initFilter();
    initPesticideGuide();
    
    // Initial weather update
    updateWeatherData();
    
    // Periodic updates
    setInterval(updateWeatherData, 600000); // Update weather every 10 minutes
    setInterval(updateCropPrices, 60000); // Update prices every minute
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Soil Detection Dashboard!', 'success');
    }, 1000);
});

// Handle browser back button
window.addEventListener('popstate', (event) => {
    // Custom back button handling if needed
    const currentScreen = document.querySelector('.screen:not(.hidden)');
    if (currentScreen && currentScreen.id !== 'dashboard-screen') {
        showScreen('dashboard-screen');
    }
});

// Touch gestures for mobile (optional enhancement)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const currentScreen = document.querySelector('.screen:not(.hidden)');
        const screens = ['dashboard-screen', 'scanner-screen', 'crop-screen', 'health-screen', 'profile-screen'];
        const currentIndex = screens.indexOf(currentScreen.id);
        
        if (diff > 0 && currentIndex < screens.length - 1) {
            // Swipe left - next screen
            showScreen(screens[currentIndex + 1]);
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe right - previous screen
            showScreen(screens[currentIndex - 1]);
        }
    }
}

// Pesticide Guide Data and Functionality
const plantGuideData = {
    featured: [
        {
            name: "Tomato",
            image: "https://images.unsplash.com/photo-1592924357228-91a4da4a745f?w=400",
            category: "vegetables",
            value: "High yield, versatile",
            videoId: "jJy2kO_8Y9M"
        },
        {
            name: "Mango",
            image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
            category: "fruits",
            value: "Premium market price",
            videoId: "jJy2kO_8Y9M"
        },
        {
            name: "Rice",
            image: "https://images.unsplash.com/photo-1586201375761-83865002ecef?w=400",
            category: "grains",
            value: "Staple food demand",
            videoId: "jJy2kO_8Y9M"
        }
    ],
    plants: [
        {
            name: "Tomato",
            scientificName: "Solanum lycopersicum",
            category: "vegetables",
            image: "https://images.unsplash.com/photo-1592924357228-91a4da4a745f?w=400",
            description: "High-yield vegetable perfect for Indian climate",
            growingSeason: "Year-round (avoid extreme summers)",
            soilType: "Well-drained, pH 6.0-6.8",
            waterNeeds: "Regular, 1-2 inches per week",
            commonPests: ["Aphids", "Whiteflies", "Tomato hornworm"],
            pesticides: [
                {
                    name: "Neem Oil",
                    type: "Organic",
                    dosage: "2ml per liter water",
                    frequency: "Weekly"
                },
                {
                    name: "Imidacloprid",
                    type: "Chemical",
                    dosage: "0.5ml per liter water",
                    frequency: "Bi-weekly"
                }
            ],
            videoId: "jJy2kO_8Y9M",
            difficulty: "Easy",
            harvestTime: "60-80 days"
        },
        {
            name: "Chili Pepper",
            scientificName: "Capsicum annuum",
            category: "vegetables",
            image: "https://images.unsplash.com/photo-1604704179229-181c8298d042?w=400",
            description: "Spicy vegetable with high market demand",
            growingSeason: "Summer to monsoon",
            soilType: "Sandy loam, pH 6.5-7.0",
            waterNeeds: "Moderate, avoid waterlogging",
            commonPests: ["Thrips", "Mites", "Fruit flies"],
            pesticides: [
                {
                    name: "Bacillus thuringiensis",
                    type: "Biological",
                    dosage: "1g per liter water",
                    frequency: "Weekly"
                },
                {
                    name: "Spinosad",
                    type: "Bio-pesticide",
                    dosage: "1ml per liter water",
                    frequency: "10 days"
                }
            ],
            videoId: "jJy2kO_8Y9M",
            difficulty: "Medium",
            harvestTime: "90-120 days"
        },
        {
            name: "Mango",
            scientificName: "Mangifera indica",
            category: "fruits",
            image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
            description: "King of fruits with excellent commercial value",
            growingSeason: "Summer fruiting",
            soilType: "Deep, well-drained, pH 5.5-7.5",
            waterNeeds: "Moderate, reduce during flowering",
            commonPests: ["Mango hopper", "Fruit fly", "Powdery mildew"],
            pesticides: [
                {
                    name: "Copper oxychloride",
                    type: "Fungicide",
                    dosage: "3g per liter water",
                    frequency: "Pre-monsoon"
                },
                {
                    name: "Dimethoate",
                    type: "Insecticide",
                    dosage: "2ml per liter water",
                    frequency: "Monthly"
                }
            ],
            videoId: "jJy2kO_8Y9M",
            difficulty: "Hard",
            harvestTime: "3-5 years"
        },
        {
            name: "Banana",
            scientificName: "Musa paradisiaca",
            category: "fruits",
            image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
            description: "Fast-growing fruit with year-round demand",
            growingSeason: "Year-round",
            soilType: "Rich, well-drained, pH 6.0-7.5",
            waterNeeds: "High, maintain moisture",
            commonPests: ["Weevils", "Nematodes", "Sigatoka leaf spot"],
            pesticides: [
                {
                    name: "Carbendazim",
                    type: "Fungicide",
                    dosage: "1g per liter water",
                    frequency: "Monthly"
                },
                {
                    name: "Phorate",
                    type: "Insecticide",
                    dosage: "3kg per hectare",
                    frequency: "Quarterly"
                }
            ],
            videoId: "jJy2kO_8Y9M",
            difficulty: "Easy",
            harvestTime: "9-12 months"
        },
        {
            name: "Rice",
            scientificName: "Oryza sativa",
            category: "grains",
            image: "https://images.unsplash.com/photo-1586201375761-83865002ecef?w=400",
            description: "Staple grain with guaranteed market",
            growingSeason: "Kharif & Rabi seasons",
            soilType: "Clay loam, pH 6.0-7.0",
            waterNeeds: "High, flooded fields",
            commonPests: ["Brown planthopper", "Stem borer", "Blast disease"],
            pesticides: [
                {
                    name: "Validamycin",
                    type: "Fungicide",
                    dosage: "2ml per liter water",
                    frequency: "At disease onset"
                },
                {
                    name: "Chlorpyrifos",
                    type: "Insecticide",
                    dosage: "2.5ml per liter water",
                    frequency: "Based on pest count"
                }
            ],
            videoId: "jJy2kO_8Y9M",
            difficulty: "Medium",
            harvestTime: "90-120 days"
        },
        {
            name: "Wheat",
            scientificName: "Triticum aestivum",
            category: "grains",
            image: "https://images.unsplash.com/photo-1598173347245-4391a2a6dc61?w=400",
            description: "Rabi season staple with government support",
            growingSeason: "Rabi season (Oct-Mar)",
            soilType: "Loamy, pH 6.0-7.0",
            waterNeeds: "Moderate, 4-5 irrigations",
            commonPests: ["Aphids", "Termites", "Rust disease"],
            pesticides: [
                {
                    name: "Propiconazole",
                    type: "Fungicide",
                    dosage: "1ml per liter water",
                    frequency: "Pre-flowering"
                },
                {
                    name: "Deltamethrin",
                    type: "Insecticide",
                    dosage: "1ml per liter water",
                    frequency: "Based on pest incidence"
                }
            ],
            videoId: "jJy2kO_8Y9M",
            difficulty: "Easy",
            harvestTime: "100-120 days"
        }
    ],
    pesticides: [
        {
            name: "Neem Oil",
            type: "Organic",
            target: "Broad spectrum",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
            description: "Natural pesticide safe for all crops",
            dosage: "2-5ml per liter water",
            price: "Rs 200-500 per liter",
            availability: "Widely available",
            videoId: "jJy2kO_8Y9M"
        },
        {
            name: "Imidacloprid",
            type: "Chemical",
            target: "Sucking pests",
            image: "https://images.unsplash.com/photo-1584118627021-8bdfbb84f3a5?w=400",
            description: "Effective against aphids and whiteflies",
            dosage: "0.5-1ml per liter water",
            price: "Rs 800-1200 per liter",
            availability: "Licensed dealers",
            videoId: "jJy2kO_8Y9M"
        },
        {
            name: "Bacillus thuringiensis",
            type: "Biological",
            target: "Caterpillars",
            image: "https://images.unsplash.com/photo-1605212839358-1f09b0d5e8b1?w=400",
            description: "Bio-pesticide for larval control",
            dosage: "1-2g per liter water",
            price: "Rs 300-600 per kg",
            availability: "Agricultural centers",
            videoId: "jJy2kO_8Y9M"
        }
    ]
};

// Initialize Pesticide Guide
function initPesticideGuide() {
    loadPlantCards();
    loadPesticideCards();
    initSearchAndFilter();
}

// Load plant cards
function loadPlantCards() {
    const container = document.getElementById('plant-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    plantGuideData.plants.forEach(plant => {
        const card = createPlantGuideCard(plant);
        container.appendChild(card);
    });
}

// Create plant guide card
function createPlantGuideCard(plant) {
    const card = document.createElement('div');
    card.className = `plant-guide-card ${plant.category}`;
    card.innerHTML = `
        <div class="plant-header">
            <div class="plant-image">
                <img src="${plant.image}" alt="${plant.name}" loading="lazy">
                <div class="plant-category">${plant.category}</div>
            </div>
            <div class="plant-info">
                <h3>${plant.name}</h3>
                <p class="scientific-name">${plant.scientificName}</p>
                <p class="plant-description">${plant.description}</p>
                <div class="plant-meta">
                    <span class="difficulty ${plant.difficulty.toLowerCase()}">${plant.difficulty}</span>
                    <span class="harvest-time"><i class="fas fa-clock"></i> ${plant.harvestTime}</span>
                </div>
            </div>
        </div>
        
        <div class="plant-requirements">
            <div class="requirement-item">
                <i class="fas fa-calendar"></i>
                <div>
                    <strong>Growing Season:</strong>
                    <span>${plant.growingSeason}</span>
                </div>
            </div>
            <div class="requirement-item">
                <i class="fas fa-mountain"></i>
                <div>
                    <strong>Soil Type:</strong>
                    <span>${plant.soilType}</span>
                </div>
            </div>
            <div class="requirement-item">
                <i class="fas fa-tint"></i>
                <div>
                    <strong>Water Needs:</strong>
                    <span>${plant.waterNeeds}</span>
                </div>
            </div>
        </div>
        
        <div class="pest-section">
            <h4>Common Pests & Solutions</h4>
            <div class="pests-list">
                ${plant.commonPests.map(pest => `
                    <div class="pest-item">
                        <span class="pest-name">${pest}</span>
                        <div class="pest-solutions">
                            ${plant.pesticides.filter(p => (p.target && p.target.toLowerCase().includes(pest.toLowerCase().split(' ')[0])) || p.type === 'Organic').map(pesticide => `
                                <span class="pesticide-tag">${pesticide.name}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="plant-actions">
            <button class="action-btn primary" onclick="openVideo('${plant.videoId}', '${plant.name}')">
                <i class="fas fa-video"></i> Watch Tutorial
            </button>
            <button class="action-btn secondary" onclick="viewPesticideDetails('${plant.name}')">
                <i class="fas fa-spray-can"></i> Pesticide Guide
            </button>
        </div>
    `;
    return card;
}

// Load pesticide cards
function loadPesticideCards() {
    const container = document.getElementById('pesticide-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    plantGuideData.pesticides.forEach(pesticide => {
        const card = createPesticideCard(pesticide);
        container.appendChild(card);
    });
}

// Create pesticide card
function createPesticideCard(pesticide) {
    const card = document.createElement('div');
    card.className = 'pesticide-card';
    card.innerHTML = `
        <div class="pesticide-header">
            <div class="pesticide-image">
                <img src="${pesticide.image}" alt="${pesticide.name}" loading="lazy">
                <div class="pesticide-type ${pesticide.type.toLowerCase()}">${pesticide.type}</div>
            </div>
            <div class="pesticide-info">
                <h3>${pesticide.name}</h3>
                <p class="pesticide-description">${pesticide.description}</p>
                <div class="pesticide-target">
                    <strong>Target:</strong> ${pesticide.target}
                </div>
            </div>
        </div>
        
        <div class="pesticide-details">
            <div class="detail-row">
                <div class="detail-item">
                    <i class="fas fa-flask"></i>
                    <div>
                        <strong>Dosage:</strong>
                        <span>${pesticide.dosage}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-rupee-sign"></i>
                    <div>
                        <strong>Price:</strong>
                        <span>${pesticide.price}</span>
                    </div>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item">
                    <i class="fas fa-store"></i>
                    <div>
                        <strong>Availability:</strong>
                        <span>${pesticide.availability}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="pesticide-actions">
            <button class="action-btn primary" onclick="openVideo('${pesticide.videoId}', '${pesticide.name}')">
                <i class="fas fa-play"></i> How to Use
            </button>
            <button class="action-btn secondary" onclick="buyPesticide('${pesticide.name}')">
                <i class="fas fa-shopping-cart"></i> Buy Guide
            </button>
        </div>
    `;
    return card;
}

// Initialize search and filter functionality
function initSearchAndFilter() {
    const searchInput = document.getElementById('plant-search');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterPlants, 300));
    }
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterPlants();
        });
    });
}

// Filter plants based on search and category
function filterPlants() {
    const searchInput = document.getElementById('plant-search');
    const activeFilter = document.querySelector('.filter-tab.active').dataset.filter;
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    const plantCards = document.querySelectorAll('.plant-guide-card');
    
    plantCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const category = card.className.includes('featured') ? 'featured' : 
                        card.className.includes('vegetables') ? 'vegetables' :
                        card.className.includes('fruits') ? 'fruits' :
                        card.className.includes('grains') ? 'grains' : 'all';
        
        const matchesSearch = name.includes(searchTerm) || 
                           card.textContent.toLowerCase().includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || category === activeFilter;
        
        card.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
    });
}

// Video player functions
function openVideo(videoId, title) {
    // Create modal for YouTube video with error handling
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-modal-header">
                <h3>${title} - Tutorial Video</h3>
                <button class="close-modal" onclick="closeVideoModal()">&times;</button>
            </div>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
                        frameborder="0" 
                        allowfullscreen
                        onload="hideVideoError()"
                        onerror="showVideoError()">
                </iframe>
                <div id="video-error" class="video-error" style="display: none;">
                    <div class="error-content">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h4>Video Loading Issue</h4>
                        <p>The video couldn't load due to network restrictions.</p>
                        <div class="video-alternatives">
                            <p><strong>Alternative:</strong> Search for "${title} tutorial" on YouTube</p>
                            <button onclick="window.open('https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' tutorial')}', '_blank')" class="search-youtube-btn">
                                <i class="fab fa-youtube"></i> Search on YouTube
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Add error handling timeout
    setTimeout(() => {
        const iframe = modal.querySelector('iframe');
        const errorDiv = modal.querySelector('#video-error');
        if (iframe && errorDiv && iframe.style.display !== 'none') {
            showVideoError();
        }
    }, 5000);
}

function showVideoError() {
    const iframe = document.querySelector('.video-modal iframe');
    const errorDiv = document.querySelector('#video-error');
    if (iframe && errorDiv) {
        iframe.style.display = 'none';
        errorDiv.style.display = 'block';
    }
}

function hideVideoError() {
    const iframe = document.querySelector('.video-modal iframe');
    const errorDiv = document.querySelector('#video-error');
    if (iframe && errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        modal.remove();
    }
}

// Detail view functions
function viewPlantDetails(plantName) {
    const plant = plantGuideData.plants.find(p => p.name === plantName);
    if (!plant) return;
    
    showNotification(`Viewing detailed guide for ${plantName}`, 'info');
    // You can expand this to show a detailed modal
}

function viewPesticideDetails(plantName) {
    const plant = plantGuideData.plants.find(p => p.name === plantName);
    if (!plant) return;
    
    showNotification(`Loading pesticide recommendations for ${plantName}`, 'info');
    // You can expand this to show pesticide details
}

function buyPesticide(pesticideName) {
    showNotification(`Purchase guide for ${pesticideName}`, 'info');
    // You can expand this to show purchase options
}

// Performance optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handlers
const optimizedScroll = debounce(() => {
    // Add any scroll-based optimizations here
}, 100);

window.addEventListener('scroll', optimizedScroll);
