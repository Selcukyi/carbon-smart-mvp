/**
 * Simple test runner for utility functions
 * This helps catch export/import issues early
 */

// Test that all exports are available
async function testExports() {
  console.log('🧪 Testing queryState exports...');
  
  try {
    const queryStateModule = await import('../queryState.js');
    
    const requiredExports = [
      'parseQueryParams',
      'buildQueryParams', 
      'updateQueryParams',
      'getDefaultDateRange',
      'validateDateRange',
      'parseEntityIds',
      'stringifyEntityIds',
      'getCurrentQueryParams',
      'queryState',
      'clearQueryParams'
    ];
    
    const missingExports = requiredExports.filter(exportName => 
      !(exportName in queryStateModule)
    );
    
    if (missingExports.length > 0) {
      console.error('❌ Missing exports:', missingExports);
      return false;
    }
    
    console.log('✅ All exports available');
    return true;
  } catch (error) {
    console.error('❌ Error loading module:', error.message);
    return false;
  }
}

// Test basic functionality
async function testBasicFunctionality() {
  console.log('🧪 Testing basic functionality...');
  
  try {
    const { queryState, parseQueryParams, buildQueryParams } = await import('../queryState.js');
    
    // Test queryState function
    const result = queryState('?start_date=2025-01-01&end_date=2025-12-31&entity_ids=1,2');
    if (!result.start_date || !result.end_date || !result.entity_ids) {
      throw new Error('queryState function not working correctly');
    }
    
    // Test parseQueryParams
    const searchParams = new URLSearchParams('?start_date=2025-01-01&tab=overview');
    const parsed = parseQueryParams(searchParams);
    if (parsed.start_date !== '2025-01-01' || parsed.tab !== 'overview') {
      throw new Error('parseQueryParams function not working correctly');
    }
    
    // Test buildQueryParams
    const built = buildQueryParams({ test: 'value' });
    if (built.get('test') !== 'value') {
      throw new Error('buildQueryParams function not working correctly');
    }
    
    console.log('✅ Basic functionality working');
    return true;
  } catch (error) {
    console.error('❌ Functionality test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Running queryState utility tests...\n');
  
  const exportTest = await testExports();
  const functionalityTest = await testBasicFunctionality();
  
  console.log('\n📊 Test Results:');
  console.log(`Exports: ${exportTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Functionality: ${functionalityTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (exportTest && functionalityTest) {
    console.log('\n🎉 All tests passed!');
    return true;
  } else {
    console.log('\n💥 Some tests failed!');
    return false;
  }
}

// Export for use in other test files
export {
  testExports,
  testBasicFunctionality,
  runTests
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}