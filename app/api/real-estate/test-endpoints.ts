// This file contains test functions for the RealEstateAPI endpoints
// It's not meant to be used in production, but for testing during development

import { RealEstateAPI } from '../../lib/real-estate-api';

// Mock API key for testing
const TEST_API_KEY = 'test_api_key';

// Test function for property detail API
async function testPropertyDetail() {
  const api = new RealEstateAPI(TEST_API_KEY);
  try {
    const propertyId = '123456'; // Replace with a valid property ID
    console.log(`Testing getPropertyDetail with property ID: ${propertyId}`);
    const result = await api.getPropertyDetail(propertyId);
    console.log('Property Detail API test result:', result);
    return result;
  } catch (error) {
    console.error('Property Detail API test error:', error);
    throw error;
  }
}

// Test function for property search API
async function testPropertySearch() {
  const api = new RealEstateAPI(TEST_API_KEY);
  try {
    const searchParams = {
      city: 'San Francisco',
      state: 'CA',
      max_price: 2,
      property_type: 'Single-family',
    };
    console.log(`Testing searchProperties with params:`, searchParams);
    const result = await api.searchProperties(searchParams);
    console.log('Property Search API test result:', result);
    return result;
  } catch (error) {
    console.error('Property Search API test error:', error);
    throw error;
  }
}

// Test function for property comps API
async function testPropertyComps() {
  const api = new RealEstateAPI(TEST_API_KEY);
  try {
    const propertyId = '123456'; // Replace with a valid property ID
    const compsParams = {
      radius: 1,
      limit: 5,
    };
    console.log(`Testing getPropertyComps with property ID: ${propertyId} and params:`, compsParams);
    const result = await api.getPropertyComps(propertyId, compsParams);
    console.log('Property Comps API test result:', result);
    return result;
  } catch (error) {
    console.error('Property Comps API test error:', error);
    throw error;
  }
}

// Test function for MLS search API
async function testMLSSearch() {
  const api = new RealEstateAPI(TEST_API_KEY);
  try {
    const searchParams = {
      city: 'San Francisco',
      state: 'CA',
      max_price: 2,
      property_type: 'Single-family',
      status: 'active',
    };
    console.log(`Testing searchMLS with params:`, searchParams);
    const result = await api.searchMLS(searchParams);
    console.log('MLS Search API test result:', result);
    return result;
  } catch (error) {
    console.error('MLS Search API test error:', error);
    throw error;
  }
}

// Test function for address autocomplete API
async function testAutocompleteAddress() {
  const api = new RealEstateAPI(TEST_API_KEY);
  try {
    const query = '123 Main St';
    console.log(`Testing autocompleteAddress with query: ${query}`);
    const result = await api.autocompleteAddress(query);
    console.log('Address Autocomplete API test result:', result);
    return result;
  } catch (error) {
    console.error('Address Autocomplete API test error:', error);
    throw error;
  }
}

// Test function for opportunity zone search
async function testOpportunityZoneSearch() {
  const api = new RealEstateAPI(TEST_API_KEY);
  try {
    const searchParams = {
      zip_codes: ['94107', '94103'],
      property_type: 'Commercial',
      max_price: 5,
    };
    console.log(`Testing searchOpportunityZones with params:`, searchParams);
    const result = await api.searchOpportunityZones(searchParams);
    console.log('Opportunity Zone Search API test result:', result);
    return result;
  } catch (error) {
    console.error('Opportunity Zone Search API test error:', error);
    throw error;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting RealEstateAPI endpoint tests...');
  
  try {
    await testPropertyDetail();
    await testPropertySearch();
    await testPropertyComps();
    await testMLSSearch();
    await testAutocompleteAddress();
    await testOpportunityZoneSearch();
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

// Export test functions
export {
  testPropertyDetail,
  testPropertySearch,
  testPropertyComps,
  testMLSSearch,
  testAutocompleteAddress,
  testOpportunityZoneSearch,
  runAllTests,
};
