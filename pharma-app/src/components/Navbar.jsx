import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Form, Button, Offcanvas, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbars = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInHeader, setShowSearchInHeader] = useState(false);
  const [cartItems, setCartItems] = useState(3); // Replace with dynamic data if needed
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const categories = ['/productlist', '/productdetail', '/cart'];
  

  useEffect(() => {
    // Check authentication on each render
    setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');

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
                onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>
      )}

      

      {/* Main Navbar */}
      <Navbar expand="lg" className="navbar navhead d-none d-lg-flex">
        <Container>
          <Navbar.Brand className="navhome text-dark fs-4" as={Link} to="/">MediMart</Navbar.Brand>
          {categories.includes(location.pathname) && (
            <Form className="d-flex navb ms-auto" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-dark me-3" type="submit">Search</Button>
            </Form>
          )}
          <Form className="d-flex">
            {!isAuthenticated ? (
              <>
                <Link to="/login"><Button variant="outline-dark" className="me-2">Login</Button></Link>
                <Link to="/signup"><Button variant="outline-dark" className="me-2">Signup</Button></Link>
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

{/* shittyy */}

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
        <Nav.Link as={Link} to="/productdetail" className={location.pathname === '/productdetail' ? 'active' : ''}>
          ProductDetail
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
