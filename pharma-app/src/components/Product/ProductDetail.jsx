import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/Loader.css'; // Ensure you have styles for the loader
import products from './ProductData'; // Import consolidated product data

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const productData = products.find(p => p.id === parseInt(id)); // Find product by ID

    if (productData) {
      setProduct(productData);
      // Find related products based on category
      const related = products.filter(p => p.category === productData.category && p.id !== productData.id);
      setRelatedProducts(related.slice(0, 4)); 
    } else {
      console.error('Product not found');
    }

    setLoading(false); // Set loading to false after fetching
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert("Not enough stock available!");
      return;
    }
    addToCart(product, quantity);
    product.stock -= quantity; // Decrease stock by the quantity purchased
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div> {/* Spinner element */}
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className='text-center mb-3 fw-bold'>Product Details</h1>
      <div className="row">
        <div className="col-md-6 text-center">
          <img src={product.image} alt={product.name} className="img-fluid mb-3" />
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p><strong>Active Ingredients:</strong> {product.activeIngredients}</p>
          <p><strong>Drug Class:</strong> {product.drugClass}</p>
          <p><strong>Indications:</strong> {product.indications}</p>
          <p><strong>Warnings:</strong> {product.warnings}</p>
          <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Available Stock:</strong> {product.stock}</p>
          <div className="d-flex align-items-center mb-3">
            <input
              type="number"
              className="form-control w-25 me-2"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max={product.stock} // Limit input to available stock
            />
            <button className="btn btn-success" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>

      <h3 className="mt-4">Related Products</h3>
      <ul className="list-group">
        {relatedProducts.map((related) => (
          <li className="list-group-item" key={related.id}>
            <Link to={`/productdetail/${related.id}`}>{related.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetail;