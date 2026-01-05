// review.js - Store and Fetch User Reviews

/**
 * Initialize reviews with sample data if not exists
 */
function initializeReviews() {
    if (!localStorage.getItem('travelReviews')) {
        const sampleReviews = [
            {
                place: 'Delhi',
                rating: 4,
                text: 'Clean and well-maintained monuments. Safe for tourists but can be crowded during peak hours.',
                user: 'Demo User',
                date: new Date().toISOString()
            },
            {
                place: 'Goa',
                rating: 5,
                text: 'Beautiful beaches, very safe and friendly locals. Great food and nightlife!',
                user: 'Demo User',
                date: new Date().toISOString()
            },
            {
                place: 'Mumbai',
                rating: 3,
                text: 'Crowded but exciting city. Be careful with belongings in busy areas.',
                user: 'Demo User',
                date: new Date().toISOString()
            },
            {
                place: 'Jaipur',
                rating: 5,
                text: 'Amazing historical sites! Clean and safe. Locals are very friendly and helpful.',
                user: 'Demo User',
                date: new Date().toISOString()
            },
            {
                place: 'Agra',
                rating: 4,
                text: 'Taj Mahal is stunning! Can be crowded but worth visiting. Guides are helpful.',
                user: 'Demo User',
                date: new Date().toISOString()
            },
            {
                place: 'Kerala',
                rating: 5,
                text: 'Peaceful and beautiful backwaters. Very clean and safe. Excellent food!',
                user: 'Demo User',
                date: new Date().toISOString()
            },
            {
                place: 'Bangalore',
                rating: 4,
                text: 'Modern city with great weather. Safe but traffic can be bad. Nice cafes and parks.',
                user: 'Demo User',
                date: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('travelReviews', JSON.stringify(sampleReviews));
    }
}

/**
 * Add a new review
 * @param {string} place - Place name
 * @param {number} rating - Rating (1-5)
 * @param {string} text - Review text
 * @param {string} user - User name
 */
function addReview(place, rating, text, user) {
    initializeReviews();
    
    const reviews = JSON.parse(localStorage.getItem('travelReviews'));
    
    const newReview = {
        place: place,
        rating: rating,
        text: text,
        user: user,
        date: new Date().toISOString()
    };
    
    reviews.push(newReview);
    localStorage.setItem('travelReviews', JSON.stringify(reviews));
    
    return newReview;
}

/**
 * Get all reviews for a specific place
 * @param {string} place - Place name
 * @returns {Array} Array of reviews
 */
function getReviewsByPlace(place) {
    initializeReviews();
    
    const reviews = JSON.parse(localStorage.getItem('travelReviews'));
    
    // Case-insensitive search
    return reviews.filter(review => 
        review.place.toLowerCase() === place.toLowerCase()
    );
}

/**
 * Get all reviews
 * @returns {Array} Array of all reviews
 */
function getAllReviews() {
    initializeReviews();
    return JSON.parse(localStorage.getItem('travelReviews'));
}

/**
 * Get average rating for a place
 * @param {string} place - Place name
 * @returns {number} Average rating
 */
function getAverageRating(place) {
    const reviews = getReviewsByPlace(place);
    
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
}

/**
 * Delete a review (admin feature - optional)
 * @param {number} index - Review index
 */
function deleteReview(index) {
    const reviews = JSON.parse(localStorage.getItem('travelReviews'));
    reviews.splice(index, 1);
    localStorage.setItem('travelReviews', JSON.stringify(reviews));
}

/**
 * Clear all reviews (reset feature - optional)
 */
function clearAllReviews() {
    localStorage.removeItem('travelReviews');
    initializeReviews();
}

// Initialize on load
initializeReviews();