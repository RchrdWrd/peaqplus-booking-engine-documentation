<?php
/**
 * Booking Engine API - PHP Example
 * 
 * Simple PHP example showing how to call the Booking Engine API endpoints
 * using cURL for HTTP requests
 */

// Configuration
const API_BASE_URL = 'https://peaqplus.com/api';
const API_TOKEN = $_ENV['PEAQPLUS_BOOKING_ENGINE_TOKEN']; // Token from environment variable

/**
 * Makes a cURL request to the API
 * 
 * @param string $endpoint The API endpoint (e.g., '/booking-engine-search')
 * @param array $data The data to send in the request body
 * @return array The decoded JSON response
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
 * Test the booking engine search (no data saved)
 * 
 * @param string $dateFrom Check-in date (YYYY-MM-DD)
 * @param string $dateTo Check-out date (YYYY-MM-DD)
 * @return array API response
 */
function testBookingSearch($dateFrom, $dateTo) {
    try {
        $requestData = [
            'date_from' => $dateFrom,
            'date_to' => $dateTo
        ];
        
        $result = makeApiRequest('/test/booking-engine-search', $requestData);
        $response = $result['data'];
        
        if ($response['success']) {
            echo "Test completed successfully:\n";
            echo "Days recorded: " . $response['data']['days_recorded'] . "\n";
            echo "Subhotel ID: " . $response['data']['subhotel_id'] . "\n";
            echo "Would insert " . count($response['data']['would_insert']) . " records\n";
            
            // Print the records that would be inserted
            foreach ($response['data']['would_insert'] as $record) {
                echo "- Date: " . $record['date'] . ", Created: " . $record['created_at'] . "\n";
            }
        } else {
            echo "Test failed: " . $response['message'] . "\n";
            
            if (isset($response['errors'])) {
                echo "Validation errors:\n";
                foreach ($response['errors'] as $field => $errors) {
                    echo "- $field: " . implode(', ', $errors) . "\n";
                }
            }
        }
        
        return $response;
        
    } catch (Exception $e) {
        echo "Error testing booking search: " . $e->getMessage() . "\n";
        return null;
    }
}

/**
 * Record a real booking engine search (saves data to database)
 * 
 * @param string $dateFrom Check-in date (YYYY-MM-DD)
 * @param string $dateTo Check-out date (YYYY-MM-DD)
 * @return array API response
 */
function recordBookingSearch($dateFrom, $dateTo) {
    try {
        $requestData = [
            'date_from' => $dateFrom,
            'date_to' => $dateTo
        ];
        
        $result = makeApiRequest('/booking-engine-search', $requestData);
        $response = $result['data'];
        
        if ($response['success']) {
            echo "Search recorded successfully:\n";
            echo "Days recorded: " . $response['data']['days_recorded'] . "\n";
            echo "Subhotel ID: " . $response['data']['subhotel_id'] . "\n";
            echo "Date range: " . $response['data']['date_from'] . " to " . $response['data']['date_to'] . "\n";
        } else {
            echo "Recording failed: " . $response['message'] . "\n";
            
            if (isset($response['errors'])) {
                echo "Validation errors:\n";
                foreach ($response['errors'] as $field => $errors) {
                    echo "- $field: " . implode(', ', $errors) . "\n";
                }
            }
        }
        
        return $response;
        
    } catch (Exception $e) {
        echo "Error recording booking search: " . $e->getMessage() . "\n";
        return null;
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
 * Example usage with validation
 */
function exampleUsage() {
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
    
    echo "=== Testing Booking Search ===\n";
    $testResult = testBookingSearch($dateFrom, $dateTo);
    
    if ($testResult && $testResult['success']) {
        echo "\n=== Recording Booking Search ===\n";
        recordBookingSearch($dateFrom, $dateTo);
    }
}

// Usage examples:

// Simple usage
echo "=== Simple Test ===\n";
testBookingSearch('2025-06-01', '2025-06-05');

echo "\n=== Simple Record ===\n";
recordBookingSearch('2025-06-01', '2025-06-05');

// Advanced usage with validation
echo "\n=== Advanced Usage ===\n";
exampleUsage();

?>
