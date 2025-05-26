import { useState, useEffect } from "react";
import "./Events.css";
import { Link } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/events")
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(data);

        const cats = data.map((e) => {
          if (typeof e.category_name === "string") return e.category_name;
          if (typeof e.category === "string") return e.category;
          if (e.category_name && typeof e.category_name === "object")
            return e.category_name.name;
          if (e.category && typeof e.category === "object")
            return e.category.name;
          return "Sin categoría";
        });

        const uniqueCats = ["Todas", ...new Set(cats)];
        setCategories(uniqueCats);
      })

      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  const filteredEvents =
    selectedCategory === "Todas"
      ? events
      : events.filter((event) => {
          let catName = event.category_name;
          if (typeof catName === "object" && catName !== null)
            catName = catName.name;
          if (!catName) catName = event.category;
          if (typeof catName === "object" && catName !== null)
            catName = catName.name;
          return catName === selectedCategory;
        });

  return (
    <div className="event-container">
      <h2 className="event-title">Eventos Deportivos</h2>

      <div className="filter-bar">
        <label htmlFor="category">Filtrar por categoría:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="no-events">No hay eventos disponibles.</p>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => {
            const catName =
              typeof event.category_name === "object" &&
              event.category_name !== null
                ? event.category_name.name
                : event.category_name ||
                  (typeof event.category === "object" && event.category !== null
                    ? event.category.name
                    : event.category);

            return (
              <div key={event.id} className="event-card">
                {" "}
                {event.image_url && (
                  <img
                    src={`http://localhost:8000/storage/${event.image}`}
                    alt={event.title}
                    className="event-image"
                  />
                )}
                <h3>{event.title}</h3>
                
                <Link to={`/events/${event.id}`} className="event-button">
                  Ver detalles
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Events;
