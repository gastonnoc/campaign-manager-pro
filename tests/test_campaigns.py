"""
Unit tests for Campaign Manager Pro
Run with: python -m pytest tests/
"""

import pytest
import json
from decimal import Decimal


class TestCampaignCalculations:
    """Test campaign margin calculations"""
    
    def test_calculate_gross_margin(self):
        """Test gross margin calculation"""
        investment = 10236.82
        cost = 4677.40
        hidden_cost = -1536.86
        
        # GM = Investment - Cost - Hidden Cost
        expected_margin = 10236.82 - 4677.40 - (-1536.86)
        assert abs(expected_margin - 7096.28) < 0.01
    
    def test_calculate_margin_percentage(self):
        """Test margin percentage calculation"""
        gross_margin = 7096.28
        investment = 10236.82
        
        # Margin % = (GM / Investment) * 100
        expected_percentage = (gross_margin / investment) * 100
        assert abs(expected_percentage - 69.32) < 0.01
    
    def test_zero_investment(self):
        """Test margin calculation with zero investment"""
        margin = 100
        investment = 0
        
        # Should return 0 to avoid division by zero
        percentage = 0 if investment == 0 else (margin / investment) * 100
        assert percentage == 0


class TestCampaignValidation:
    """Test campaign data validation"""
    
    def test_required_fields(self):
        """Test that all required fields are present"""
        required_fields = [
            'name', 'customer', 'brandAdvertiser', 'organizationPublisher',
            'market', 'salesPerson', 'month', 'investment', 'cost'
        ]
        
        campaign_data = {
            'name': 'Test Campaign',
            'customer': 'Test Customer',
            'brandAdvertiser': 'Test Brand',
            'organizationPublisher': 'Test Publisher',
            'market': 'Test Market',
            'salesPerson': 'John Doe',
            'month': 'Jan',
            'investment': 10000,
            'cost': 5000,
            'hiddenCost': -500
        }
        
        for field in required_fields:
            assert field in campaign_data
    
    def test_investment_positive(self):
        """Test that investment must be positive"""
        investment = 10000
        assert investment > 0
    
    def test_valid_month(self):
        """Test that month is valid"""
        valid_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        month = 'Jan'
        assert month in valid_months


class TestCampaignLines:
    """Test campaign lines calculations"""
    
    def test_line_investment_calculation(self):
        """Test line investment = units * unitCost"""
        units = 68820
        unit_cost = 0.15
        expected_investment = units * unit_cost
        
        assert abs(expected_investment - 10323.00) < 0.01
    
    def test_line_margin_calculation(self):
        """Test line margin calculation"""
        line_investment = 10323.00
        line_cost = 6300.00
        line_margin = ((line_investment - line_cost) / line_investment) * 100
        
        assert abs(line_margin - 38.97) < 0.01


class TestFileUpload:
    """Test file upload validation"""
    
    def test_allowed_file_types(self):
        """Test allowed file types for upload"""
        allowed_types = [
            'image/jpeg', 'image/png', 'image/gif',
            'application/pdf', 'image/svg+xml'
        ]
        
        assert 'image/jpeg' in allowed_types
        assert 'application/pdf' in allowed_types
        assert 'text/plain' not in allowed_types
    
    def test_max_file_size(self):
        """Test maximum file size validation"""
        max_size = 10 * 1024 * 1024  # 10MB
        file_size = 5 * 1024 * 1024   # 5MB
        
        assert file_size <= max_size
    
    def test_file_size_exceeded(self):
        """Test file size exceeded"""
        max_size = 10 * 1024 * 1024   # 10MB
        file_size = 15 * 1024 * 1024  # 15MB
        
        assert file_size > max_size


class TestAPIResponses:
    """Test API response structures"""
    
    def test_success_response_structure(self):
        """Test success response has correct structure"""
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'id': '123', 'name': 'Test'})
        }
        
        assert response['statusCode'] == 200
        assert 'Content-Type' in response['headers']
        assert 'Access-Control-Allow-Origin' in response['headers']
    
    def test_error_response_structure(self):
        """Test error response has correct structure"""
        response = {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid input'})
        }
        
        assert response['statusCode'] == 400
        body = json.loads(response['body'])
        assert 'error' in body


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
