import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Loader.css'; // Import CSS for the circular loader

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1); // Initialize quantity state
  const [loadingPercentage, setLoadingPercentage] = useState(0); // Track loading progress
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const interval = setInterval(() => {
          setLoadingPercentage((prev) => {
            if (prev >= 100) return 100;
            return prev + 20; // Increment percentage by 20
          });
        }, 500); // Update every 500ms

        const response = await fetch(`https://api.fda.gov/drug/label.json?search=id:${id}`);
        clearInterval(interval); // Clear interval once the product is fetched
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
              `https://api.fda.gov/dr ug/label.json?search=openfda.active_ingredient:"${productData.openfda.active_ingredient[0]}"`
            );
            const relatedData = await relatedResponse.json();
            setRelatedProducts(relatedData.results.slice(0, 4)); // Get first 4 related products
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p><strong>Active Ingredients:</strong> {product.activeIngredients}</p>
      <p><strong>Drug Class:</strong> {product.drugClass}</p>
      <p><strong>Indications:</strong> {product.indications}</p>
      <p><strong>Warnings:</strong> {product.warnings}</p>
      <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        style={{ width: '60px' }}
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
      <h3>Related Products</h3>
      <ul>
        {relatedProducts.map((related) => (
          <li key={related.id}>
            <Link to={`/productdetail/${related.id}`}>{related.openfda.brand_name[0]}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetail;