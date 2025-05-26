import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Store from "./pages/products/Store";
import Events from "./pages/events/Events";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/Profile/Profile";
import Checkout from "./pages/Checkout";
import Navbar from "./components/navbar/navbar";
import EventDetails from "./pages/events/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import PanelAdminProducts from "./pages/admin/PanelAdminProducts";
import PanelAdminEventos from "./pages/admin/PanelAdminEventos";
import PanelAdminCategories from "./pages/admin/PanelAdminCategories";
import PanelAdminUsers from "./pages/admin/PanelAdminUsers";
import PurchaseHistory from "./pages/PurchaseHistory"; 
import Footer from "./components/footer/Footer";
import Contact from "./pages/Contact";
import TermsAndConditions from "./pages/TermsAndConditions";
function App() {
  return (
    
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/events" element={<Events />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/productos" element={<PanelAdminProducts/>} />
              <Route path="/admin/eventos" element={<PanelAdminEventos/>} />
              <Route path="/admin/users" element={<PanelAdminUsers/>} />
              <Route path="/admin/categories" element={<PanelAdminCategories/>} />
              {/*<Route path="/purchase-history" element={<PurchaseHistory />} />*/}
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsAndConditions />} />


            </Routes>
          </div>
          <Footer/>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
          

  );
}

export default App;
