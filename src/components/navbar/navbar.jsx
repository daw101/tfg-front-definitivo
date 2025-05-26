import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import "./navbar.css";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [viewAsUser, setViewAsUser] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isAdminEffective = user?.is_admin && !viewAsUser;

  return (
    <nav className={`navbar ${menuOpen ? "active" : ""}`}>
   <img src="/src/assets/logo.webp" alt="Logo Sports Zone" className="navbar-logo" />
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? "✖" : "☰"}
      </div>

      <div className="nav-links" onClick={() => setMenuOpen(false)}>
        {user && !isAdminEffective && <Link to="/">Inicio</Link>}

        {user ? (
          <>
            {isAdminEffective ? (
              <>
                <Link to="/admin/productos">Admin Productos</Link>
                <Link to="/admin/eventos">Admin Eventos</Link>
                <Link to="/admin/categories">Admin Categorías</Link>
                <Link to="/admin/users">Admin Usuarios</Link>
                
                <button
                  onClick={() => setViewAsUser(true)}
                  className="btn switch-view"
                >
                  Ver como usuario
                </button>
                <button onClick={handleLogout} className="logout-button">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/store">Tienda</Link>
                <Link to="/events">Eventos</Link>
                <Link to="/cart" data-count={cartItemCount}>Carrito</Link>
                <Link to="/profile">Perfil</Link>
                {user.is_admin ? (
                  <button
                    onClick={() => setViewAsUser(false)}
                    className="btn switch-view"
                  >
                    Volver a vista admin
                  </button>
                ) : null}
                <button onClick={handleLogout} className="logout-button">
                  Cerrar sesión
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/store">Tienda</Link>
            <Link to="/events">Eventos</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
