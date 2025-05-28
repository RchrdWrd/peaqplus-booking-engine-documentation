"""
Booking Engine API - Python Examples

Python examples showing how to call the Booking Engine API endpoints
Supports both single search objects and arrays of multiple searches
using the requests library for HTTP requests
"""

import requests
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional, List, Union

# Configuration
API_CONFIG = {
    'PRODUCTION': 'https://app.peaqplus.com/api/v1',
    'DEVELOPMENT': 'https://beta.peaqplus.com/api/v1'
}

ENVIRONMENT = 'PRODUCTION'  # Change to 'DEVELOPMENT' for testing
API_BASE_URL = API_CONFIG[ENVIRONMENT]
API_TOKEN = os.getenv("PEAQPLUS_BOOKING_ENGINE_TOKEN")  # Token from environment variable

class BookingEngineAPI:
    """Wrapper class for Booking Engine API calls with support for bulk operations"""
    
    def __init__(self, base_url: str, token: str, timeout: int = 30):
        self.base_url = base_url
        self.token = token
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'X-Third-Party-Token': token
        })
    
    def make_request(self, endpoint: str, data: Union[Dict[str, Any], List[Dict[str, Any]]]) -> Dict[str, Any]:
        """
        Make a POST request to the API endpoint
        
        Args:
            endpoint: API endpoint (e.g., '/booking-engine-search')
            data: Request payload data (single object or array of objects)
            
        Returns:
            Dictionary containing the API response
            
        Raises:
            requests.RequestException: If the request fails
        """
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = self.session.post(
                url,
                json=data,
                timeout=self.timeout
            )
            
            # Parse JSON response
            response_data = response.json()
            
            return {
                'data': response_data,
                'status_code': response.status_code,
                'success': response.ok
            }
            
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            raise
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            raise

def test_single_booking_search(date_from: str, date_to: str) -> Optional[Dict[str, Any]]:
    """
    Test single booking engine search (no data saved)
    
    Args:
        date_from: Check-in date (YYYY-MM-DD)
        date_to: Check-out date (YYYY-MM-DD)
        
    Returns:
        API response dictionary or None if error occurred
    """
    api = BookingEngineAPI(API_BASE_URL, API_TOKEN)
    
    try:
        request_data = {
            'date_from': date_from,
            'date_to': date_to
        }
        
        result = api.make_request('/test/booking-engine-search', request_data)
        response = result['data']
        
        if response['success']:
            print("Single search test completed successfully:")
            print(f"Total days recorded: {response['data']['total_days_recorded']}")
            print(f"Subhotel ID: {response['data']['subhotel_id']}")
            
            # Display processed ranges
            for range_data in response['data']['processed_ranges']:
                print(f"Range: {range_data['date_from']} to {range_data['date_to']} "
                      f"({range_data['days_recorded']} days)")
            
            print(f"Would insert {len(response['data']['would_insert'])} records")
            
            # Print first few records as sample
            sample_count = min(3, len(response['data']['would_insert']))
            for i in range(sample_count):
                record = response['data']['would_insert'][i]
                print(f"- Date: {record['date']}, Created: {record['created_at']}")
            
            if len(response['data']['would_insert']) > 3:
                print(f"... and {len(response['data']['would_insert']) - 3} more records")
                
        else:
            print(f"Test failed: {response['message']}")
            handle_validation_errors(response)
        
        return response
        
    except Exception as e:
        print(f"Error testing single booking search: {e}")
        return None

def test_multiple_booking_searches(searches: List[Dict[str, str]]) -> Optional[Dict[str, Any]]:
    """
    Test multiple booking engine searches (no data saved)
    
    Args:
        searches: List of search objects with date_from and date_to
        
    Returns:
        API response dictionary or None if error occurred
    """
    api = BookingEngineAPI(API_BASE_URL, API_TOKEN)
    
    try:
        result = api.make_request('/test/booking-engine-search', searches)
        response = result['data']
        
        if response['success']:
            print("Multiple searches test completed successfully:")
            print(f"Total days recorded: {response['data']['total_days_recorded']}")
            print(f"Subhotel ID: {response['data']['subhotel_id']}")
            print(f"Number of processed ranges: {len(response['data']['processed_ranges'])}")
            
            # Display all processed ranges
            for index, range_data in enumerate(response['data']['processed_ranges']):
                print(f"Range {index + 1}: {range_data['date_from']} to {range_data['date_to']} "
                      f"({range_data['days_recorded']} days)")
            
            print(f"Would insert {len(response['data']['would_insert'])} total records")
        else:
            print(f"Test failed: {response['message']}")
            handle_validation_errors(response)
        
        return response
        
    except Exception as e:
        print(f"Error testing multiple booking searches: {e}")
        return None

