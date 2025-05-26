import { useCart } from '../context/CartContext';
import { useState } from 'react';
import '../styles/Checkout.css'; 

function Checkout() {
  const { cartItems, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateCardNumber = (number) => {
    const onlyDigits = /^\d+$/;
    return onlyDigits.test(number) && number.length >= 13 && number.length <= 19;
  };

  const validatePaypalEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email no válido';

    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'El número de tarjeta es requerido';
      else if (!validateCardNumber(formData.cardNumber.trim())) newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    if (formData.paymentMethod === 'paypal') {
      if (!validatePaypalEmail(formData.email.trim())) newErrors.email = 'Correo de PayPal no válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const purchase = {
        id: Date.now(),
        name: formData.name,
        address: formData.address,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        cartItems: [...cartItems],
        total: total.toFixed(2),
        date: new Date().toISOString(),
      };

      const storedHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

      storedHistory.push(purchase);

      localStorage.setItem('purchaseHistory', JSON.stringify(storedHistory));

      alert(
        `✅ Compra realizada con éxito!\n\n` +
        `Gracias ${formData.name}.\n` +
        `Confirmación enviada a: ${formData.email}\n` +
        `Total: ${total.toFixed(2)}€`
      );

      clearCart();

      setIsSubmitting(false);

      setFormData({
        name: '',
        address: '',
        email: '',
        paymentMethod: 'credit_card',
        cardNumber: '',
      });

    }, 2000);
  };

  return (
    <div className="checkout-page">
      <h2>Finalizar Compra</h2>

      <div className="order-summary">
        <h3>Resumen de la Orden</h3>
        {cartItems.length === 0 ? (
          <p>No tienes productos en el carrito.</p>
        ) : (
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
          </div>
        )}
        <div className="total">
          <strong>Total: {total.toFixed(2)}€</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form" noValidate>
        <h3>Detalles de Envío</h3>

        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {errors.address && <small className="error">{errors.address}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <small className="error">{errors.email}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethod">Método de Pago</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="credit_card">Tarjeta de Crédito</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Efectivo</option>
          </select>
        </div>

        {formData.paymentMethod === 'credit_card' && (
          <div className="form-group">
            <label htmlFor="cardNumber">Número de Tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              required
            />
            {errors.cardNumber && <small className="error">{errors.cardNumber}</small>}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Procesando...' : 'Finalizar Compra'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
