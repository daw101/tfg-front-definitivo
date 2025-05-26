import { useState, useEffect } from "react";
import "./PanelAdminCategories.css";
function PanelAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/categories");
      if (!res.ok) throw new Error("Error al cargar categorías");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ name: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "" });
    setEditingId(null);
  };

  const createOrUpdateCategory = async () => {
    if (!form.name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const url = editingId
      ? `http://localhost:8000/api/categories/${editingId}`
      : "http://localhost:8000/api/categories";

    try {
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.name }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar categoría");
      }

      await fetchCategories();
      resetForm();
    } catch (error) {
      alert(error.message);
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta categoría?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al borrar categoría");

      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Panel Admin: Categorías</h2>

      <div className="form-container">
        <input
          type="text"
          placeholder="Nombre categoría"
          value={form.name}
          onChange={handleChange}
        />
        {editingId ? (
          <>
            <button className="btn update" onClick={createOrUpdateCategory}>
              Actualizar Categoría
            </button>
            <button className="btn cancel" onClick={resetForm}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn create" onClick={createOrUpdateCategory}>
            Crear Categoría
          </button>
        )}
      </div>

      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat.id} className="category-item">
            <span>{cat.name}</span>
            <div>
              <button className="btn edit" onClick={() => startEdit(cat)}>
                Editar
              </button>
              <button className="btn delete" onClick={() => handleDelete(cat.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PanelAdminCategories;
