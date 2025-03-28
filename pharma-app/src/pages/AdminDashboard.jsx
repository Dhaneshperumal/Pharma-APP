import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    image: null, // Change to hold file object
    name: '',
    description: '',
    stock: 0,
    uses: '',
    price: 0,
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch users and orders from your API
    const fetchUsers = async () => {
      // Replace with your API endpoint
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    };

    const fetchOrders = async () => {
      // Replace with your API endpoint
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    };

    fetchUsers();
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      image: e.target.files[0], // Store the file object
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', newProduct.image);
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);
    formData.append('uses', newProduct.uses);
    formData.append('price', newProduct.price);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts((prev) => [...prev, addedProduct]);
        setNewProduct({
          image: null,
          name: '',
          description: '',
          stock: 0,
          uses: '',
          price: 0,
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  
//Local storage handling for products and orders
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Use local storage for products and orders
useEffect(() => {
  const storedProducts = loadFromLocalStorage('products');
  const storedOrders = loadFromLocalStorage('orders');
  setProducts(storedProducts);
  setOrders(storedOrders);
}, []);

useEffect(() => {
  saveToLocalStorage('products', products);
}, [products]);

useEffect(() => {
  saveToLocalStorage('orders', orders);
}, [orders]);

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <p>Manage users, products, and orders.</p>

      <h3>Users Information</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Add New Product</h3>
      <Form onSubmit={handleAddProduct}>
        <Form.Group controlId="formImage">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleImageChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formStock">
          <Form.Label>Stock Limit</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formUses">
          <Form.Label>Uses</Form.Label>
          <Form.Control
            type="text"
            name="uses"
            value={newProduct.uses}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" className='mt-3 mb-2' type="submit">
          Add Product
        </Button>
      </Form>

      <h3>Orders List</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Product ID</th>
            <th>Quantity Sold</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>{order.productId}</td>
              <td>{order.quantity}</td>
              <td>₹{order.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};


export default AdminDashboard;