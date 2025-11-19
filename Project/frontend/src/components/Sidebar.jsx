import { Link, useLocation } from 'react-router-dom';
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

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col p-6 fixed left-0 top-0">
      <RoleSwitcher />
      <nav className="flex-1">
        <Link to="/" className={getLinkClass('/')}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/inventory" className={getLinkClass('/inventory')}>
          <Box size={20} />
          Inventario
        </Link>
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