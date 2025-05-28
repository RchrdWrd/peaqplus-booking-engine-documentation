<?php
/**
 * Booking Engine API - PHP Examples
 * 
 * PHP examples showing how to call the Booking Engine API endpoints
 * Supports both single search objects and arrays of multiple searches
 * using cURL for HTTP requests
 */

// Configuration
const API_CONFIG = [
    'PRODUCTION' => 'https://app.peaqplus.com/api/v1',
    'DEVELOPMENT' => 'https://beta.peaqplus.com/api/v1'
];

const ENVIRONMENT = 'PRODUCTION'; // Change to 'DEVELOPMENT' for testing
const API_BASE_URL = API_CONFIG[ENVIRONMENT];
const API_TOKEN = $_ENV['PEAQPLUS_BOOKING_ENGINE_TOKEN']; // Token from environment variable

/**
 * Makes a cURL request to the API
 * 
 * @param string $endpoint The API endpoint (e.g., '/booking-engine-search')
 * @param array|object $data The data to send in the request body
 * @return array The decoded JSON response with HTTP code
 * @throws Exception If the request fails
 */
function makeApiRequest($endpoint, $data) {
    $url = API_BASE_URL . $endpoint;
    
    // Initialize cURL
    $ch = curl_init();
    
    // Set cURL options
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-Third-Party-Token: ' . API_TOKEN
        ],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_FOLLOWLOCATION => true
    ]);
    
    // Execute the request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    // Check for cURL errors
    if ($response === false || !empty($error)) {
        throw new Exception("cURL error: " . $error);
    }
    
    // Decode JSON response
    $decodedResponse = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON decode error: " . json_last_error_msg());
    }
    
    return [
        'data' => $decodedResponse,
        'http_code' => $httpCode
    ];
}

/**
 * Test single booking engine search (no data saved)
 * 
 * @param string $dateFrom Check-in date (YYYY-MM-DD)
 * @param string $dateTo Check-out date (YYYY-MM-DD)
 * @return array API response
 */
function testSingleBookingSearch($dateFrom, $dateTo) {
    try {
        $requestData = [
            'date_from' => $dateFrom,
            'date_to' => $dateTo
        ];
        
        $result = makeApiRequest('/test/booking-engine-search', $requestData);
        $response = $result['data'];
        
        if ($response['success']) {
            echo "Single search test completed successfully:\n";
            echo "Total days recorded: " . $response['data']['total_days_recorded'] . "\n";
            echo "Subhotel ID: " . $response['data']['subhotel_id'] . "\n";
            
            // Display processed ranges
            foreach ($response['data']['processed_ranges'] as $range) {
                echo "Range: " . $range['date_from'] . " to " . $range['date_to'] . 
                     " (" . $range['days_recorded'] . " days)\n";
            }
            
            echo "Would insert " . count($response['data']['would_insert']) . " records\n";
            
            // Print first few records as sample
            $sampleCount = min(3, count($response['data']['would_insert']));
            for ($i = 0; $i < $sampleCount; $i++) {
                $record = $response['data']['would_insert'][$i];
                echo "- Date: " . $record['date'] . ", Created: " . $record['created_at'] . "\n";
            }
            
            if (count($response['data']['would_insert']) > 3) {
                echo "... and " . (count($response['data']['would_insert']) - 3) . " more records\n";
            }
        } else {
            echo "Test failed: " . $response['message'] . "\n";
            handleValidationErrors($response);
        }
        
        return $response;
        
    } catch (Exception $e) {
        echo "Error testing single booking search: " . $e->getMessage() . "\n";
        return null;
    }
}

/**
 * Test multiple booking engine searches (no data saved)
 * 
 * @param array $searches Array of search objects with date_from and date_to
 * @return array API response
 */
function testMultipleBookingSearches($searches) {
    try {
        $result = makeApiRequest('/test/booking-engine-search', $searches);
        $response = $result['data'];
        
        if ($response['success']) {
            echo "Multiple searches test completed successfully:\n";
            echo "Total days recorded: " . $response['data']['total_days_recorded'] . "\n";
            echo "Subhotel ID: " . $response['data']['subhotel_id'] . "\n";
            echo "Number of processed ranges: " . count($response['data']['processed_ranges']) . "\n";
            
            // Display all processed ranges
            foreach ($response['data']['processed_ranges'] as $index => $range) {
                echo "Range " . ($index + 1) . ": " . $range['date_from'] . " to " . $range['date_to'] . 
                     " (" . $range['days_recorded'] . " days)\n";
            }
            
            echo "Would insert " . count($response['data']['would_insert']) . " total records\n";
        } else {
            echo "Test failed: " . $response['message'] . "\n";
            handleValidationErrors($response);
        }
        
        return $response;
        
    } catch (Exception $e) {
        echo "Error testing multiple booking searches: " . $e->getMessage() . "\n";
        return null;
    }
}

/**
 * Record a single real booking engine search (saves data to database)
 * 
 * @param string $dateFrom Check-in date (YYYY-MM-DD)
 * @param string $dateTo Check-out date (YYYY-MM-DD)
 * @return array API response
 */
