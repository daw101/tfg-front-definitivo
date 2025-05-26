import "./EventCard.css";

function EventCard({ event }) {
  return (
    <div className="event-card">
      <img src={event.image_url} alt={event.title} className="event-image" />
      <div className="event-content">
        <h3>{event.title}</h3>
        <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Ubicación:</strong> {event.location}</p>
        <p className="description">{event.description}</p>
      </div>
    </div>
  );
}

export default EventCard;
