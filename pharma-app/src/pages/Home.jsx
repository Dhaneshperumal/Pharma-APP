import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/home.css'; 
import { BiPhoneCall } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button } from "react-bootstrap";

const Home = () => {
  const [counter, setCounter] = useState(0);
  const [randomProducts, setRandomProducts] = useState([]);
  const [randomPopular, setRandomPopular] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]); // Initialize products state
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev >= 3 ? 0 : prev + 1)); 
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const radio = document.getElementById(`radio${counter}`);
    if (radio) {
      radio.checked = true;
    }
  }, [counter]);

  // Fetching random products from the FDA API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.fda.gov/drug/label.json?search=active_ingredient:"ibuprofen"&limit=50');
        const data = await response.json();
        const results = data.results || [];

        // Map the results to the desired format
        const formattedResults = results.map((product) => ({
          id: product.id,
          name: product.openfda.brand_name ? product.openfda.brand_name[0] : 'N/A',
          description: product.indications_and_usage ? product.indications_and_usage.join(' ').split(' ').slice(0, 5).join(' ') + '...' : 'N/A',
          image: product.openfda.image_url ? product.openfda.image_url[0] : '/src/assets/logo.jpeg', // Fallback image
          price: Math.random() * 100, // Placeholder for price
          stock: Math.floor(Math.random() * 100), // Placeholder for stock limit
          ingredients: product.openfda.active_ingredient ? product.openfda.active_ingredient.slice(0, 5).join(', ') : 'N/A'
        }));

        setRandomProducts(formattedResults.slice(0, 4)); // Pick 4 random products for the slider
        setRandomPopular(formattedResults); // All fetched products for the popular section
        setProducts(formattedResults); // Set products state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=active_ingredient:"${searchQuery}"`);
        const data = await response.json();
        const results = data.results || [];

        // Map the results to the desired format
        const formattedResults = results.map(product => ({
          id: product.id,
          name: product.openfda.brand_name ? product.openfda.brand_name[0] : 'N/A',
          description: product.indications_and_usage ? product.indications_and_usage.join(' ').split(' ').slice(0, 5).join(' ') + '...' : 'N/A',
          image: product.openfda.image_url ? product.openfda.image_url[0] : '/src/assets/logo.jpeg', // Fallback image
          price: Math.random() * 100, // Placeholder for price
          stock: Math.floor(Math.random() * 100), // Placeholder for stock limit
          ingredients: product.openfda.active_ingredient ? product.openfda.active_ingredient.slice(0, 5).join(', ') : 'N/A'
        }));

        setSearchResults(formattedResults);
        navigate(`/search?query=${searchQuery}`); // Redirect to search results
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.fda.gov/drug/label.json?limit=20');
        const data = await response.json();
        const results = data.results || [];

        // Extract unique categories from the results
        const uniqueCategories = [...new Set(results.map(product => product.openfda.substance_name ? product.openfda.substance_name[0] : 'General'))];
        setCategories(uniqueCategories);
        setProducts(results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, []);


  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const filteredProducts = activeCategory 
    ? products.filter(product => product.openfda.substance_name && product.openfda.substance_name[0] === activeCategory)
    : products;

  return (
    <>
      <div className="search mt-5 text-center" style={{ backgroundImage: `url('/src/assets/logo.jpeg')` }}>
        <h2>Say Goodbye to High Medicine Prices</h2>
        <p>Compare Prices and Save up to 15%</p>
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="search" 
            placeholder="Search for products" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type ="submit">Search</button>
        </form>
      </div>

      <h3 className="text-center mt-5">PLACE YOUR ORDER</h3>
      <div className="text-center mt-4 mb-5 place">
        <Link className="me-4 mb-3" to={'/'}><Button className="fw-bold"><BiPhoneCall className="me-1 fs-5"  />Call to place order</Button></Link>
        <Link to={'/upload'}><Button className="fw-bold"><FaCloudUploadAlt  className="me-1 fs-5"/>Upload your prescription</Button></Link>
      </div>

      <div className="slider">
        <div className="slides">
          <input type="radio" name="radio-btn" id="radio0" defaultChecked />
          <input type="radio" name="radio-btn" id="radio1" />
          <input type="radio" name="radio-btn" id="radio2" />
          <input type="radio" name="radio-btn" id="radio3" />

          {randomProducts.map((product, index) => (
            <div className={`slide slide-${index}`} key={product.id}>
              <img src={product.image} alt={product.name} />
            </div>
          ))}

          <div className="navigation-auto">
            <div className="auto-btn1"></div>
            <div className="auto-btn2"></div>
            <div className="auto-btn3"></div>
            <div className="auto-btn4"></div>
          </div>
        </div>

        <div className="navigation-manual">
          {randomProducts.map((_, index) => (
            <label key={index} htmlFor={`radio${index}`} className="manual-btn"></label>
          ))}
        </div>
      </div>

      <div className="producthead">
        <h2>Our Featured Products</h2>
        <hr />
      </div>

      <div className="products">
        {randomProducts.map((product) => (
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
        ))}
      </div>

      {/* Offer Section */}
      <div>
        <div className="content-box"></div>
        <div className="content">
          <h4>Limited Time Offer</h4>
          <h3>Special Edition</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
          <h4>Buy This Guns At 20% Discount, Use Code OFF20</h4>
          <button>SHOP NOW</button>
        </div>
      </div>

      {/* Categories */}
      <div className="container mt-5">
        <div className="d-flex">
          <div className="sidebar me-2">
            <h2>Shop by Category</h2>
            <ul className="list-group mt-5">
              {categories.map((category, index) => (
                <li 
                  key={index} 
                  className={`list-group-item ${activeCategory === category ? 'active' : ''}`} 
                  onClick={() => handleCategoryClick(category)}
                  style={{ cursor: 'pointer', backgroundColor: activeCategory === category ? '#c3fad8' : 'white' }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="products">
            <h2 className="mb-4 text-center">{activeCategory ? activeCategory : 'All Products'}</h2>
            <div className="row">
              {filteredProducts.slice(0, 6).map((product) => (
                <div className="col-md-4  mb-4 " t key={product.id}>
                  <div className="card mt-5">
                  <img src={product.openfda && product.openfda.image_url ? product.openfda.image_url[0] : '/src/assets/logo.jpeg'} alt={'N/A'}  />
                    <div className="card-body">
                    <h5>{product.openfda && product.openfda.brand_name ? product.openfda.brand_name[0] : 'N/A'}</h5>
                      <p className="card-text">
                        Price: ₹{Math.random() * 100}<br />
                        {product.indications_and_usage ? product.indications_and_usage.join(' ').split(' ').slice(0, 5).join(' ') + '...' : 'N/A'}
                      </p>
                      <Link to={`/productdetail/${product.id}`} className="catbtn ">
                        <button>View Details</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular items */}
      <div className="producthead">
        <h2>Popular Items</h2>
        <hr />
      </div>

      <div className="sliders container">
        <div className="slidess">
          {randomPopular.map((product, index) => (
            <React.Fragment key={product.id}>
              <input type="radio" name="radio-btns" id={`radio${index}`} defaultChecked={index === 0} />
              <div className={`slidesss first popular slides-${index}`}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description.split(' ').slice(0, 5).join(' ') + '...'}</p>
                <div className="d-flex popbtn">
                  <p>Price: ₹{product.price.toFixed(2)}</p>
                  <Link to={`/productdetail/${product.id}`}>
                    <button className="btn btn-primary">Add</button>
                  </Link>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="navigation-manuals">
          {randomPopular.map((_, index) => (
            <label key={index} htmlFor={`radio${index}`} className="manual-btns"></label>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;