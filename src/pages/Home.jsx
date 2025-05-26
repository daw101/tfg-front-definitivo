import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/productCard/ProductCard";

import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch("http://localhost:8000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));

    fetch("http://localhost:8000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div className="home-container">
      <div className="banner">
        <img src="/src/assets/mainimage.png" alt="Deportes de contacto" className="banner-image" />
        <div className="banner-text">
          <h1>Pasión por los Deportes de Contacto</h1>
          <p>Equípate, entrena y participa en los mejores eventos</p>
        </div>
      </div>

      {/* Últimos Productos */}
      <section className="latest-products">
        <h2>Últimos Productos</h2>
        <div className="product-grid">
          {products
            .slice(-3)
            .reverse()
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* Últimos Eventos */}
      <section className="latest-events">
        <h2>Últimos Eventos</h2>
        <div className="events-list">
          {events
            .slice(-3)
            .reverse()
            .map((event) => {
              typeof event.category_name === "object" &&
              event.category_name !== null
                ? event.category_name.name
                : event.category_name ||
                  (typeof event.category === "object" && event.category !== null
                    ? event.category.name
                    : event.category);

              return (
                <div
                  key={event.id}
                  className="event-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/events/" + event.id)}
                >
                  {event.image_url && (
                    <img
                      src={`http://localhost:8000/storage/${event.image}`}
                      alt={event.title}
                      className="event-image"
                    />
                  )}

                  <h3>{event.title}</h3>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

export default Home;
