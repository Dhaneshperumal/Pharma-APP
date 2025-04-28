import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Form, Button, Offcanvas, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../pages/SearchBar'; // Import the SearchBar component
import '../styles/navbar.css';

const Navbars = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInHeader, setShowSearchInHeader] = useState(false);
  const [cartItems, setCartItems] = useState(0); // Initialize cartItems
  const [suggestions, setSuggestions] = useState([]);
  // Removed unused variable 'isAuthPage' to fix the compile error
  const categories = ['/productlist', '/productdetail', '/cart'];

  useEffect(() => {
    // Check authentication on each render
    setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');

    // Load cart items from local storage
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems.length); // Set the number of items in the cart

    // Add scroll listener to toggle search bar visibility
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowSearchInHeader(true);
      } else {
        setShowSearchInHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Fetch suggestions based on the query
    if (query) {
      // Replace this with your actual API call or logic to get suggestions
      const fetchedSuggestions = ['Ibuprofen', 'Paracetamol', 'Aspirin', 'Amoxicillin', 'Ciprofloxacin'].filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(fetchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <>
      {/* Sticky Header Search Bar */}
      {showSearchInHeader && (
        <div
          className="header-search"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#f8f9fa',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Container className="d-flex justify-content-between align-items-center">
            <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold', fontSize: '25px', color: 'black' }}>
              MediMart
            </Navbar.Brand>
            <Form className="d-flex flex-grow-1 justify-content-center" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  padding: '10px',
                  width: '300px',
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                }}
              />
              <Button variant="outline-dark" type="submit" style={{ padding: '10px 20px', borderRadius: '20px' }}>
                Search
              </Button>
            </Form>
            <Link to="/cart" style={{ textDecoration: 'none', color: '#000' }}>
              🛒 <Badge bg="secondary">{cartItems}</Badge>
            </Link>
          </Container>
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown" style={{ position: 'absolute', zIndex: 1000, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px', width: '300px', marginTop: '5px' }}>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)} style={{ padding: '10px', cursor: 'pointer' }}>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <Navbar expand="lg" className="navbar navhead d-none d-lg-flex">
        <Container>
          <Navbar.Brand className="navhome text-dark fs-4" as={Link} to="/">MediMart</Navbar.Brand>
          {categories.includes(location.pathname) && (
            <SearchBar onSearch={handleSearchSubmit} /> 
          )}
          <Form className="d-flex">
            {!isAuthenticated ? (
              <>
                <Link to="/login"><Button variant="outline-dark" className="me-2">Login/Signup</Button></Link>
                {/* <Link to="/signup"><Button variant="outline-dark" className="me-2">Signup</Button></Link> */}
              </>
            ) : (
              <>
                <Button variant="outline-light" className="me-2" onClick={handleLogout}>Logout</Button>
                <Link to="/addtocart">
                  <Button variant="outline-light" className="me-2">
                    Cart <Badge bg="secondary">{cartItems}</Badge>
                  </Button>
                </Link>
                <Link to="/profile"><Button variant="outline-dark" className="me-2">Profile</Button></Link>
              </>
            )}
          </Form>
        </Container>
      </Navbar>

      {/* Mobile Navbar */}
      <Navbar expand="lg" className="navbar navhead d-lg-none" style={{ backgroundColor: '#222', color: 'white' }}>
        <Container>
          <Navbar.Brand className="text-white" as={Link} to="/">MediMart</Navbar.Brand>
          <div className="d-flex align-items-center">
            <Link to="/addtocart" style={{ textDecoration: 'none', color: 'white' }}>
              🛒<Badge bg="light">{cartItems}</Badge>
            </Link>
            <Button variant="link" className="text-white" onClick={() => setShowMenu(true)} style={{ textDecoration: 'none' }}>☰</Button>
          </div>
        </Container>
      </Navbar>

      <hr className="hr" />

      <Nav className="justify-content-center navbar navitem d-none d-lg-flex">
        
      <Nav.Item>
        <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/productlist" className={location.pathname === '/productlist' ? 'active' : ''}>
          ProductList
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
          Cart
        </Nav.Link>
      </Nav.Item>
    </Nav>


      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end" style={{ backgroundColor: '#222', color: 'white' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-white">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="text-center">
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" className="text-white" onClick={() => setShowMenu(false)}>Home</Nav.Link>
            {categories.map((category) => (
              <Nav.Link key={category} as={Link} to={category} className="text-white" onClick={() => setShowMenu(false)}>
                {category.replace('/', '')}
              </Nav.Link>
            ))}
          </Nav>
          {!isAuthenticated ? (
            <>
              <Link to="/login"><Button variant="outline-light" className="me-2" onClick={() => setShowMenu(false)}>Login</Button></Link>
              <Link to="/signup"><Button variant="outline-light" className="me-2" onClick={() => setShowMenu(false)}>Signup</Button></Link>
            </>
          ) : (
            <>
              <Button variant="outline-light" className="me-2" onClick={handleLogout}>Logout</Button>
              <Link to="/addtocart">
                <Button variant="outline-light" className="me-2" onClick={() => setShowMenu(false)}>Cart</Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline-light" className="me-2" onClick={() => setShowMenu(false)}>Profile</Button></Link>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Navbars;