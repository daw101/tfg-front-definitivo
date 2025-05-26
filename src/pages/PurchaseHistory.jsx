import { useEffect, useState } from 'react';
import axios from 'axios';

function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Cargando historial de compras...</p>;

  if (orders.length === 0) return <p>No tienes compras registradas.</p>;

  return (
    <div className="purchase-history">
      <h2>Historial de Compras</h2>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <h3>Pedido #{order.id}</h3>
          <p><strong>Fecha:</strong> {new Date(order.order_date).toLocaleString()}</p>
          <p><strong>Total:</strong> {order.total.toFixed(2)}€</p>
          <p><strong>Método de Pago:</strong> {order.payment?.paymentMethod?.name || 'N/A'}</p>
          <div>
            <h4>Productos:</h4>
            <ul>
              {order.cart.products.map(product => (
                <li key={product.id}>
                  {product.name} x {product.pivot.quantity} - {(product.price * product.pivot.quantity).toFixed(2)}€
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PurchaseHistory;
