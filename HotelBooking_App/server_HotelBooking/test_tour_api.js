// Test script để kiểm tra tour data
const axios = require('axios');

async function testTourAPI() {
  try {
    // Test 1: Kiểm tra server có chạy không
    console.log('Testing server connection...');
    const serverResponse = await axios.get('http://localhost:8080/');
    console.log('Server response:', serverResponse.data);

    // Test 2: Kiểm tra có tour nào trong database không
    console.log('\nTesting tour list...');
    const toursResponse = await axios.get('http://localhost:8080/api/tour');
    console.log('Tours response:', toursResponse.data);

    if (toursResponse.data.tours && toursResponse.data.tours.length > 0) {
      const firstTour = toursResponse.data.tours[0];
      console.log('First tour ID:', firstTour._id);
      console.log('First tour name:', firstTour.nameTour);

      // Test 3: Kiểm tra tour detail
      console.log('\nTesting tour detail...');
      const tourDetailResponse = await axios.get(`http://localhost:8080/api/tour/${firstTour._id}`);
      console.log('Tour detail response:', tourDetailResponse.data);
    } else {
      console.log('No tours found in database');
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testTourAPI();
