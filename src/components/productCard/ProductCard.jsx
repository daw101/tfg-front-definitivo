import { useState, useContext } from 'react';
import { useCart } from '../../context/CartContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useContext(UserContext);
  const [added, setAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const imageUrl =
    product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('https'))
      ? product.image_url
      : product.image
      ? `http://127.0.0.1:8000/storage/${product.image}`
      : 'https://via.placeholder.com/150';

  return (
    <div className="product-card">
      <div className="image-container">
        <img src={imageUrl} alt={product.name} />
        {!imageUrl.startsWith('http') && (
          <p style={{ color: 'red' }}>Error cargando imagen</p>
        )}
      </div>

      <h3>{product.name}</h3>

      <button onClick={() => setShowDetails(!showDetails)} className="view-more-btn">
        {showDetails ? 'Ver menos' : 'Ver más'}
      </button>

     <div className={`product-details ${showDetails ? 'expanded' : ''}`}>
  <p><strong>Categoría:</strong> {product.category ? product.category.name : 'Sin categoría'}</p>
  <p><strong>Precio:</strong> {product.price}€</p>
  <p><strong>Stock:</strong> {product.stock}</p>
  <p><strong>Descripción:</strong> {product.description || 'No disponible'}</p>
  

  {user ? (
    <button className={added ? 'added' : ''} onClick={handleAddToCart}>
      {added ? 'Añadido!' : 'Añadir al carrito'}
    </button>
  ) : (
    <button onClick={handleLoginRedirect}>Inicia sesión para comprar</button>
  )}
</div>

    </div>
  );
}

export default ProductCard;
