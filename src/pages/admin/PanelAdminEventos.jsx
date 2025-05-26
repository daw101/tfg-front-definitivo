import { useState, useEffect } from "react";
import "./PanelAdminProducts.css"; // Puedes reutilizar estilos o hacer uno nuevo

function PanelAdminEventos() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category_id: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.is_admin;

  if (!isAdmin) {
    return <p className="denied">Acceso denegado. Solo administradores.</p>;
  }

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/events");
      if (!res.ok) throw new Error("Error al cargar eventos");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      location: "",
      category_id: "",
      image: null,
    });
    setEditingId(null);
  };

  const createOrUpdateEvent = async () => {
    if (!form.title || !form.date || !form.location || !form.category_id) {
      alert("Título, fecha, lugar y categoría son obligatorios");
      return;
    }

    const url = editingId
      ? `http://localhost:8000/api/events/${editingId}`
      : "http://localhost:8000/api/events";

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);
    formData.append("category_id", form.category_id);
    if (form.image) formData.append("image", form.image);

    if (editingId) formData.append("_method", "PUT");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar evento");
      }

      await fetchEvents();
      resetForm();
    } catch (error) {
      alert(error.message);
    }
  };

  const startEdit = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      location: event.location || "",
      category_id: event.category_id || "",
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar este evento?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al borrar evento");

      setEvents(events.filter((e) => e.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Panel Admin: Eventos</h2>

      <div className="form-container">
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Lugar"
          value={form.location}
          onChange={handleChange}
        />
        <input
          name="category_id"
          type="number"
          placeholder="ID Categoría"
          value={form.category_id}
          onChange={handleChange}
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        {editingId ? (
          <>
            <button className="btn update" onClick={createOrUpdateEvent}>
              Actualizar Evento
            </button>
            <button className="btn cancel" onClick={resetForm}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn create" onClick={createOrUpdateEvent}>
            Crear Evento
          </button>
        )}
      </div>

      <div className="product-list">
        {events.map((event) => (
          <div className="product-item" key={event.id}>
            <div className="product-info">
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleString()}</p>
              <p>{event.location}</p>
              <p>{event.description}</p>
              {event.image && (
          <img
            src={`http://localhost:8000/storage/${event.image}`}
            alt={event.name}
          />
        )}
            </div>
            <div className="product-actions">
              <button className="btn edit" onClick={() => startEdit(event)}>
                Editar
              </button>
              <button className="btn delete" onClick={() => handleDelete(event.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PanelAdminEventos;
