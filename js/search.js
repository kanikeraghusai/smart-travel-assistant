// search.js - Handle Place and Route Search

// Make functions globally accessible
window.fetchPlace = fetchPlace;
window.fetchWiki = fetchWiki;
window.generateScore = generateScore;
window.getReviewsByPlace = getReviewsByPlace;

// Place Search Form Handler
const placeSearchForm = document.getElementById('placeSearchForm');
if (placeSearchForm) {
    placeSearchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const query = document.getElementById('placeQuery').value.trim();
        if (!query) {
            alert('Please enter a place name');
            return;
        }
        
        // Show loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        try {
            // Fetch place data from API
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},India&format=json&limit=1`,
                {
                    headers: {
                        'User-Agent': 'SmartTravelAssistant/1.0'
                    }
                }
            );
            
            const placeData = await response.json();
            
            if (!placeData || placeData.length === 0) {
                alert('Place not found. Please try another search (e.g., Delhi, Goa, Mumbai)');
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                return;
            }
            
            const place = placeData[0];
            
            // Fetch Wikipedia description
            let wikiDescription = 'No description available.';
            try {
                const wikiResponse = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
                );
                const wikiData = await wikiResponse.json();
                if (wikiData.extract) {
                    wikiDescription = wikiData.extract;
                }
            } catch (wikiError) {
                console.log('Wikipedia data not available');
            }
            
            // Get reviews and calculate AI score
            const reviews = getReviewsByPlace(query);
            const aiScore = calculateAIScore(reviews);
            
            // Store search result
            const searchResult = {
                query: query,
                name: place.display_name,
                lat: place.lat,
                lon: place.lon,
                description: wikiDescription,
                aiScore: aiScore,
                type: 'place'
            };
            
            localStorage.setItem('searchResult', JSON.stringify(searchResult));
            
            // Redirect to results page
            window.location.href = 'result.html';
            
        } catch (error) {
            console.error('Search error:', error);
            alert('An error occurred during search. Please try again.');
            if (loadingOverlay) loadingOverlay.style.display = 'none';
        }
    });
}

// Route Search Form Handler
const routeSearchForm = document.getElementById('routeSearchForm');
if (routeSearchForm) {
    routeSearchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const from = document.getElementById('routeFrom').value.trim();
        const to = document.getElementById('routeTo').value.trim();
        
        if (!from || !to) {
            alert('Please enter both locations');
            return;
        }
        
        // Show loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        try {
            // Fetch both places
            const fromResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(from)},India&format=json&limit=1`,
                { headers: { 'User-Agent': 'SmartTravelAssistant/1.0' } }
            );
            const fromData = await fromResponse.json();
            
            const toResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(to)},India&format=json&limit=1`,
                { headers: { 'User-Agent': 'SmartTravelAssistant/1.0' } }
            );
            const toData = await toResponse.json();
            
            if (!fromData || fromData.length === 0 || !toData || toData.length === 0) {
                alert('Could not find one or both locations. Please check spelling.');
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                return;
            }
            
            const fromPlace = fromData[0];
            const toPlace = toData[0];
            
            // Fetch destination description
            let wikiDescription = 'No description available.';
            try {
                const wikiResponse = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(to)}`
                );
                const wikiData = await wikiResponse.json();
                if (wikiData.extract) {
                    wikiDescription = wikiData.extract;
                }
            } catch (wikiError) {
                console.log('Wikipedia data not available');
            }
            
            // Calculate distance
            const distance = calculateDistance(
                parseFloat(fromPlace.lat),
                parseFloat(fromPlace.lon),
                parseFloat(toPlace.lat),
                parseFloat(toPlace.lon)
            );
            
            // Get reviews for destination
            const reviews = getReviewsByPlace(to);
            const aiScore = calculateAIScore(reviews);
            
            // Store search result
            const searchResult = {
                query: to,
                name: `Route: ${from} → ${to}`,
                lat: toPlace.lat,
                lon: toPlace.lon,
                description: `Distance: ${distance}\n\nAbout ${to}:\n${wikiDescription}`,
                aiScore: aiScore,
                type: 'route',
                from: from,
                to: to,
                distance: distance
            };
            
            localStorage.setItem('searchResult', JSON.stringify(searchResult));
            
            // Redirect to results page
            window.location.href = 'result.html';
            
        } catch (error) {
            console.error('Route search error:', error);
            alert('An error occurred during route search. Please try again.');
            if (loadingOverlay) loadingOverlay.style.display = 'none';
        }
    });
}

/**
 * Calculate AI score from reviews
 */
function calculateAIScore(reviews) {
    if (!reviews || reviews.length === 0) {
        return 60; // Default neutral score
    }
    
    let score = 50; // Base score
    let totalRating = 0;
    
    reviews.forEach(review => {
        // Rating-based scoring
        totalRating += review.rating;
        
        if (review.rating >= 4) score += 10;
        else if (review.rating <= 2) score -= 10;
        
        // Sentiment analysis on review text
        const text = review.text.toLowerCase();
        
        // Positive keywords
        if (text.includes('safe')) score += 5;
        if (text.includes('clean')) score += 5;
        if (text.includes('beautiful')) score += 5;
        if (text.includes('amazing')) score += 5;
        if (text.includes('wonderful')) score += 5;
        if (text.includes('excellent')) score += 5;
        if (text.includes('friendly')) score += 5;
        if (text.includes('peaceful')) score += 5;
        if (text.includes('great')) score += 4;
        if (text.includes('good')) score += 3;
        
        // Negative keywords
        if (text.includes('unsafe')) score -= 10;
        if (text.includes('dangerous')) score -= 10;
        if (text.includes('dirty')) score -= 8;
        if (text.includes('crowded')) score -= 5;
        if (text.includes('expensive')) score -= 3;
        if (text.includes('bad')) score -= 5;
        if (text.includes('terrible')) score -= 8;
        if (text.includes('avoid')) score -= 10;
    });
    
    // Average rating adjustment
    const avgRating = totalRating / reviews.length;
    score += (avgRating - 3) * 5;
    
    // Normalize to 0-100
    score = Math.min(Math.max(score, 0), 100);
    
    return Math.round(score);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return `${Math.round(distance)} km`;
}