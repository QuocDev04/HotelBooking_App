const axios = require('axios');

const testAPI = async () => {
    try {
        console.log('Testing API endpoint: http://localhost:3002/api/status/upcoming');
        
        const response = await axios.get('http://localhost:3002/api/status/upcoming');
        
        console.log('\n=== API Response ===');
        console.log('Success:', response.data.success);
        console.log('Count:', response.data.count);
        console.log('\n=== Sample Data ===');
        
        const tours = response.data.data;
        
        tours.slice(0, 5).forEach((tour, index) => {
            console.log(`\n--- Tour ${index + 1} ---`);
            console.log('DateTour ID:', tour._id);
            console.log('Tour object:', tour.tour ? 'EXISTS' : 'NULL');
            
            if (tour.tour) {
                console.log('Tour Name:', tour.tour.nameTour || 'UNDEFINED');
                console.log('Destination:', tour.tour.destination || 'UNDEFINED');
                console.log('Images:', tour.tour.imagesTour ? tour.tour.imagesTour.length : 'UNDEFINED');
            } else {
                console.log('❌ TOUR OBJECT IS NULL - This causes N/A display');
            }
            
            console.log('Date:', tour.dateTour);
            console.log('Status:', tour.status);
            console.log('Available Seats:', tour.availableSeats);
        });
        
        // Đếm số record có tour null
        const nullTourCount = tours.filter(tour => !tour.tour).length;
        console.log(`\n=== Summary ===`);
        console.log(`Total tours: ${tours.length}`);
        console.log(`Tours with NULL tour object: ${nullTourCount}`);
        console.log(`Tours with valid tour object: ${tours.length - nullTourCount}`);
        
        if (nullTourCount > 0) {
            console.log('\n❌ FOUND NULL TOUR OBJECTS - This explains the N/A display issue!');
        } else {
            console.log('\n✅ All tour objects are valid');
        }
        
    } catch (error) {
        console.error('Error testing API:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
};

testAPI();