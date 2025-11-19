import { useUser, ROLES } from '../context/UserContext';
import { UserCircle, ChevronDown } from 'lucide-react';

export default function RoleSwitcher() {
  const { role, setRole } = useUser();

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
        <UserCircle size={24} />
      </div>
      
      <div className="flex-1">
        <p className="text-xs text-gray-500 font-medium uppercase">Modo actual</p>
        <div className="relative">
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="appearance-none w-full bg-transparent font-bold text-gray-800 text-sm focus:outline-none cursor-pointer pr-4"
          >
            <option value={ROLES.ADMIN}>Administrador</option>
            <option value={ROLES.WAREHOUSE}>Almacén</option>
          </select>
          <ChevronDown size={14} className="absolute right-0 top-1 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}