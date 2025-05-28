/**
 * Booking Engine API - JavaScript Examples
 * 
 * Examples showing how to call the Booking Engine API endpoints
 * Supports both single search objects and arrays of multiple searches
 */

// Configuration
const API_CONFIG = {
    PRODUCTION: 'https://app.peaqplus.com/api/v1',
    DEVELOPMENT: 'https://beta.peaqplus.com/api/v1'
};

const API_TOKEN = process.env.PEAQPLUS_BOOKING_ENGINE_TOKEN; // Token from environment variable
const ENVIRONMENT = 'PRODUCTION'; // Change to 'DEVELOPMENT' for testing
const API_BASE_URL = API_CONFIG[ENVIRONMENT];

/**
 * Test the booking engine search (no data saved) - Single Search
 * @param {string} dateFrom - Check-in date (YYYY-MM-DD)
 * @param {string} dateTo - Check-out date (YYYY-MM-DD)
 */
async function testSingleBookingSearch(dateFrom, dateTo) {
    try {
        const response = await fetch(`${API_BASE_URL}/test/booking-engine-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify({
                date_from: dateFrom,
                date_to: dateTo
            })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Single search test completed successfully:', data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log('Would insert records:', data.data.would_insert);
        } else {
            console.error('Test failed:', data.message);
            if (data.errors) {
                console.error('Validation errors:', data.errors);
            }
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

/**
 * Test the booking engine search (no data saved) - Multiple Searches
 * @param {Array<{date_from: string, date_to: string}>} searches - Array of search objects
 */
async function testMultipleBookingSearches(searches) {
    try {
        const response = await fetch(`${API_BASE_URL}/test/booking-engine-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify(searches)
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Multiple searches test completed successfully:', data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log('Processed ranges:', data.data.processed_ranges);
            console.log('Would insert records:', data.data.would_insert);
        } else {
            console.error('Test failed:', data.message);
            if (data.errors) {
                console.error('Validation errors:', data.errors);
            }
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

/**
 * Record a real booking engine search (saves data to database) - Single Search
 * @param {string} dateFrom - Check-in date (YYYY-MM-DD)
 * @param {string} dateTo - Check-out date (YYYY-MM-DD)
 */
async function recordSingleBookingSearch(dateFrom, dateTo) {
    try {
        const response = await fetch(`${API_BASE_URL}/booking-engine-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify({
                date_from: dateFrom,
                date_to: dateTo
            })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Single search recorded successfully:', data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log('Processed ranges:', data.data.processed_ranges);
        } else {
            console.error('Recording failed:', data.message);
            if (data.errors) {
                console.error('Validation errors:', data.errors);
            }
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

/**
 * Record real booking engine searches (saves data to database) - Multiple Searches
 * @param {Array<{date_from: string, date_to: string}>} searches - Array of search objects
 */
async function recordMultipleBookingSearches(searches) {
    try {
        const response = await fetch(`${API_BASE_URL}/booking-engine-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify(searches)
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Multiple searches recorded successfully:', data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log('Processed ranges:', data.data.processed_ranges);
        } else {
            console.error('Recording failed:', data.message);
            if (data.errors) {
                console.error('Validation errors:', data.errors);
            }
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

/**
 * Generic function to handle both single and multiple searches
 * @param {Object|Array} searchData - Single search object or array of search objects
 * @param {boolean} testMode - Whether to use test endpoint (true) or real endpoint (false)
 */
async function handleBookingSearch(searchData, testMode = false) {
    const endpoint = testMode ? '/test/booking-engine-search' : '/booking-engine-search';
    const isMultiple = Array.isArray(searchData);
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify(searchData)
        });

        const data = await response.json();
        
        if (data.success) {
            const action = testMode ? 'tested' : 'recorded';
            const type = isMultiple ? 'multiple searches' : 'single search';
            console.log(`${type} ${action} successfully:`, data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log('Processed ranges:', data.data.processed_ranges);
            
            if (testMode) {
                console.log('Would insert records:', data.data.would_insert);
            }
        } else {
            console.error(`Operation failed:`, data.message);
            if (data.errors) {
                console.error('Validation errors:', data.errors);
            }
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

// Usage examples:

console.log('=== SINGLE SEARCH EXAMPLES ===');

// Test single search
testSingleBookingSearch('2025-06-01', '2025-06-05');

// Record single search
recordSingleBookingSearch('2025-06-01', '2025-06-05');

console.log('\n=== MULTIPLE SEARCHES EXAMPLES ===');

// Test multiple searches
const testSearches = [
    { date_from: '2025-06-01', date_to: '2025-06-05' },
    { date_from: '2025-07-15', date_to: '2025-07-20' },
    { date_from: '2025-08-10', date_to: '2025-08-12' }
];

testMultipleBookingSearches(testSearches);

// Record multiple searches
const realSearches = [
    { date_from: '2025-06-01', date_to: '2025-06-05' },
    { date_from: '2025-07-15', date_to: '2025-07-20' }
];

recordMultipleBookingSearches(realSearches);

console.log('\n=== GENERIC FUNCTION EXAMPLES ===');

// Using the generic function for single search (test mode)
handleBookingSearch({ date_from: '2025-06-01', date_to: '2025-06-05' }, true);

// Using the generic function for multiple searches (real mode)
handleBookingSearch([
    { date_from: '2025-06-01', date_to: '2025-06-05' },
    { date_from: '2025-07-15', date_to: '2025-07-20' }
], false);

console.log('\n=== BULK PROCESSING RECOMMENDATION ===');

// For better performance, always prefer array format when recording multiple searches
const bulkSearches = [
    { date_from: '2025-01-15', date_to: '2025-01-18' },
    { date_from: '2025-02-20', date_to: '2025-02-25' },
    { date_from: '2025-03-10', date_to: '2025-03-15' },
    { date_from: '2025-04-05', date_to: '2025-04-10' },
    { date_from: '2025-05-12', date_to: '2025-05-16' }
];

console.log('Recording 5 searches in a single API call for optimal performance:');
recordMultipleBookingSearches(bulkSearches);
