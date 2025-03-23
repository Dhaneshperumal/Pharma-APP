import React, { useState, useEffect } from 'react'; 
import { Navbar, Container, Nav, Form, Button, Offcanvas } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/navbar.css'; 

const Navbars = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const categories = ['/productlist', '/productdetail',  '/cart'];

  useEffect(() => {
    // Check authentication on each render
    setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=active_ingredient:"${searchQuery}"&limit=10`);
        const data = await response.json();
        const results = data.results || [];

        // Format the results
        const formattedResults = results.map(product => ({
          id: product.id, // Assuming there's an ID field
          name: product.openfda.brand_name ? product.openfda.brand_name[0] : 'N/A',
          description: product.indications_and_usage ? product.indications_and_usage.join(' ').split(' ').slice(0, 5).join(' ') + '...' : 'N/A',
          image: product.openfda.image_url ? product.openfda.image_url[0] : '/src/assets/logo.jpeg', // Fallback image
        }));

        setSearchResults(formattedResults);
        navigate('/search', { state: { results: formattedResults } }); // Navigate to search page with results
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <>
      <Navbar expand='lg' className='navbar navhead d-none d-lg-flex'>
        <Container>
          <Navbar.Brand className='navhome text-dark fs-4' as={Link} to='/'>MediMart</Navbar.Brand>
          {categories.includes(location.pathname) && (
            <Form className='d-flex navb ms-auto' onSubmit={handleSearchSubmit}>
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
          <Form className='d-flex'>
            {!isAuthenticated ? (
              <>
                <Link to='/login'><Button variant='outline-dark' className='me-2'>Login</Button></Link>
                <Link to='/signup'><Button variant='outline-dark' className='me-2'>Signup</Button></Link>
              </>
            ) : (
              <>
                <Button variant='outline-light' className='me-2' onClick={handleLogout}>Logout</Button>
                <Link to='/addtocart'><Button variant='outline-light' className='me-2'>Cart</Button></Link>
                <Link to='/profile'><Button variant='outline-dark' className='me-2'>Profile</Button></Link>
              </>
            )}
          </Form>
        </Container>
      </Navbar>

      <Navbar expand='lg' className='navbar navhead d-lg-none' style={{ backgroundColor: '#222', color: 'white' }}>
        <Container>
          <Navbar.Brand className='text-white' as={Link} to='/'>MediMart</Navbar.Brand>
          <div className='d-flex align-items-center'>
            <Link to='/addtocart'>
              <Button variant='link' className='text-white' style={{ textDecoration: 'none' }}>🛒</Button>
            </Link>
            <Link to='/search'>
              <Button variant='link' className='text-white' style={{ textDecoration: 'none' }}>🔍</Button>
            </Link>
            <Button variant='link' className='text-white' onClick={() => setShowMenu(true)} style={{ textDecoration: 'none' }}>☰</Button>
          </div>
        </Container>
      </Navbar>

      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement='end' style={{ backgroundColor: '#222', color: 'white' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-white'>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='text-center'>
          <Nav className='flex-column'>
            <Nav.Link as={Link} to='/' className='text-white' onClick={() => setShowMenu(false)}>Home</Nav.Link>
            {categories.map((category) => (
              <Nav.Link key={category} as={Link} to={category} className='text-white' onClick={() => setShowMenu(false)}>
                {category.replace('/', '')}
              </Nav.Link>
            ))}
          </Nav>
          {!isAuthenticated ? (
            <>
              <Link to='/login'><Button variant='outline-light' className='me-2' onClick={() => setShowMenu(false)}>Login</Button></Link>
              <Link to='/signup'><Button variant='outline-light' className='me-2' onClick={() => setShowMenu(false)}>Signup</Button></Link>
            </>
          ) : (
            <>
              <Button variant='outline-light' className='me-2' onClick={handleLogout}>Logout</Button>
              <Link to='/addtocart'>
                <Button variant='outline-light' className='me-2' onClick={() => setShowMenu(false)}>Cart</Button>
              </Link>
              <Link to='/profile'>
                <Button variant='outline-light' className='me-2' onClick={() => setShowMenu(false)}>Profile</Button>
              </Link>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <hr className='hr' />

      {!isAuthPage && (
        <Nav className='justify-content-center navbar navitem d-none d-lg-flex'>
          <Nav.Item>
            <Nav.Link as={Link} to='/' className={location.pathname === '/' ? 'active ' : ''}>Home</Nav.Link>
          </Nav.Item>
          {categories.map((category) => (
            <Nav.Item key={category}>
              <Nav.Link as={Link} to={category} className={location.pathname === category ? 'active' : ''}>
                {category.replace('/', '')}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      )}
    </>
  );
};

export default Navbars;