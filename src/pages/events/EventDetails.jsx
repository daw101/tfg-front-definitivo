import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Evento no encontrado");
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando evento...</p>;
  if (error) return <p>Error: {error}</p>;

  const catName =
    typeof event.category_name === "object" && event.category_name !== null
      ? event.category_name.name
      : event.category_name ||
        (typeof event.category === "object" && event.category !== null
          ? event.category.name
          : event.category);

  return (
    <div className="event-details">
      <h2>{event.title}</h2>

      {event.image_url && (
        <img
          src={`http://localhost:8000/storage/${event.image}`}
          alt={event.title}
          className="event-detail-image"
        />
      )}

      <p>
        <strong>Fecha:</strong> {event.date}
      </p>
      <p>
        <strong>Lugar:</strong> {event.location}
      </p>
      <p>
        <strong>Categoría:</strong> {catName}
      </p>
      <p>{event.description}</p>

      <button className="back-button" onClick={() => window.history.back()}>
        Volver
      </button>
    </div>
  );
}

export default EventDetails;