function recordSingleBookingSearch($dateFrom, $dateTo) {
    try {
        $requestData = [
            'date_from' => $dateFrom,
            'date_to' => $dateTo
        ];
        
        $result = makeApiRequest('/booking-engine-search', $requestData);
        $response = $result['data'];
        
        if ($response['success']) {
            echo "Single search recorded successfully:\n";
            echo "Total days recorded: " . $response['data']['total_days_recorded'] . "\n";
            echo "Subhotel ID: " . $response['data']['subhotel_id'] . "\n";
            
            foreach ($response['data']['processed_ranges'] as $range) {
                echo "Range: " . $range['date_from'] . " to " . $range['date_to'] . 
                     " (" . $range['days_recorded'] . " days)\n";
            }
        } else {
            echo "Recording failed: " . $response['message'] . "\n";
            handleValidationErrors($response);
        }
        
        return $response;
        
    } catch (Exception $e) {
        echo "Error recording single booking search: " . $e->getMessage() . "\n";
        return null;
    }
}

/**
 * Record multiple real booking engine searches (saves data to database)
 * 
 * @param array $searches Array of search objects with date_from and date_to
 * @return array API response
 */
function recordMultipleBookingSearches($searches) {
    try {
        $result = makeApiRequest('/booking-engine-search', $searches);
        $response = $result['data'];
        
        if ($response['success']) {
            echo "Multiple searches recorded successfully:\n";
            echo "Total days recorded: " . $response['data']['total_days_recorded'] . "\n";
            echo "Subhotel ID: " . $response['data']['subhotel_id'] . "\n";
            echo "Number of processed ranges: " . count($response['data']['processed_ranges']) . "\n";
            
            foreach ($response['data']['processed_ranges'] as $index => $range) {
                echo "Range " . ($index + 1) . ": " . $range['date_from'] . " to " . $range['date_to'] . 
                     " (" . $range['days_recorded'] . " days)\n";
            }
        } else {
            echo "Recording failed: " . $response['message'] . "\n";
            handleValidationErrors($response);
        }
        
        return $response;
        
    } catch (Exception $e) {
        echo "Error recording multiple booking searches: " . $e->getMessage() . "\n";
        return null;
    }
}

/**
 * Generic function to handle both single and multiple searches
 * 
 * @param array|object $searchData Single search object or array of search objects
 * @param bool $testMode Whether to use test endpoint (true) or real endpoint (false)
 * @return array API response
 */
function handleBookingSearch($searchData, $testMode = false) {
    $endpoint = $testMode ? '/test/booking-engine-search' : '/booking-engine-search';
    $isMultiple = array_keys($searchData) === range(0, count($searchData) - 1); // Check if indexed array
    
    try {
        $result = makeApiRequest($endpoint, $searchData);
        $response = $result['data'];
        
        if ($response['success']) {
            $action = $testMode ? 'tested' : 'recorded';
            $type = $isMultiple ? 'multiple searches' : 'single search';
            
            echo ucfirst($type) . " " . $action . " successfully:\n";
            echo "Total days recorded: " . $response['data']['total_days_recorded'] . "\n";
            echo "Subhotel ID: " . $response['data']['subhotel_id'] . "\n";
            
            if ($isMultiple) {
                echo "Number of processed ranges: " . count($response['data']['processed_ranges']) . "\n";
            }
            
            foreach ($response['data']['processed_ranges'] as $index => $range) {
                if ($isMultiple) {
                    echo "Range " . ($index + 1) . ": ";
                } else {
                    echo "Range: ";
                }
                echo $range['date_from'] . " to " . $range['date_to'] . 
                     " (" . $range['days_recorded'] . " days)\n";
            }
            
            if ($testMode) {
                echo "Would insert " . count($response['data']['would_insert']) . " total records\n";
            }
        } else {
            echo "Operation failed: " . $response['message'] . "\n";
            handleValidationErrors($response);
        }
        
        return $response;
        
    } catch (Exception $e) {
        echo "Error in booking search operation: " . $e->getMessage() . "\n";
        return null;
    }
}

/**
 * Handle and display validation errors
 * 
 * @param array $response API response containing errors
 */
function handleValidationErrors($response) {
    if (isset($response['errors'])) {
        echo "Validation errors:\n";
        foreach ($response['errors'] as $field => $errors) {
            echo "- $field: " . implode(', ', $errors) . "\n";
        }
    }
}

/**
 * Validate date format (YYYY-MM-DD)
 * 
 * @param string $date Date string to validate
 * @return bool True if valid, false otherwise
 */
function validateDateFormat($date) {
    $dateTime = DateTime::createFromFormat('Y-m-d', $date);
    return $dateTime && $dateTime->format('Y-m-d') === $date;
}

/**
 * Validate array of search objects
 * 
 * @param array $searches Array of search objects to validate
 * @return array Array with validation result and errors
 */
