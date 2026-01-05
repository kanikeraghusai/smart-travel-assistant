// api.js - All Real-Time API Calls

/**
 * Fetch place information from OpenStreetMap Nominatim API
 * @param {string} place - Place name to search
 * @returns {Promise<Object>} Place data
 */
async function fetchPlace(place) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)},India&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'SmartTravelAssistant/1.0'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Place not found');
        }
        
        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('Error fetching place:', error);
        return null;
    }
}

/**
 * Fetch place description from Wikipedia API
 * @param {string} place - Place name
 * @returns {Promise<Object>} Wikipedia summary data
 */
async function fetchWiki(place) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place)}`
        );
        
        if (!response.ok) {
            return { extract: 'No description available for this location.' };
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        return { extract: 'No description available for this location.' };
    }
}

/**
 * Fetch route information (simplified - for real routes use OpenRouteService)
 * Note: For full route implementation, you need OpenRouteService API key
 * Visit: https://openrouteservice.org
 * @param {string} from - Starting location
 * @param {string} to - Destination location
 * @returns {Promise<Object>} Route data
 */
async function fetchRoute(from, to) {
    try {
        // Fetch both locations
        const fromPlace = await fetchPlace(from);
        const toPlace = await fetchPlace(to);
        
        if (!fromPlace || !toPlace) {
            throw new Error('Could not find locations');
        }
        
        // For college project: simplified route info
        // In production: Use OpenRouteService API with your API key
        return {
            from: fromPlace,
            to: toPlace,
            distance: calculateDistance(
                fromPlace.lat, fromPlace.lon,
                toPlace.lat, toPlace.lon
            ),
            duration: 'Estimated based on distance'
        };
    } catch (error) {
        console.error('Error fetching route:', error);
        return null;
    }
}

/**
 * Calculate approximate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {string} Distance in kilometers
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

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchPlace, fetchWiki, fetchRoute };
}