import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/tours')
      .then((response) => response.json())
      .then((data) => setTours(data))
      .catch((error) => console.error('Error fetching tours:', error));
  }, []);

  return (
     <div className="font-sans text-gray-800">
        
     </div>
    );
};

export default Home;