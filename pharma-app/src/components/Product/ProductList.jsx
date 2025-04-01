import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../../styles/Loader.css'; 

import products from './ProductData'; // Import consolidated product data

const ProductList = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false); // Set loading to false immediately
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="loader-container">
        <div className="circle-loader">
        </div>
        <div className="spinner"></div>
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
            {products.filter(p => p.category === category).map(product => (
              <Col md={4} className="mb-4" key={product.id}>
                <Card>
                  <Card.Img variant="top" src={product.image} alt={product.name} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      Description: {product.description}<br />
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
