import { useState, useEffect } from "react";
import "./PanelAdminProducts.css";

function PanelAdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
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

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      image: null,
    });
    setEditingId(null);
  };

  const createOrUpdateProduct = async () => {
  if (!form.name || !form.price || !form.stock || !form.category_id) {
    alert("Nombre, precio, stock y categoría son obligatorios");
    return;
  }

  const url = editingId
    ? `http://localhost:8000/api/products/${editingId}`
    : "http://localhost:8000/api/products";

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("price", form.price);
  formData.append("stock", form.stock);
  formData.append("category_id", form.category_id);
  if (form.image) formData.append("image", form.image);

  if (editingId) {
    formData.append("_method", "PUT");
  }

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
      throw new Error(errorData.message || "Error al guardar producto");
    }

    await fetchProducts();
    resetForm();
  } catch (error) {
    alert(error.message);
  }
};


  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category_id: product.category_id || "",
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar este producto?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al borrar producto");

      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Panel Admin: Productos</h2>

      <div className="form-container">
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
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
            <button className="btn update" onClick={createOrUpdateProduct}>
              Actualizar Producto
            </button>
            <button className="btn cancel" onClick={resetForm}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn create" onClick={createOrUpdateProduct}>
            Crear Producto
          </button>
        )}
      </div>
      <div className="product-list">
  {products.map((product) => (
    <div className="product-item" key={product.id}>
      <div className="product-info">
        <h3>{product.name}</h3>
       
        {product.image && (
          <img
            src={`http://localhost:8000/storage/${product.image}`}
            alt={product.name}
          />
        )}
      </div>
      <div className="product-actions">
        <button className="btn edit" onClick={() => startEdit(product)}>Editar</button>
        <button className="btn delete" onClick={() => handleDelete(product.id)}>Eliminar</button>
      </div>
    </div>
  ))}
</div>



      
    </div>
  );
}

export default PanelAdminProducts;
