import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, ShoppingCart, Truck, BarChart3, Settings, LogOut } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';

export default function Sidebar() {
  const location = useLocation();
  
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium mb-1";
    return location.pathname === path 
      ? `${baseClass} bg-green-50 text-green-700`
      : `${baseClass} text-gray-600 hover:bg-gray-50 hover:text-gray-900`;
  };

  const navigate = useNavigate();

  const getInventorySubClass = (tab) => {
    const base = "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium";
    if (location.pathname === '/inventory') {
      try {
        const params = new URLSearchParams(location.search);
        const t = params.get('tab') || 'products';
        if (t === tab) return `${base} bg-green-50 text-green-700 ml-10`;
      } catch (e) {
        if (tab === 'products') return `${base} bg-green-50 text-green-700 ml-10`;
      }
    }
    return `${base} text-gray-600 hover:bg-gray-50 hover:text-gray-900 ml-10`;
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col p-6 fixed left-0 top-0">
      <RoleSwitcher />
      <nav className="flex-1">
        <Link to="/" className={getLinkClass('/')}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/inventory?tab=products" className={getLinkClass('/inventory')}>
          <Box size={20} />
          Inventario
        </Link>
        {location.pathname === '/inventory' && (
          <div className="mt-1">
            <Link to="/inventory?tab=products" className={getInventorySubClass('products')}>
              <span>Productos</span>
            </Link>
            <Link to="/inventory?tab=movements" className={getInventorySubClass('movements')}>
              <span>Movimientos</span>
            </Link>
          </div>
        )}
        <Link to="/orders" className={getLinkClass('/orders')}>
          <ShoppingCart size={20} />
          Pedidos
        </Link>
        <Link to="/suppliers" className={getLinkClass('/suppliers')}>
          <Truck size={20} />
          Proveedores
        </Link>
        <Link to="/reports" className={getLinkClass('/reports')}>
          <BarChart3 size={20} />
          Informes
        </Link>
      </nav>
      <div className="border-t pt-4 mt-4">
        <Link to="/settings" className={getLinkClass('/settings')}>
          <Settings size={20} />
          Configuración
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium">
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}