def record_single_booking_search(date_from: str, date_to: str) -> Optional[Dict[str, Any]]:
    """
    Record a single real booking engine search (saves data to database)
    
    Args:
        date_from: Check-in date (YYYY-MM-DD)
        date_to: Check-out date (YYYY-MM-DD)
        
    Returns:
        API response dictionary or None if error occurred
    """
    api = BookingEngineAPI(API_BASE_URL, API_TOKEN)
    
    try:
        request_data = {
            'date_from': date_from,
            'date_to': date_to
        }
        
        result = api.make_request('/booking-engine-search', request_data)
        response = result['data']
        
        if response['success']:
            print("Single search recorded successfully:")
            print(f"Total days recorded: {response['data']['total_days_recorded']}")
            print(f"Subhotel ID: {response['data']['subhotel_id']}")
            
            for range_data in response['data']['processed_ranges']:
                print(f"Range: {range_data['date_from']} to {range_data['date_to']} "
                      f"({range_data['days_recorded']} days)")
        else:
            print(f"Recording failed: {response['message']}")
            handle_validation_errors(response)
        
        return response
        
    except Exception as e:
        print(f"Error recording single booking search: {e}")
        return None

def record_multiple_booking_searches(searches: List[Dict[str, str]]) -> Optional[Dict[str, Any]]:
    """
    Record multiple real booking engine searches (saves data to database)
    
    Args:
        searches: List of search objects with date_from and date_to
        
    Returns:
        API response dictionary or None if error occurred
    """
    api = BookingEngineAPI(API_BASE_URL, API_TOKEN)
    
    try:
        result = api.make_request('/booking-engine-search', searches)
        response = result['data']
        
        if response['success']:
            print("Multiple searches recorded successfully:")
            print(f"Total days recorded: {response['data']['total_days_recorded']}")
            print(f"Subhotel ID: {response['data']['subhotel_id']}")
            print(f"Number of processed ranges: {len(response['data']['processed_ranges'])}")
            
            for index, range_data in enumerate(response['data']['processed_ranges']):
                print(f"Range {index + 1}: {range_data['date_from']} to {range_data['date_to']} "
                      f"({range_data['days_recorded']} days)")
        else:
            print(f"Recording failed: {response['message']}")
            handle_validation_errors(response)
        
        return response
        
    except Exception as e:
        print(f"Error recording multiple booking searches: {e}")
        return None

def handle_booking_search(search_data: Union[Dict[str, str], List[Dict[str, str]]], 
                         test_mode: bool = False) -> Optional[Dict[str, Any]]:
    """
    Generic function to handle both single and multiple searches
    
    Args:
        search_data: Single search object or list of search objects
        test_mode: Whether to use test endpoint (True) or real endpoint (False)
        
    Returns:
        API response dictionary or None if error occurred
    """
    api = BookingEngineAPI(API_BASE_URL, API_TOKEN)
    endpoint = '/test/booking-engine-search' if test_mode else '/booking-engine-search'
    is_multiple = isinstance(search_data, list)
    
    try:
        result = api.make_request(endpoint, search_data)
        response = result['data']
        
        if response['success']:
            action = 'tested' if test_mode else 'recorded'
            search_type = 'multiple searches' if is_multiple else 'single search'
            
            print(f"{search_type.title()} {action} successfully:")
            print(f"Total days recorded: {response['data']['total_days_recorded']}")
            print(f"Subhotel ID: {response['data']['subhotel_id']}")
            
            if is_multiple:
                print(f"Number of processed ranges: {len(response['data']['processed_ranges'])}")
            
            for index, range_data in enumerate(response['data']['processed_ranges']):
                if is_multiple:
                    print(f"Range {index + 1}: ", end="")
                else:
                    print("Range: ", end="")
                print(f"{range_data['date_from']} to {range_data['date_to']} "
                      f"({range_data['days_recorded']} days)")
            
            if test_mode:
                print(f"Would insert {len(response['data']['would_insert'])} total records")
        else:
            print(f"Operation failed: {response['message']}")
            handle_validation_errors(response)
        
        return response
        
    except Exception as e:
        print(f"Error in booking search operation: {e}")
        return None

def handle_validation_errors(response: Dict[str, Any]) -> None:
    """
    Handle and display validation errors
    
    Args:
        response: API response containing errors
    """
    if 'errors' in response:
        print("Validation errors:")
        for field, errors in response['errors'].items():
            print(f"- {field}: {', '.join(errors)}")

def validate_date_format(date_string: str) -> bool:
    """
    Validate date format (YYYY-MM-DD)
    
    Args:
        date_string: Date string to validate
        
    Returns:
        True if valid, False otherwise
    """
    try:
        datetime.strptime(date_string, '%Y-%m-%d')
        return True
    except ValueError:
        return False

def validate_date_range(date_from: str, date_to: str) -> bool:
    """
    Validate that date_to is after or equal to date_from
    
    Args:
        date_from: Check-in date
        date_to: Check-out date
        
    Returns:
        True if valid, False otherwise
    """
    try:
        from_date = datetime.strptime(date_from, '%Y-%m-%d')
        to_date = datetime.strptime(date_to, '%Y-%m-%d')
        return to_date >= from_date
    except ValueError:
        return False

