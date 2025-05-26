import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Profile.css';

function Profile() {
  const { user, logout, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    password: '',
  });
  const [message, setMessage] = useState('');

  if (!user) {
    return <p className="profile-message-error">No estás autenticado. Por favor, inicia sesión.</p>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');

  const payload = {};
  if (form.name.trim() !== '') payload.name = form.name;
  if (form.password.trim() !== '') payload.password = form.password;

  if (Object.keys(payload).length === 0) {
    setMessage('❌ Debes rellenar al menos uno de los campos para actualizar.');
    return;
  }

  try {
    const res = await fetch('http://localhost:8000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Error al actualizar perfil');
    }

    const updatedUser = await res.json();
    setUser(updatedUser);
    setMessage('✅ Perfil actualizado con éxito');
  } catch (error) {
    setMessage(`❌ ${error.message}`);
  }
};




  return (
    <div className="profile-container">
      <h1>Perfil de {user.name}</h1>
      <p>Email: {user.email}</p>

      <form onSubmit={handleSubmit} className="profile-form">
        <label>Nuevo nombre:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          
        />

        <label>Nueva contraseña:</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Dejar vacío para no cambiarla"
        />

        <button type="submit" className="update-btn">Actualizar Perfil</button>
      </form>

      {message && <p className="profile-message">{message}</p>}

      <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
    </div>
  );
}

export default Profile;
