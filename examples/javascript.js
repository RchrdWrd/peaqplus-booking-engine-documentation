/**
 * Booking Engine API - Simple JavaScript Example
 * 
 * Simple example showing how to call the Booking Engine API endpoints
 */

// Configuration
const API_BASE_URL = 'https://your-domain.com/api';
const API_TOKEN = 'YOUR_THIRD_PARTY_TOKEN'; // Replace with your actual token

/**
 * Test the booking engine search (no data saved)
 * @param {string} dateFrom - Check-in date (YYYY-MM-DD)
 * @param {string} dateTo - Check-out date (YYYY-MM-DD)
 */
async function testBookingSearch(dateFrom, dateTo) {
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
            console.log('Test completed successfully:', data.data);
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
 * Record a real booking engine search (saves data to database)
 * @param {string} dateFrom - Check-in date (YYYY-MM-DD)
 * @param {string} dateTo - Check-out date (YYYY-MM-DD)
 */
async function recordBookingSearch(dateFrom, dateTo) {
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
            console.log('Search recorded successfully:', data.data);
            console.log(`Days recorded: ${data.data.days_recorded}`);
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

// Usage examples:

// First test the API call
testBookingSearch('2025-06-01', '2025-06-05');

// Then record the actual search
recordBookingSearch('2025-06-01', '2025-06-05');
