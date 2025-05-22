/**
 * Booking Engine API - TypeScript Example
 * 
 * TypeScript example showing how to call the Booking Engine API endpoints
 * with proper type definitions and error handling
 */

// Type definitions for API responses
interface BookingSearchData {
    days_recorded: number;
    subhotel_id: number;
    date_from: string;
    date_to: string;
}

interface TestSearchData extends BookingSearchData {
    test_mode: boolean;
    would_insert: Array<{
        date: string;
        subhotel_id: number;
        created_at: string;
    }>;
}

interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
    error?: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Configuration
const API_BASE_URL: string = 'https://peaqplus.com/api';
const API_TOKEN: string = process.env.PEAQPLUS_BOOKING_ENGINE_TOKEN!; // Token from environment variable

/**
 * Test the booking engine search (no data saved)
 * @param dateFrom - Check-in date (YYYY-MM-DD)
 * @param dateTo - Check-out date (YYYY-MM-DD)
 * @returns Promise with test search response
 */
async function testBookingSearch(
    dateFrom: string, 
    dateTo: string
): Promise<ApiResponse<TestSearchData>> {
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

        const data: ApiResponse<TestSearchData> = await response.json();

        if (data.success) {
            console.log('Test completed successfully:', data.data);
            console.log('Would insert records:', data.data.would_insert);
        } else {
            console.error('Test failed:', data.message);
            if (data.errors) {
                console.error('Validation errors:', data.errors);
            }
        }

        return data;
    } catch (error) {
        console.error('Network error:', error);
        throw error;
    }
}

/**
 * Record a real booking engine search (saves data to database)
 * @param dateFrom - Check-in date (YYYY-MM-DD)
 * @param dateTo - Check-out date (YYYY-MM-DD)
 * @returns Promise with booking search response
 */
async function recordBookingSearch(
    dateFrom: string, 
    dateTo: string
): Promise<ApiResponse<BookingSearchData>> {
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

        const data: ApiResponse<BookingSearchData> = await response.json();

        if (data.success) {
            console.log('Search recorded successfully:', data.data);
            console.log(`Days recorded: ${data.data.days_recorded}`);
        } else {
            console.error('Recording failed:', data.message);
            if (data.errors) {
                console.error('Validation errors:', data.errors);
            }
        }

        return data;
    } catch (error) {
        console.error('Network error:', error);
        throw error;
    }
}

/**
 * Type guard to check if response is successful
 * @param response - API response to check
 * @returns True if response is successful
 */
function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
    return response.success === true;
}

/**
 * Example usage with proper error handling and type checking
 */
async function exampleUsage(): Promise<void> {
    const dateFrom = '2025-06-01';
    const dateTo = '2025-06-05';

    try {
        // First test the API call
        const testResult = await testBookingSearch(dateFrom, dateTo);
        
        if (isSuccessResponse(testResult)) {
            console.log(`Test successful! Would record ${testResult.data.days_recorded} days`);
            
            // Then record the actual search
            const recordResult = await recordBookingSearch(dateFrom, dateTo);
            
            if (isSuccessResponse(recordResult)) {
                console.log(`Successfully recorded search for subhotel ${recordResult.data.subhotel_id}`);
            } else {
                console.error('Failed to record search:', recordResult.message);
            }
        } else {
            console.error('Test failed:', testResult.message);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Usage examples:
testBookingSearch('2025-06-01', '2025-06-05');
recordBookingSearch('2025-06-01', '2025-06-05');

// Advanced usage with error handling
exampleUsage();