def validate_searches(searches: List[Dict[str, str]]) -> Dict[str, Union[bool, List[str]]]:
    """
    Validate list of search objects
    
    Args:
        searches: List of search objects to validate
        
    Returns:
        Dictionary with validation result and errors
    """
    errors = []
    
    if not isinstance(searches, list):
        return {'valid': False, 'errors': ['searches must be a list']}
    
    for index, search in enumerate(searches):
        if not isinstance(search, dict):
            errors.append(f"Search {index}: must be a dictionary")
            continue
            
        if 'date_from' not in search or 'date_to' not in search:
            errors.append(f"Search {index}: missing date_from or date_to")
            continue
        
        if not validate_date_format(search['date_from']):
            errors.append(f"Search {index}: invalid date_from format")
        
        if not validate_date_format(search['date_to']):
            errors.append(f"Search {index}: invalid date_to format")
        
        if not validate_date_range(search['date_from'], search['date_to']):
            errors.append(f"Search {index}: date_to must be after or equal to date_from")
    
    return {'valid': len(errors) == 0, 'errors': errors}

def example_usage():
    """Example usage with validation"""
    print("=== SINGLE SEARCH EXAMPLE ===")
    
    date_from = '2025-06-01'
    date_to = '2025-06-05'
    
    # Validate dates before making API calls
    if not validate_date_format(date_from) or not validate_date_format(date_to):
        print("Invalid date format. Please use YYYY-MM-DD format.")
        return
    
    if not validate_date_range(date_from, date_to):
        print("Check-out date must be after or equal to check-in date.")
        return
    
    # Test single search
    print("Testing single booking search...")
    test_result = test_single_booking_search(date_from, date_to)
    
    if test_result and test_result['success']:
        print("\nRecording single booking search...")
        record_single_booking_search(date_from, date_to)
    
    print("\n=== MULTIPLE SEARCHES EXAMPLE ===")
    
    searches = [
        {'date_from': '2025-06-01', 'date_to': '2025-06-05'},
        {'date_from': '2025-07-15', 'date_to': '2025-07-20'},
        {'date_from': '2025-08-10', 'date_to': '2025-08-12'}
    ]
    
    # Validate multiple searches
    validation = validate_searches(searches)
    if not validation['valid']:
        print("Validation errors:")
        for error in validation['errors']:
            print(f"- {error}")
        return
    
    # Test multiple searches
    print("Testing multiple booking searches...")
    multi_test_result = test_multiple_booking_searches(searches)
    
    if multi_test_result and multi_test_result['success']:
        print("\nRecording multiple booking searches...")
        record_multiple_booking_searches(searches)

# Usage examples:
if __name__ == "__main__":
    print("=== SIMPLE EXAMPLES ===")
    
    # Simple single search test
    print("Testing single search:")
    test_single_booking_search('2025-06-01', '2025-06-05')
    
    print("\nRecording single search:")
    record_single_booking_search('2025-06-01', '2025-06-05')
    
    print("\n=== BULK PROCESSING EXAMPLES ===")
    
    # Multiple searches for better performance
    bulk_searches = [
        {'date_from': '2025-01-15', 'date_to': '2025-01-18'},
        {'date_from': '2025-02-20', 'date_to': '2025-02-25'},
        {'date_from': '2025-03-10', 'date_to': '2025-03-15'}
    ]
    
    print("Testing multiple searches:")
    test_multiple_booking_searches(bulk_searches)
    
    print("\nRecording multiple searches:")
    record_multiple_booking_searches(bulk_searches)
    
    print("\n=== GENERIC FUNCTION EXAMPLES ===")
    
    # Using generic function for single search (test mode)
    print("Generic function - single search test:")
    handle_booking_search({'date_from': '2025-06-01', 'date_to': '2025-06-05'}, test_mode=True)
    
    # Using generic function for multiple searches (real mode)
    print("\nGeneric function - multiple searches record:")
    handle_booking_search([
        {'date_from': '2025-06-01', 'date_to': '2025-06-05'},
        {'date_from': '2025-07-15', 'date_to': '2025-07-20'}
    ], test_mode=False)
    
    print("\n=== ADVANCED USAGE WITH VALIDATION ===")
    example_usage()
    
    print("\n=== PERFORMANCE RECOMMENDATION ===")
    print("For optimal performance, use bulk processing when recording multiple searches:")
    print("- Single API call for multiple searches reduces network overhead")
    print("- Database transactions are optimized for bulk inserts")
    print("- Rate limiting is more efficient")
    
    performance_example = [
        {'date_from': '2025-01-01', 'date_to': '2025-01-05'},
        {'date_from': '2025-01-10', 'date_to': '2025-01-15'},
        {'date_from': '2025-01-20', 'date_to': '2025-01-25'},
        {'date_from': '2025-01-30', 'date_to': '2025-02-03'}
    ]
    
    print("\nRecording 4 searches in a single optimized API call:")
    record_multiple_booking_searches(performance_example)
