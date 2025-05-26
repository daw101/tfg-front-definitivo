import { useState, useEffect } from 'react';
import ProductCard from '../../components/productCard/ProductCard';
import './Store.css';

function Store() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortByName = (arr) => {
    return arr.slice().sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar productos');
        return res.json();
      })
      .then((data) => {
        const sortedData = sortByName(data);
        setProducts(sortedData);

        const cats = data.map((p) => {
          if (typeof p.category_name === "string") return p.category_name;
          if (typeof p.category === "string") return p.category;
          if (p.category_name && typeof p.category_name === "object")
            return p.category_name.name;
          if (p.category && typeof p.category === "object")
            return p.category.name;
          return "Sin categoría";
        });

        const uniqueCats = ["Todas", ...new Set(cats)];
        setCategories(uniqueCats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory === "Todas") {
      setFilteredProducts(sortByName(products));
    } else {
      const filtered = products.filter((product) => {
        let catName = product.category_name;
        if (typeof catName === "object" && catName !== null)
          catName = catName.name;
        if (!catName) catName = product.category;
        if (typeof catName === "object" && catName !== null)
          catName = catName.name;
        return catName === selectedCategory;
      });
      setFilteredProducts(sortByName(filtered));
    }
  }, [selectedCategory, products]);

  return (
    <div className="store-container">
      <h2 className="store-title">Tienda de Ropa y Accesorios Deportivos</h2>

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

      {loading ? (
        <div className="loader">Cargando productos...</div>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="no-products">No hay productos disponibles.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Store;
