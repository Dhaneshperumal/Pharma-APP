import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../../styles/loader.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const interval = setInterval(() => {
          setLoadingPercentage((prev) => {
            if (prev >= 100) return 100;
            return prev + 20;
          });
        }, 500); 

        const response = await fetch('https://api.fda.gov/drug/label.json?search=*&limit=250');
        clearInterval(interval); 
        const data = await response.json();
        const results = data.results || [];

        const formattedResults = results.map(product => ({
          id: product.id,
          name: product.openfda.brand_name ? product.openfda.brand_name[0] : 'N/A',
          activeIngredients: product.openfda.active_ingredient ? product.openfda.active_ingredient.join(', ') : 'N/A',
          drugClass: product.openfda.pharm_class_epc ? product.openfda.pharm_class_epc.join(', ') : 'N/A',
          price: (Math.random() * 100).toFixed(2),
          category: product.openfda.substance_name ? product.openfda.substance_name[0] : 'General',
          image: product.openfda.image_url ? product.openfda.image_url[0] : '/src/assets/logo.jpeg',
        }));

        setProducts(formattedResults);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(p => p.category))].slice(0, 25);
  
  if (loading) {
    return (
      <div className="loader-container">
        <div className="circle-loader">
          {/* <div className="circle" style={{ '--percentage': `${loadingPercentage}%` }}></div> */}
        </div>
        <div className="spinner"></div> 
        {/* <p>Loading products... {loadingPercentage}%</p> */}
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Product Catalog</h1>
      {categories.map(category => (
        <div key={category}>
          <h3 className="mt-4">{category}</h3>
          <Row>
            {products.filter(p => p.category === category).slice(0, 6).map(product => (
              <Col md={4} className="mb-4" key={product.id}>
                <Card>
                  <Card.Img variant="top" src={product.image} alt={product.name} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      Active Ingredients: {product.activeIngredients}<br />
                      Drug Class: {product.drugClass}<br />
                      Price: ₹{product.price}
                    </Card.Text>
                    <Link to={`/productdetail/${product.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <hr />
        </div>
      ))}
    </Container>
  );
};

export default ProductList;
