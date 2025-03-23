import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery) {
        try {
          const response = await fetch(`https://api.fda.gov/drug/label.json?search=active_ingredient:"${searchQuery}"`);
          const data = await response.json();
          const results = data.results || [];

          // Map the results to the desired format
          const formattedResults = results.map(product => ({
            id: product.id, // Assuming there's an ID field
            name: product.openfda.brand_name ? product.openfda.brand_name[0] : 'N/A',
            description: product.indications_and_usage ? product.indications_and_usage.join(' ').split(' ').slice(0, 5).join(' ') + '...' : 'N/A',
            image: product.openfda.image_url ? product.openfda.image_url[0] : '/src/assets/logo.jpeg', // Fallback image
            price: Math.random() * 100, // Placeholder for price
            stock: Math.floor(Math.random() * 100), // Placeholder for stock limit
            ingredients: product.openfda.active_ingredient ? product.openfda.active_ingredient.slice(0, 5).join(', ') : 'N/A'
          }));

          setSearchResults(formattedResults);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchData();
  }, [searchQuery]);

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-3">
        <button onClick={() => navigate(-1)} className="btn btn-secondary me-2">← Back</button>
        <h2>Search Results for "{searchQuery}"</h2>
      </div>
      <hr />
      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <div key={product.id} className="product">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ₹{product.price.toFixed(2)}</p>
            <p>Stock: {product.stock}</p>
            <p>Ingredients: {product.ingredients}</p>
            <Link to={`/productdetail/${product.id}`}>
              <button>Show More</button>
            </Link>
          </div>
        ))
      ) : (
        <h3>No products found</h3>
      )}
    </div>
  );
};

export default Search;