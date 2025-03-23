import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.fda.gov/drug/label.json?search=*&limit=250');
        const data = await response.json();
        const results = data.results || [];

        // Map the results to the desired format
        const formattedResults = results.map(product => ({
          id: product.id,
          name: product.openfda.brand_name ? product.openfda.brand_name[0] : 'N/A',
          activeIngredients: product.openfda.active_ingredient ? product.openfda.active_ingredient.join(', ') : 'N/A',
          drugClass: product.openfda.pharm_class_epc ? product.openfda.pharm_class_epc.join(', ') : 'N/A',
          price: (Math.random() * 100).toFixed(2), // Placeholder for price
          category: product.openfda.substance_name ? product.openfda.substance_name[0] : 'General',
          image: product.openfda.image_url ? product.openfda.image_url[0] : '/src/assets/logo.jpeg' // Placeholder image
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

  // Get unique categories (limit to 25)
  const categories = [...new Set(products.map(p => p.category))].slice(0, 25);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Product Catalog</h2>
      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : (
        categories.map(category => (
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
        ))
      )}
    </Container>
  );
};

export default ProductList;
