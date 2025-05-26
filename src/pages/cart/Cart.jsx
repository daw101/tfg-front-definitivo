import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Tu Carrito</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío. ¡Añade productos para empezar!</p>
          <Link to="/store" className="continue-shopping">Seguir comprando</Link>
        </div>
      ) : (
        <div className="cart-items">
          <div className="cart-header">
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Precio</span>
            <span>Acciones</span>
          </div>

          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div>{item.name}</div>
              <div className="quantity-control">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-button"
                  disabled={item.quantity <= 1}
                >−</button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => {
                    const q = parseInt(e.target.value, 10);
                    if (!isNaN(q)) updateQuantity(item.id, q);
                  }}
                  className="quantity-input"
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-button"
                >+</button>
              </div>
              <div>{(item.price * item.quantity).toFixed(2)}€</div>
              <div>
                <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                  ❌
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <p><strong>Total: {total.toFixed(2)}€</strong></p>
            <div className="cart-actions">
              <Link to="/checkout" className="checkout-button">Ir a Pagar</Link>
              <Link to="/store" className="continue-shopping">Seguir comprando</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
