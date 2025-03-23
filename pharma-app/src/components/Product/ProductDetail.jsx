import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1); // Initialize quantity state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=id:${id}`);
        const data = await response.json();
        const productData = data.results[0];

        if (productData) {
          setProduct({
            id: productData.id,
            name: productData.openfda.brand_name ? productData.openfda.brand_name[0] : 'N/A',
            activeIngredients: productData.openfda.active_ingredient ? productData.openfda.active_ingredient.join(', ') : 'N/A',
            drugClass: productData.openfda.pharm_class_epc ? productData.openfda.pharm_class_epc.join(', ') : 'N/A',
            indications: productData.indications_and_usage ? productData.indications_and_usage.join(' ') : 'N/A',
            price: (Math.random() * 100).toFixed(2),
            warnings: productData.warnings ? productData.warnings.join(' ') : 'N/A',
            manufacturer: productData.openfda.manufacturer_name ? productData.openfda.manufacturer_name.join(', ') : 'N/A',
            image: productData.openfda.image_url ? productData.openfda.image_url[0] : '/src/assets/logo.jpeg', // Fallback image
          });

          // Fetch related products based on the first active ingredient
          if (productData.openfda.active_ingredient) {
            const relatedResponse = await fetch(
              `https://api.fda.gov/drug/label.json?search=active_ingredient:"${productData.openfda.active_ingredient[0]}"&limit=4`
            );
            const relatedData = await relatedResponse.json();
            const relatedResults = relatedData.results || [];
            setRelatedProducts(relatedResults.map(item => ({
              id: item.id,
              name: item.openfda.brand_name ? item.openfda.brand_name[0] : 'N/A',
              image: item.openfda.image_url ? item.openfda.image_url[0] : '/src/assets/logo.jpeg',
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity; // Increment quantity if product already exists
    } else {
      cart.push({ ...product, quantity }); // Add new product with quantity
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} className="img-fluid mb-3" style={{ maxHeight: '200px' }} />
      <h4>Product Details</h4>
      <ul>
        <li><strong>Active Ingredients:</strong> {product.activeIngredients}</li>
        <li><strong>Drug Class:</strong> {product.drugClass}</li>
        <li><strong>Indications and Usage:</strong> {product.indications}</li>
        <li><strong>Warnings:</strong> {product.warnings}</li>
        <li><strong>Manufacturer:</strong> {product.manufacturer}</li>
        <li><strong>Price: ₹</strong>{product.price}</li>
      </ul>
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-secondary" onClick={handleDecrement}>-</button>
        <span className="mx-2">{quantity}</span>
        <button className="btn btn-secondary" onClick={handleIncrement}>+</button>
      </div>
      <button className="btn btn-success" onClick={addToCart}>
        Add to Cart
      </button>

      <h3>Related Products</h3>
      <div>
        {relatedProducts.length > 0 ? (
          relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} style={{ marginBottom: '15px' }}>
              <img src={relatedProduct.image} alt={relatedProduct.name} style={{ maxWidth: '100px', marginRight: '10px' }} />
              <Link to={`/productdetail/${relatedProduct.id}`}>{relatedProduct.name}</Link>
            </div>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;