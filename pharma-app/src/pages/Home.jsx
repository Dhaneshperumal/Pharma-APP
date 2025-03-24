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
  const navigate = useNavigate();
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

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


    const [showLeftButton, setShowLeftButton] = useState(false); 

    function handleScroll() {
      const container = document.getElementById("popular-items-container");
      if (container.scrollLeft > 0) {
        setShowLeftButton(true); // Show left button when scrolled right
      } else {
        setShowLeftButton(false); // Hide left button when at the start
      }
    }
    
    function smoothScroll(direction) {
      const container = document.getElementById("popular-items-container");
      const scrollAmount = 300; // Distance to scroll per button click
      const scrollStep = 10; // Smaller increments for smoother motion
      const totalSteps = scrollAmount / scrollStep;
      let currentStep = 0;
    
      function scrollFrame() {
        if (currentStep < totalSteps) {
          container.scrollBy({ left: direction * scrollStep, behavior: "auto" });
          currentStep += 1;
          requestAnimationFrame(scrollFrame);
        }
      }
    
      scrollFrame();
    }

    const testimonials = [
      {
        highlight: "Doctors are very professional and customer friendly.",
        message: "Perfect. The more I use this app, the more I fall in love with it. Doctors are very professional and customer friendly.",
        author: "Subhash Sehgal",
      },
      {
        highlight: "Used the app and found it easy to use.",
        message: "Excellent app. Have used this regularly and found it very easy to use. All info is readily available and the response after order placement for validation of medicines required was prompt.",
        author: "Snehal Shah",
      },
      {
        highlight: "Best, very customer-friendly app.",
        message: "Truemeds is the best... during the lockdown, this app did not reduce the discount, which shows the customer-friendly nature of TrueMeds.",
        author: "Laksh Kankariya",
      },
      {
        highlight: "Truly affordable medicines.",
        message: "Affordable medicines on this app. Truemeds is true.",
        author: "Zahiruddin Warekar",
      },
      {
        highlight: "Quick delivery and great service.",
        message: "I received my medicines on time and at a much lower cost. The service is excellent!",
        author: "Sumit Kumar",
      },
      {
        highlight: "User-friendly interface.",
        message: "The app is very easy to navigate, and the customer support team is always helpful.",
        author: "Ashish Bhatia",
      },
      {
        highlight: "Highly recommended for everyone.",
        message: "I’ve been using Truemeds for a while now, and it has never disappointed me. Great discounts and reliable service.",
        author: "Dada Bhai",
      },
    ];     

    function handleScrollTestimonials() {
      const container = document.getElementById("testimonials-container");
      if (container.scrollLeft > 0) {
        setShowLeftButton(true); // Show left button if scroll position > 0
      } else {
        setShowLeftButton(false); // Hide left button when at the start
      }
    }

    function smoothScrollTestimonials(direction) {
      const container = document.getElementById("testimonials-container");
      const scrollAmount = 300; // Distance to scroll per click
      const scrollStep = 10; // Small increments for smoothness
      const totalSteps = scrollAmount / scrollStep;
      let currentStep = 0;
    
      function scrollFrame() {
        if (currentStep < totalSteps) {
          container.scrollBy({ left: direction * scrollStep, behavior: "auto" });
          currentStep += 1;
          requestAnimationFrame(scrollFrame); // Creates smooth animation
        }
      }
    
      scrollFrame();
    }
    
    const handlePincodeSubmit = async () => {
      if (pincode.length === 6) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${pincode}&format=json`
          );
          const data = await response.json();
          if (data && data[0]) {
            setLocation(data[0].display_name);
            setPopupVisible(false); // Close popup after selecting location
          } else {
            alert("Unable to fetch location for the given PIN code.");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      } else {
        alert("Please enter a valid 6-digit PIN code.");
      }
    };
    
    const handleCurrentLocation = async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data && data.display_name) {
              setLocation(data.display_name);
              setPopupVisible(false); // Close popup after fetching location
            } else {
              alert("Unable to fetch location for your current position.");
            }
          } catch (error) {
            console.error("Error fetching location from current position:", error);
          }
        }, (error) => {
          console.error("Error accessing current location:", error);
          alert("Unable to fetch your current location.");
        });
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    };

    

  return (
    <>
  <>
    <div
      className="search mt-5 text-center p-5"
      style={{backgroundImage: `url('/src/assets/logo.jpeg')`,backgroundSize: 'cover',backgroundPosition: 'center',color: 'white',borderRadius: '10px',
      }}
    >
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'black' }}>
        Say Goodbye to High Medicine Prices
      </h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'black' }}>
        Compare Prices and Save up to 15%
      </p>
      <form onSubmit={handleSearchSubmit} className="d-flex justify-content-center align-items-center">
        {/* Deliver To Dropdown */}
        <div className="dropdown me-2" style={{ position: 'relative' }}>
          <button
            className="btn btn-light"
            type="button"
            onClick={() => setPopupVisible(!popupVisible)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '15px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
            }}
          >
            Deliver to
          </button>
          
          {popupVisible && (
            <div
              className="popup-container"
              style={{
                position: 'absolute',
                top: '50px',
                left: '0',
                right: '0',
                margin: 'auto',
                backgroundColor: "white",
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '300px',
                zIndex: 10,
              }}
            >
              <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>Select Delivery Location</h4>
              <input
                type="text"
                placeholder="Enter PIN Code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="form-control mb-3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '15px',
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handlePincodeSubmit();
                }}
                className="btn btn-primary mb-2"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Submit PIN Code
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCurrentLocation();
                }}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Use Current Location
              </button>
            </div>
          )}
        </div>
        
        {/* Search Input */}
        <input
          type="search"
          placeholder="Search for products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '15px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        {/* Search Button */}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '15px',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>
      {location && (
        <p style={{ fontSize: '1rem', marginTop: '15px', color: '#333' }}>
          Current Location: <strong>{location}</strong>
        </p>
      )}
    </div>
  </>
      <h3 className="text-center mt-5">PLACE YOUR ORDER</h3>
      <div className="text-center mt-4 mb-5 place">
        <Link className="me-4 mb-3" to={'/'}><Button className="fw-bold"><BiPhoneCall className="me-1 fs-5"  />Call to place order</Button></Link>
        <Link to={'/upload'}><Button className="fw-bold"><FaCloudUploadAlt  className="me-1 fs-5"/>Upload your prescription</Button></Link>
      </div>

      <div className="slider">
            <div className="slides">
              <input type="radio" name="radio-btn" id="radio1" />
              <input type="radio" name="radio-btn" id="radio2" />
              <input type="radio" name="radio-btn" id="radio3" />
              <input type="radio" name="radio-btn" id="radio4" />

              <div className="slide first">
                <img src="/src/assets/banner1.jpg" alt="1" />
              </div>
              <div className="slide second">
                <img src="/src/assets/banner2.jpg" alt="2" />
              </div>
              <div className="slide third">
                <img src="/src/assets/banner1.jpg" alt="3" />
              </div>
              <div className="slide four">
                <img src="/src/assets/banner2.jpg" alt="4" />
              </div>

              <div className="navigation-auto">
                <div className="auto-btn1"></div>
                <div className="auto-btn2"></div>
                <div className="auto-btn3"></div>
                <div className="auto-btn4"></div>
              </div>
            </div>
            <div className="navigation-manual">
              <label htmlFor="radio1" className="manual-btn"></label>
              <label htmlFor="radio2" className="manual-btn"></label>
              <label htmlFor="radio3" className="manual-btn"></label>
              <label htmlFor="radio4" className="manual-btn"></label>
            </div>
          </div>

      <div className="producthead">
        <h2>Our Featured Products</h2>
        <hr />
      </div>

      <div className="productss">
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
      <div className="offer-section">
        <div className="content-box"></div>
        <div className="content">
          <h4>Limited Time Offer</h4>
          <h3>Special Edition</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
          <h4>Buy Featured Medicines At 20% Discount, Use Code OFF20</h4>
          <button>SHOP NOW</button>
        </div>
      </div>


      {/* Categories */}
      <div className="container mt-5">
  <div className="d-flex flex-column flex-md-row">
    {/* Sidebar */}
    <div className="sidebar me-2 mb-4 mb-md-0">
      <h2>Shop by Category</h2>
      <ul className="list-group mt-3">
        {categories.map((category, index) => (
          <li
            key={index}
            className={`list-group-item ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
            style={{
              cursor: 'pointer',
              backgroundColor: activeCategory === category ? '#c3fad8' : 'white',
            }}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>

    {/* Products */}
    <div className="products flex-fill">
      <h2 className="mb-4 text-center">{activeCategory || 'All Products'}</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {filteredProducts.slice(0, 6).map((product) => (
          <div className="col" key={product.id}>
            <div className="card h-100">
              <img
                src={
                  product.openfda && product.openfda.image_url
                    ? product.openfda.image_url[0]
                    : '/src/assets/logo.jpeg'
                }
                alt="N/A"
                className="card-img-top"
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">
                  {product.openfda && product.openfda.brand_name
                    ? product.openfda.brand_name[0]
                    : 'N/A'}
                </h5>
                <p className="card-text">
                  Price: ₹{Math.random() * 100}
                  <br />
                  {product.indications_and_usage
                    ? product.indications_and_usage.join(' ').split(' ').slice(0, 5).join(' ') + '...'
                    : 'N/A'}
                </p>
                <Link to={`/productdetail/${product.id}`} className="catbtn">
                  <button className="btn btn-primary w-100">View Details</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>


{/* Popular Items */}
      <div className="producthead">
        <h2>Popular Items</h2>
        <hr />
      </div>

      <div className="scroll-container">
        {/* Conditional rendering for the left button */}
        {showLeftButton && (
          <button className="scroll-btn left-btn" onClick={() => smoothScroll(-1)}>
            &lt;
          </button>
        )}
        <div 
          className="scroll-content" 
          id="popular-items-container" 
          onScroll={handleScroll}
        >
          {randomPopular.map((product) => (
            <div key={product.id} className="scroll-item">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description.split(' ').slice(0, 5).join(' ') + '...'}</p>
              <p>Price: ₹{product.price.toFixed(2)}</p>
              <Link to={`/productdetail/${product.id}`}>
                <button className="btn btn-primary">Add</button>
              </Link>
            </div>
          ))}
        </div>
        <button className="scroll-btn right-btn" onClick={() => smoothScroll(1)}>
          &gt;
        </button>
      </div>

{/* What Our Customers Have to Say */}
<div className="testimonials-section">
  <h2>What Our Customers Have to Say</h2>
  <hr className="testimonials-underline" />
  <div className="scroll-container">
    {/* Left Button (conditionally rendered) */}
    {showLeftButton && (
      <button className="scroll-btn left-btn" onClick={() => smoothScrollTestimonials(-1)}>
        &lt;
      </button>
    )}
    <div 
      className="scroll-content" 
      id="testimonials-container" 
      onScroll={handleScrollTestimonials}
    >
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial">
          <p className="testimonial-highlight">
            <strong>{testimonial.highlight}</strong>
          </p>
          <p className="testimonial-message">{testimonial.message}</p>
          <h4 className="testimonial-author">- {testimonial.author}</h4>
        </div>
      ))}
    </div>
    {/* Right Button */}
    <button className="scroll-btn right-btn" onClick={() => smoothScrollTestimonials(1)}>
      &gt;
    </button>
  </div>
</div>




    </>
  );
};

export default Home;