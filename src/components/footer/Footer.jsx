import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-section about">
          <h3>Sobre Nosotros</h3>
          <p>Somos una tienda de deportes con eventos y productos exclusivos para ti.</p>
        </div>

        <div className="footer-section links">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/store">Tienda</Link></li>
            <li><Link to="/events">Eventos</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
            <li><Link to="/terms">Términos y Condiciones</Link></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} SportsZone. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
