import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/loader.css'; 

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true); 
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
            name: productData.openfda.brand_name?.[0] || 'N/A',
            activeIngredients: productData.openfda.active_ingredient?.join(', ') || 'N/A',
            drugClass: productData.openfda.pharm_class_epc?.join(', ') || 'N/A',
            indications: productData.indications_and_usage?.join(' ') || 'N/A',
            price: (Math.random() * 100).toFixed(2),
            warnings: productData.warnings?.join(' ') || 'N/A',
            manufacturer: productData.openfda.manufacturer_name?.join(', ') || 'N/A',
            image: productData.openfda.image_url?.[0] || '/src/assets/logo.jpeg'
          });

          if (productData.openfda.active_ingredient) {
            const relatedResponse = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.active_ingredient:"${productData.openfda.active_ingredient[0]}"`);
            const relatedData = await relatedResponse.json();
            setRelatedProducts(relatedData.results.slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div> 
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
          <div className="d-flex align-items-center mb-3">
            <input
              type="number"
              className="form-control w-25 me-2"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
            />
            <button className="btn btn-success" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>

      <h3 className="mt-4">Related Products</h3>
      <ul className="list-group">
        {relatedProducts.map((related) => (
          <li className="list-group-item" key={related.id}>
            <Link to={`/productdetail/${related.id}`}>{related.openfda.brand_name[0 ]}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetail;