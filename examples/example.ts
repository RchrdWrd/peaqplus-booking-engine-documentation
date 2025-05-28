/**
 * Booking Engine API - TypeScript Examples
 * 
 * TypeScript examples showing how to call the Booking Engine API endpoints
 * Supports both single search objects and arrays of multiple searches
 * with proper type definitions and error handling
 */

// Type definitions for search objects
interface SearchObject {
    date_from: string;
    date_to: string;
}

// Type definitions for processed ranges
interface ProcessedRange {
    days_recorded: number;
    date_from: string;
    date_to: string;
}

// Type definitions for records that would be inserted
interface InsertRecord {
    date: string;
    subhotel_id: number;
    created_at: string;
}

// Type definitions for API responses
interface BookingSearchData {
    total_days_recorded: number;
    subhotel_id: number;
    processed_ranges: ProcessedRange[];
}

interface TestSearchData extends BookingSearchData {
    test_mode: boolean;
    would_insert: InsertRecord[];
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

// Environment configuration
interface ApiConfig {
    PRODUCTION: string;
    DEVELOPMENT: string;
}

const API_CONFIG: ApiConfig = {
    PRODUCTION: 'https://app.peaqplus.com/api/v1',
    DEVELOPMENT: 'https://beta.peaqplus.com/api/v1'
};

const ENVIRONMENT: keyof ApiConfig = 'PRODUCTION'; // Change to 'DEVELOPMENT' for testing
const API_BASE_URL: string = API_CONFIG[ENVIRONMENT];
const API_TOKEN: string = process.env.PEAQPLUS_BOOKING_ENGINE_TOKEN!; // Token from environment variable

/**
 * Test single booking engine search (no data saved)
 * @param dateFrom - Check-in date (YYYY-MM-DD)
 * @param dateTo - Check-out date (YYYY-MM-DD)
 * @returns Promise with test search response
 */
async function testSingleBookingSearch(
    dateFrom: string, 
    dateTo: string
): Promise<ApiResponse<TestSearchData>> {
    try {
        const requestData: SearchObject = {
            date_from: dateFrom,
            date_to: dateTo
        };

        const response = await fetch(`${API_BASE_URL}/test/booking-engine-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify(requestData)
        });

        const data: ApiResponse<TestSearchData> = await response.json();

        if (data.success) {
            console.log('Single search test completed successfully:', data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log('Processed ranges:', data.data.processed_ranges);
            console.log('Would insert records:', data.data.would_insert);
        } else {
            console.error('Test failed:', data.message);
            handleValidationErrors(data);
        }

        return data;
    } catch (error) {
        console.error('Network error:', error);
        throw error;
    }
}

/**
 * Test multiple booking engine searches (no data saved)
 * @param searches - Array of search objects
 * @returns Promise with test search response
 */
async function testMultipleBookingSearches(
    searches: SearchObject[]
): Promise<ApiResponse<TestSearchData>> {
    try {
        const response = await fetch(`${API_BASE_URL}/test/booking-engine-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify(searches)
        });

        const data: ApiResponse<TestSearchData> = await response.json();

        if (data.success) {
            console.log('Multiple searches test completed successfully:', data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log(`Number of processed ranges: ${data.data.processed_ranges.length}`);
            
            data.data.processed_ranges.forEach((range, index) => {
                console.log(`Range ${index + 1}: ${range.date_from} to ${range.date_to} (${range.days_recorded} days)`);
            });
            
            console.log(`Would insert ${data.data.would_insert.length} total records`);
        } else {
            console.error('Test failed:', data.message);
            handleValidationErrors(data);
        }

        return data;
    } catch (error) {
        console.error('Network error:', error);
        throw error;
    }
}

/**
 * Record a single real booking engine search (saves data to database)
 * @param dateFrom - Check-in date (YYYY-MM-DD)
 * @param dateTo - Check-out date (YYYY-MM-DD)
 * @returns Promise with booking search response
 */
async function recordSingleBookingSearch(
    dateFrom: string, 
    dateTo: string
): Promise<ApiResponse<BookingSearchData>> {
    try {
        const requestData: SearchObject = {
            date_from: dateFrom,
            date_to: dateTo
        };

        const response = await fetch(`${API_BASE_URL}/booking-engine-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify(requestData)
        });

        const data: ApiResponse<BookingSearchData> = await response.json();

        if (data.success) {
            console.log('Single search recorded successfully:', data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log('Processed ranges:', data.data.processed_ranges);
        } else {
            console.error('Recording failed:', data.message);
            handleValidationErrors(data);
        }

        return data;
    } catch (error) {
        console.error('Network error:', error);
        throw error;
    }
}

/**
 * Record multiple real booking engine searches (saves data to database)
 * @param searches - Array of search objects
 * @returns Promise with booking search response
 */
async function recordMultipleBookingSearches(
    searches: SearchObject[]
): Promise<ApiResponse<BookingSearchData>> {
    try {
        const response = await fetch(`${API_BASE_URL}/booking-engine-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Third-Party-Token': API_TOKEN
            },
            body: JSON.stringify(searches)
        });

        const data: ApiResponse<BookingSearchData> = await response.json();

        if (data.success) {
            console.log('Multiple searches recorded successfully:', data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            console.log(`Number of processed ranges: ${data.data.processed_ranges.length}`);
            
            data.data.processed_ranges.forEach((range, index) => {
                console.log(`Range ${index + 1}: ${range.date_from} to ${range.date_to} (${range.days_recorded} days)`);
            });
        } else {
            console.error('Recording failed:', data.message);
            handleValidationErrors(data);
        }

        return data;
    } catch (error) {
        console.error('Network error:', error);
        throw error;
    }
}

/**
 * Generic function to handle both single and multiple searches
 * @param searchData - Single search object or array of search objects
 * @param testMode - Whether to use test endpoint (true) or real endpoint (false)
 * @returns Promise with API response
 */
async function handleBookingSearch<T extends TestSearchData | BookingSearchData>(
    searchData: SearchObject | SearchObject[],
    testMode: boolean = false
): Promise<ApiResponse<T>> {
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

        const data: ApiResponse<T> = await response.json();

        if (data.success) {
            const action = testMode ? 'tested' : 'recorded';
            const type = isMultiple ? 'multiple searches' : 'single search';
            
            console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} ${action} successfully:`, data.data);
            console.log(`Total days recorded: ${data.data.total_days_recorded}`);
            
            if (isMultiple) {
                console.log(`Number of processed ranges: ${data.data.processed_ranges.length}`);
            }
            
            data.data.processed_ranges.forEach((range, index) => {
                if (isMultiple) {
                    console.log(`Range ${index + 1}: `, end='');
                } else {
                    console.log('Range: ', end='');
                }
                console.log(`${range.date_from} to ${range.date_to} (${range.days_recorded} days)`);
            });
            
            if (testMode && 'would_insert' in data.data) {
                console.log(`Would insert ${(data.data as TestSearchData).would_insert.length} total records`);
            }
        } else {
            console.error('Operation failed:', data.message);
            handleValidationErrors(data);
        }

        return data;
    } catch (error) {
        console.error('Network error:', error);
        throw error;
    }
}

/**
 * Handle and display validation errors
 * @param response - API response containing errors
 */
function handleValidationErrors(response: ApiErrorResponse): void {
    if (response.errors) {
        console.error('Validation errors:');
        Object.entries(response.errors).forEach(([field, errors]) => {
            console.error(`- ${field}: ${errors.join(', ')}`);
        });
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
 * Validate date format (YYYY-MM-DD)
 * @param date - Date string to validate
 * @returns True if valid, false otherwise
 */
function validateDateFormat(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime()) && 
           dateObj.toISOString().slice(0, 10) === date;
}

/**
 * Validate that dateTo is after or equal to dateFrom
 * @param dateFrom - Check-in date
 * @param dateTo - Check-out date
 * @returns True if valid, false otherwise
 */
function validateDateRange(dateFrom: string, dateTo: string): boolean {
    return new Date(dateTo) >= new Date(dateFrom);
}

/**
 * Validate array of search objects
 * @param searches - Array of search objects to validate
 * @returns Validation result with errors
 */
function validateSearches(searches: SearchObject[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(searches)) {
        return { valid: false, errors: ['searches must be an array'] };
    }
    
    searches.forEach((search, index) => {
        if (!search.date_from || !search.date_to) {
            errors.push(`Search ${index}: missing date_from or date_to`);
            return;
        }
        
        if (!validateDateFormat(search.date_from)) {
            errors.push(`Search ${index}: invalid date_from format`);
        }
        
        if (!validateDateFormat(search.date_to)) {
            errors.push(`Search ${index}: invalid date_to format`);
        }
        
        if (!validateDateRange(search.date_from, search.date_to)) {
            errors.push(`Search ${index}: date_to must be after or equal to date_from`);
        }
    });
    
    return { valid: errors.length === 0, errors };
}

/**
 * Example usage with proper error handling and type checking
 */
async function exampleUsage(): Promise<void> {
    console.log('=== SINGLE SEARCH EXAMPLE ===');
    
    const dateFrom = '2025-06-01';
    const dateTo = '2025-06-05';

    // Validate dates before making API calls
    if (!validateDateFormat(dateFrom) || !validateDateFormat(dateTo)) {
        console.error('Invalid date format. Please use YYYY-MM-DD format.');
        return;
    }

    if (!validateDateRange(dateFrom, dateTo)) {
        console.error('Check-out date must be after or equal to check-in date.');
        return;
    }

    try {
        // Test single search
        console.log('Testing single booking search...');
        const testResult = await testSingleBookingSearch(dateFrom, dateTo);
        
        if (isSuccessResponse(testResult)) {
            console.log(`Test successful! Would record ${testResult.data.total_days_recorded} days`);
            
            // Record the actual search
            console.log('\nRecording single booking search...');
            const recordResult = await recordSingleBookingSearch(dateFrom, dateTo);
            
            if (isSuccessResponse(recordResult)) {
                console.log(`Successfully recorded search for subhotel ${recordResult.data.subhotel_id}`);
            } else {
                console.error('Failed to record search:', recordResult.message);
            }
        } else {
            console.error('Test failed:', testResult.message);
        }
        
        console.log('\n=== MULTIPLE SEARCHES EXAMPLE ===');
        
        const searches: SearchObject[] = [
            { date_from: '2025-06-01', date_to: '2025-06-05' },
            { date_from: '2025-07-15', date_to: '2025-07-20' },
            { date_from: '2025-08-10', date_to: '2025-08-12' }
        ];
        
        // Validate multiple searches
        const validation = validateSearches(searches);
        if (!validation.valid) {
            console.error('Validation errors:');
            validation.errors.forEach(error => console.error(`- ${error}`));
            return;
        }
        
        // Test multiple searches
        console.log('Testing multiple booking searches...');
        const multiTestResult = await testMultipleBookingSearches(searches);
        
        if (isSuccessResponse(multiTestResult)) {
            console.log(`Multiple searches test successful! Would record ${multiTestResult.data.total_days_recorded} total days`);
            
            // Record multiple searches
            console.log('\nRecording multiple booking searches...');
            const multiRecordResult = await recordMultipleBookingSearches(searches);
            
            if (isSuccessResponse(multiRecordResult)) {
                console.log(`Successfully recorded ${multiRecordResult.data.processed_ranges.length} search ranges`);
            } else {
                console.error('Failed to record searches:', multiRecordResult.message);
            }
        } else {
            console.error('Multiple searches test failed:', multiTestResult.message);
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Usage examples:

console.log('=== SIMPLE EXAMPLES ===');

// Simple single search test
console.log('Testing single search:');
testSingleBookingSearch('2025-06-01', '2025-06-05');

console.log('\nRecording single search:');
recordSingleBookingSearch('2025-06-01', '2025-06-05');

console.log('\n=== BULK PROCESSING EXAMPLES ===');

// Multiple searches for better performance
const bulkSearches: SearchObject[] = [
    { date_from: '2025-01-15', date_to: '2025-01-18' },
    { date_from: '2025-02-20', date_to: '2025-02-25' },
    { date_from: '2025-03-10', date_to: '2025-03-15' }
];

console.log('Testing multiple searches:');
testMultipleBookingSearches(bulkSearches);

console.log('\nRecording multiple searches:');
recordMultipleBookingSearches(bulkSearches);

console.log('\n=== GENERIC FUNCTION EXAMPLES ===');

// Using generic function for single search (test mode)
console.log('Generic function - single search test:');
handleBookingSearch<TestSearchData>({ date_from: '2025-06-01', date_to: '2025-06-05' }, true);

// Using generic function for multiple searches (real mode)
console.log('\nGeneric function - multiple searches record:');
handleBookingSearch<BookingSearchData>([
    { date_from: '2025-06-01', date_to: '2025-06-05' },
    { date_from: '2025-07-15', date_to: '2025-07-20' }
], false);

console.log('\n=== ADVANCED USAGE WITH VALIDATION ===');
exampleUsage();

console.log('\n=== PERFORMANCE RECOMMENDATION ===');
console.log('For optimal performance, use bulk processing when recording multiple searches:');
console.log('- Single API call for multiple searches reduces network overhead');
console.log('- Database transactions are optimized for bulk inserts');
console.log('- Rate limiting is more efficient');
console.log('- Type safety ensures data integrity');

const performanceExample: SearchObject[] = [
    { date_from: '2025-01-01', date_to: '2025-01-05' },
    { date_from: '2025-01-10', date_to: '2025-01-15' },
    { date_from: '2025-01-20', date_to: '2025-01-25' },
    { date_from: '2025-01-30', date_to: '2025-02-03' }
];

console.log('\nRecording 4 searches in a single optimized API call:');
recordMultipleBookingSearches(performanceExample);
