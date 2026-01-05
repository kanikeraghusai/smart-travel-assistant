// aiLogic.js - AI Recommendation Logic

/**
 * Generate AI score based on user reviews
 * This is the core AI logic that analyzes sentiment
 * @param {Array} reviews - Array of review objects
 * @returns {number} Score from 0-100
 */
function generateScore(reviews) {
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
        const positiveKeywords = {
            'safe': 5,
            'clean': 5,
            'beautiful': 5,
            'amazing': 5,
            'wonderful': 5,
            'excellent': 5,
            'friendly': 5,
            'peaceful': 5,
            'stunning': 5,
            'awesome': 5,
            'great': 4,
            'good': 3,
            'nice': 3,
            'pleasant': 3
        };
        
        // Negative keywords
        const negativeKeywords = {
            'unsafe': -10,
            'dangerous': -10,
            'dirty': -8,
            'crowded': -5,
            'expensive': -3,
            'bad': -5,
            'poor': -5,
            'terrible': -8,
            'awful': -8,
            'avoid': -10,
            'disappointed': -6,
            'worst': -10
        };
        
        // Check positive keywords
        Object.keys(positiveKeywords).forEach(keyword => {
            if (text.includes(keyword)) {
                score += positiveKeywords[keyword];
            }
        });
        
        // Check negative keywords
        Object.keys(negativeKeywords).forEach(keyword => {
            if (text.includes(keyword)) {
                score += negativeKeywords[keyword]; // Already negative
            }
        });
    });
    
    // Average rating boost
    const avgRating = totalRating / reviews.length;
    score += (avgRating - 3) * 5; // Adjust based on average rating
    
    // Normalize score to 0-100 range
    score = Math.min(Math.max(score, 0), 100);
    
    return Math.round(score);
}

/**
 * Extract common points from reviews
 * @param {Array} reviews - Array of review objects
 * @returns {Object} Common positive and negative points
 */
function extractCommonPoints(reviews) {
    if (!reviews || reviews.length === 0) {
        return { positive: [], negative: [] };
    }
    
    const positive = [];
    const negative = [];
    
    const positiveKeywords = ['safe', 'clean', 'beautiful', 'friendly', 'peaceful', 'amazing', 'excellent'];
    const negativeKeywords = ['unsafe', 'dirty', 'crowded', 'expensive', 'bad', 'dangerous'];
    
    reviews.forEach(review => {
        const text = review.text.toLowerCase();
        
        positiveKeywords.forEach(keyword => {
            if (text.includes(keyword) && !positive.includes(keyword)) {
                positive.push(keyword);
            }
        });
        
        negativeKeywords.forEach(keyword => {
            if (text.includes(keyword) && !negative.includes(keyword)) {
                negative.push(keyword);
            }
        });
    });
    
    return { positive, negative };
}

/**
 * Get recommendation text based on score
 * @param {number} score - AI score (0-100)
 * @returns {string} Recommendation message
 */
function getRecommendation(score) {
    if (score >= 80) {
        return "Highly Recommended - Excellent destination!";
    } else if (score >= 70) {
        return "Recommended - Great place to visit!";
    } else if (score >= 50) {
        return "Moderately Recommended - Check reviews carefully";
    } else if (score >= 30) {
        return "Consider Alternatives - Mixed reviews";
    } else {
        return "Not Recommended - Consider other destinations";
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateScore, extractCommonPoints, getRecommendation };
}