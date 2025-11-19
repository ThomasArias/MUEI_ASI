import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ProductList from './components/ProductList';
import Inventory from './pages/Inventory';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 ml-64">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />      
              <Route path="/orders" element={<div className="p-10">Página de Pedidos (En construcción)</div>} />
              <Route path="/suppliers" element={<div className="p-10">Página de Proveedores (En construcción)</div>} />
              <Route path="/reports" element={<div className="p-10">Página de Informes (En construcción)</div>} />
              <Route path="/alerts" element={<div className="p-10">Página de Alertas (En construcción)</div>} />
              <Route path="/settings" element={<div className="p-10">Configuración (En construcción)</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;