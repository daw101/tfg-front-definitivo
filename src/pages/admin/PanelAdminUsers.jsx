import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "./PanelAdminUsers.css";

function PanelAdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", is_admin: false });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const { user: currentUser } = useContext(UserContext); 

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", is_admin: false });
    setEditingId(null);
  };

  const createOrUpdateUser = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Nombre y email son obligatorios");
      return;
    }

    const url = editingId
      ? `http://localhost:8000/api/users/${editingId}`
      : "http://localhost:8000/api/users";

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al guardar usuario");
      }

      await fetchUsers();
      resetForm();
    } catch (error) {
      alert(error.message);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({ 
      name: user.name, 
      email: user.email, 
      password: "", 
      is_admin: user.is_admin || false 
    });
  };

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      alert("No puedes eliminar tu propio usuario.");
      return;
    }

    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar usuario");
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleAdmin = async (user) => {
    if (user.id === currentUser.id) {
      alert("No puedes cambiar tu propio rol de administrador.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_admin: !user.is_admin }),
      });
      if (!res.ok) throw new Error("Error al actualizar el rol de administrador");

      setUsers((users) =>
        users.map((u) =>
          u.id === user.id ? { ...u, is_admin: !user.is_admin } : u
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Panel Admin: Usuarios</h2>

      <div className="form-container">
        <input
          name="name"
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña (dejar vacío para no cambiar)"
          value={form.password}
          onChange={handleChange}
        />

        {editingId ? (
          <>
            <button className="btn update" onClick={createOrUpdateUser}>
              Actualizar Usuario
            </button>
            <button className="btn cancel" onClick={resetForm}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn create" onClick={createOrUpdateUser}>
            Crear Usuario
          </button>
        )}
      </div>

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <span>
              {user.name} - {user.email}
            </span>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="checkbox"
                checked={user.is_admin}
                onChange={() => toggleAdmin(user)}
                disabled={user.id === currentUser.id}
              />
              Admin
            </label>
           {user.id !== currentUser.id && (
  <div>
    <button
      className="btn edit"
      onClick={() => startEdit(user)}
    >
      Editar
    </button>
    <button
      className="btn delete"
      onClick={() => handleDelete(user.id)}
    >
      Eliminar
    </button>
  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
}

export default PanelAdminUsers;
