function EventsList({ events }) {
  return (
    <div className="event-grid">
      {events.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p><strong>Fecha:</strong> {event.date}</p>
        </div>
      ))}
    </div>
  );
}
export default EventsList;
