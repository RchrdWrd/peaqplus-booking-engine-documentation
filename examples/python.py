"""
Booking Engine API - Python Example

Simple Python example showing how to call the Booking Engine API endpoints
using the requests library for HTTP requests
"""

import requests
import json
from datetime import datetime
from typing import Dict, Any, Optional, List

# Configuration
API_BASE_URL = "https://peaqplus.com/api"
API_TOKEN = "YOUR_THIRD_PARTY_TOKEN"  # Replace with your actual token

class BookingEngineAPI:
    """Simple wrapper class for Booking Engine API calls"""
    
    def __init__(self, base_url: str, token: str, timeout: int = 30):
        self.base_url = base_url
        self.token = token
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'X-Third-Party-Token': token
        })
    
    def make_request(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make a POST request to the API endpoint
        
        Args:
            endpoint: API endpoint (e.g., '/booking-engine-search')
            data: Request payload data
            
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

def test_booking_search(date_from: str, date_to: str) -> Optional[Dict[str, Any]]:
    """
    Test the booking engine search (no data saved)
    
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
            print("Test completed successfully:")
            print(f"Days recorded: {response['data']['days_recorded']}")
            print(f"Subhotel ID: {response['data']['subhotel_id']}")
            print(f"Would insert {len(response['data']['would_insert'])} records")
            
            # Print the records that would be inserted
            for record in response['data']['would_insert']:
                print(f"- Date: {record['date']}, Created: {record['created_at']}")
                
        else:
            print(f"Test failed: {response['message']}")
            
            if 'errors' in response:
                print("Validation errors:")
                for field, errors in response['errors'].items():
                    print(f"- {field}: {', '.join(errors)}")
        
        return response
        
    except Exception as e:
        print(f"Error testing booking search: {e}")
        return None

def record_booking_search(date_from: str, date_to: str) -> Optional[Dict[str, Any]]:
    """
    Record a real booking engine search (saves data to database)
    
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
            print("Search recorded successfully:")
            print(f"Days recorded: {response['data']['days_recorded']}")
            print(f"Subhotel ID: {response['data']['subhotel_id']}")
            print(f"Date range: {response['data']['date_from']} to {response['data']['date_to']}")
        else:
            print(f"Recording failed: {response['message']}")
            
            if 'errors' in response:
                print("Validation errors:")
                for field, errors in response['errors'].items():
                    print(f"- {field}: {', '.join(errors)}")
        
        return response
        
    except Exception as e:
        print(f"Error recording booking search: {e}")
        return None

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

def example_usage():
    """Example usage with validation"""
    date_from = '2025-06-01'
    date_to = '2025-06-05'
    
    # Validate dates before making API calls
    if not validate_date_format(date_from) or not validate_date_format(date_to):
        print("Invalid date format. Please use YYYY-MM-DD format.")
        return
    
    if not validate_date_range(date_from, date_to):
        print("Check-out date must be after or equal to check-in date.")
        return
    
    print("=== Testing Booking Search ===")
    test_result = test_booking_search(date_from, date_to)
    
    if test_result and test_result['success']:
        print("\n=== Recording Booking Search ===")
        record_booking_search(date_from, date_to)

# Usage examples:
if __name__ == "__main__":
    # Simple usage
    print("=== Simple Test ===")
    test_booking_search('2025-06-01', '2025-06-05')
    
    print("\n=== Simple Record ===")
    record_booking_search('2025-06-01', '2025-06-05')
    
    # Advanced usage with validation
    print("\n=== Advanced Usage ===")
    example_usage()
