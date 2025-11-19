import { Link } from 'react-router-dom';
import { Box, ShoppingCart, Bell, BarChart3, Settings, LogOut } from 'lucide-react';

export default function Home() {
  
  const cards = [
    { title: 'Inventario', icon: Box, color: 'text-green-600', link: '/inventory' },
    { title: 'Pedidos', icon: ShoppingCart, color: 'text-green-600', link: '/orders' },
    { title: 'Alertas de Stock', icon: Bell, color: 'text-yellow-500', link: '/alerts' },
    { title: 'Informes', icon: BarChart3, color: 'text-blue-600', link: '/reports' },
    { title: 'Configuración', icon: Settings, color: 'text-gray-600', link: '/settings' },
    { title: 'Cerrar Sesión', icon: LogOut, color: 'text-red-500', link: '/logout' },
  ];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Bienvenido a AgroStock
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map((card, index) => (
          <Link 
            key={index} 
            to={card.link}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center gap-4 group"
          >
            <div className={`p-4 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors ${card.color}`}>
              <card.icon size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}