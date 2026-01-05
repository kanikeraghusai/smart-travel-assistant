// chat.js - AI Chatbot Logic

/**
 * Send chat message and get AI response
 */
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Display user message
    addMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Get AI response
    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'bot');
    }, 500);
}

/**
 * Add message to chat
 */
function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Generate AI response based on user input
 */
function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Get current search data for context
    const searchData = JSON.parse(localStorage.getItem('searchResult'));
    const placeName = searchData ? searchData.query : 'this location';
    
    // Safety questions
    if (msg.includes('safe') || msg.includes('safety') || msg.includes('secure')) {
        const reviews = getReviewsByPlace(placeName);
        const safeReviews = reviews.filter(r => r.text.toLowerCase().includes('safe'));
        
        if (safeReviews.length > 0) {
            return `Based on ${safeReviews.length} user review(s), ${placeName} is generally considered safe. However, always stay alert, avoid isolated areas at night, and follow local guidelines. Keep your belongings secure and be aware of your surroundings.`;
        }
        return `While we don't have specific safety reviews for ${placeName}, general travel safety tips apply: stay in well-lit areas, keep valuables secure, inform someone of your plans, and follow local advice. Check recent travel advisories before your trip.`;
    }
    
    // Cleanliness questions
    if (msg.includes('clean') || msg.includes('hygiene') || msg.includes('sanitation')) {
        const reviews = getReviewsByPlace(placeName);
        const cleanReviews = reviews.filter(r => r.text.toLowerCase().includes('clean'));
        
        if (cleanReviews.length > 0) {
            return `${cleanReviews.length} user(s) have mentioned cleanliness. Most users report good hygiene standards at ${placeName}. For the latest conditions, check recent reviews as standards can vary by season.`;
        }
        return `Cleanliness standards at ${placeName} can vary. We recommend checking recent reviews and photos. Carry hand sanitizer and maintain personal hygiene practices while traveling.`;
    }
    
    // Crowd questions
    if (msg.includes('crowd') || msg.includes('busy') || msg.includes('rush') || msg.includes('people')) {
        return `Crowd levels at ${placeName} typically vary by season and time. Peak tourist seasons (holidays, weekends, summer vacations) are usually busier. For a more peaceful experience, consider visiting during off-peak hours (early morning or weekdays) or during the shoulder season.`;
    }
    
    // Price/Cost questions
    if (msg.includes('price') || msg.includes('cost') || msg.includes('expensive') || msg.includes('budget') || msg.includes('money')) {
        return `Prices at ${placeName} can vary depending on the season, type of accommodation, and activities you choose. Budget travelers should expect to spend less during off-peak seasons. Check current rates on booking platforms, and consider local transportation options to save money. Street food is often cheaper than restaurants.`;
    }
    
    // Weather questions
    if (msg.includes('weather') || msg.includes('temperature') || msg.includes('rain') || msg.includes('climate') || msg.includes('season')) {
        return `Weather conditions at ${placeName} vary by season. India has diverse climate zones - check specific weather forecasts for your travel dates. Generally, October to March is pleasant in most regions, while monsoon season (June-September) brings heavy rainfall to many areas. Pack accordingly!`;
    }
    
    // Food questions
    if (msg.includes('food') || msg.includes('eat') || msg.includes('restaurant') || msg.includes('cuisine')) {
        return `${placeName} likely offers diverse food options. Try local specialties for an authentic experience! Always choose busy, well-reviewed restaurants for food safety. Street food can be delicious but choose vendors with good hygiene. Carry bottled water and avoid uncooked foods if you have a sensitive stomach.`;
    }
    
    // Best time to visit
    if (msg.includes('when') || msg.includes('best time') || msg.includes('visit')) {
        return `The best time to visit ${placeName} depends on your preferences. For pleasant weather and lower crowds, consider visiting during the off-peak season. Check local festivals and events that might interest you. Weather-wise, October through March is generally comfortable in most Indian destinations.`;
    }
    
    // Transportation
    if (msg.includes('transport') || msg.includes('travel') || msg.includes('reach') || msg.includes('how to get')) {
        return `${placeName} can typically be reached by various means of transportation. Check for the nearest airport, railway station, or bus terminal. Local transportation options include taxis, auto-rickshaws, ride-sharing apps, and public buses. Pre-book transportation when possible and use official/licensed services for safety.`;
    }
    
    // Accommodation
    if (msg.includes('hotel') || msg.includes('stay') || msg.includes('accommodation') || msg.includes('lodge')) {
        return `For accommodation in ${placeName}, book in advance during peak season. Options range from budget hostels to luxury hotels. Check reviews on booking platforms, verify location proximity to attractions, and confirm amenities. Consider homestays for an authentic local experience.`;
    }
    
    // Things to do/attractions
    if (msg.includes('do') || msg.includes('see') || msg.includes('attraction') || msg.includes('activity') || msg.includes('visit')) {
        return `${placeName} offers various attractions and activities. Research popular sites beforehand, but also leave time for spontaneous exploration. Hire local guides for historical sites to learn more. Book popular attractions in advance if possible. Check opening hours and any entry requirements.`;
    }
    
    // Default response
    return `I can help you with information about ${placeName} including safety, cleanliness, crowd levels, prices, weather, food, best time to visit, transportation, and things to do. What specific aspect would you like to know more about?`;
}

// Initialize chat (load previous messages if any)
window.addEventListener('DOMContentLoaded', function() {
    const searchData = JSON.parse(localStorage.getItem('searchResult'));
    if (searchData) {
        // You can add an initial greeting message if desired
    }
});