function validateSearches($searches) {
    $errors = [];
    
    if (!is_array($searches)) {
        return ['valid' => false, 'errors' => ['searches must be an array']];
    }
    
    foreach ($searches as $index => $search) {
        if (!isset($search['date_from']) || !isset($search['date_to'])) {
            $errors[] = "Search $index: missing date_from or date_to";
            continue;
        }
        
        if (!validateDateFormat($search['date_from'])) {
            $errors[] = "Search $index: invalid date_from format";
        }
        
        if (!validateDateFormat($search['date_to'])) {
            $errors[] = "Search $index: invalid date_to format";
        }
        
        if (strtotime($search['date_to']) < strtotime($search['date_from'])) {
            $errors[] = "Search $index: date_to must be after or equal to date_from";
        }
    }
    
    return ['valid' => empty($errors), 'errors' => $errors];
}

/**
 * Example usage with validation
 */
function exampleUsage() {
    echo "=== SINGLE SEARCH EXAMPLE ===\n";
    
    $dateFrom = '2025-06-01';
    $dateTo = '2025-06-05';
    
    // Validate dates before making API calls
    if (!validateDateFormat($dateFrom) || !validateDateFormat($dateTo)) {
        echo "Invalid date format. Please use YYYY-MM-DD format.\n";
        return;
    }
    
    if (strtotime($dateTo) < strtotime($dateFrom)) {
        echo "Check-out date must be after or equal to check-in date.\n";
        return;
    }
    
    // Test single search
    echo "Testing single booking search...\n";
    $testResult = testSingleBookingSearch($dateFrom, $dateTo);
    
    if ($testResult && $testResult['success']) {
        echo "\nRecording single booking search...\n";
        recordSingleBookingSearch($dateFrom, $dateTo);
    }
    
    echo "\n=== MULTIPLE SEARCHES EXAMPLE ===\n";
    
    $searches = [
        ['date_from' => '2025-06-01', 'date_to' => '2025-06-05'],
        ['date_from' => '2025-07-15', 'date_to' => '2025-07-20'],
        ['date_from' => '2025-08-10', 'date_to' => '2025-08-12']
    ];
    
    // Validate multiple searches
    $validation = validateSearches($searches);
    if (!$validation['valid']) {
        echo "Validation errors:\n";
        foreach ($validation['errors'] as $error) {
            echo "- $error\n";
        }
        return;
    }
    
    // Test multiple searches
    echo "Testing multiple booking searches...\n";
    $multiTestResult = testMultipleBookingSearches($searches);
    
    if ($multiTestResult && $multiTestResult['success']) {
        echo "\nRecording multiple booking searches...\n";
        recordMultipleBookingSearches($searches);
    }
}

// Usage examples:

echo "=== SIMPLE EXAMPLES ===\n";

// Simple single search test
echo "Testing single search:\n";
testSingleBookingSearch('2025-06-01', '2025-06-05');

echo "\nRecording single search:\n";
recordSingleBookingSearch('2025-06-01', '2025-06-05');

echo "\n=== BULK PROCESSING EXAMPLES ===\n";

// Multiple searches for better performance
$bulkSearches = [
    ['date_from' => '2025-01-15', 'date_to' => '2025-01-18'],
    ['date_from' => '2025-02-20', 'date_to' => '2025-02-25'],
    ['date_from' => '2025-03-10', 'date_to' => '2025-03-15']
];

echo "Testing multiple searches:\n";
testMultipleBookingSearches($bulkSearches);

echo "\nRecording multiple searches:\n";
recordMultipleBookingSearches($bulkSearches);

echo "\n=== GENERIC FUNCTION EXAMPLES ===\n";

// Using generic function for single search (test mode)
echo "Generic function - single search test:\n";
handleBookingSearch(['date_from' => '2025-06-01', 'date_to' => '2025-06-05'], true);

// Using generic function for multiple searches (real mode)
echo "\nGeneric function - multiple searches record:\n";
handleBookingSearch([
    ['date_from' => '2025-06-01', 'date_to' => '2025-06-05'],
    ['date_from' => '2025-07-15', 'date_to' => '2025-07-20']
], false);

echo "\n=== ADVANCED USAGE WITH VALIDATION ===\n";
exampleUsage();

echo "\n=== PERFORMANCE RECOMMENDATION ===\n";
echo "For optimal performance, use bulk processing when recording multiple searches:\n";
echo "- Single API call for multiple searches reduces network overhead\n";
echo "- Database transactions are optimized for bulk inserts\n";
echo "- Rate limiting is more efficient\n";

$performanceExample = [
    ['date_from' => '2025-01-01', 'date_to' => '2025-01-05'],
    ['date_from' => '2025-01-10', 'date_to' => '2025-01-15'],
    ['date_from' => '2025-01-20', 'date_to' => '2025-01-25'],
    ['date_from' => '2025-01-30', 'date_to' => '2025-02-03']
];

echo "\nRecording 4 searches in a single optimized API call:\n";
recordMultipleBookingSearches($performanceExample);

?>
