import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ productId: '', threshold: '' });
  const [loading, setLoading] = useState(true);

  // Fetch alerts and products
  const fetchAlerts = async () => {
    try {
      // Antes de obtener las alertas, solicitar al backend que recalcule los estados
      await fetch('http://localhost:8080/api/alerts/update-status', { method: 'PUT' });
    } catch (err) {
      console.error('Error actualizando estados de alertas:', err);
    }

    try {
        const res = await fetch('http://localhost:8080/api/alerts');
        const data = await res.json();
        console.log('Fetched alerts from backend:', data);
      setAlerts(data);
    } catch (err) {
      console.error('Error cargando alertas:', err);
    }
  };

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => { console.log('Fetched products from backend:', data); setProducts(data); })
      .catch(err => console.error("Error cargando productos:", err));
  };

  useEffect(() => {
    // Inicial: obtener productos y actualizar/obtener alertas una sola vez al montar
    fetchProducts();
    fetchAlerts().finally(() => setLoading(false));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchAlerts();
        setFormData({ productId: '', threshold: '' });
      }
    } catch (error) {
      console.error("Error creando alerta:", error);
    }
  };

  // Handle alert deletion
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta alerta?")) return;
    try {
      await fetch(`http://localhost:8080/api/alerts/${id}`, { method: 'DELETE' });
      fetchAlerts();
    } catch (error) {
      console.error("Error eliminando alerta:", error);
    }
  };

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Alertas de Stock</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE5D5]">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Crear Alerta
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 ml-1">Producto</label>
                <select
                  required
                  className="w-full bg-[#F3F0E7] border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-all"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                >
                  <option value="">Selecciona un producto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 ml-1">Umbral Mínimo</label>
                <input
                  required
                  type="number"
                  placeholder="Ej: 50"
                  className="w-full bg-[#F3F0E7] border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-all"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2F4F2F] text-white py-3 rounded-xl font-semibold hover:bg-[#243c24] transition-colors flex justify-center items-center gap-2"
              >
                <Save size={18} />
                Guardar
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE5D5] h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Lista de Alertas</h2>
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 font-semibold pl-2">Producto</th>
                    <th className="pb-3 font-semibold">Cantidad</th>
                    <th className="pb-3 font-semibold">Umbral Mínimo</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold text-right pr-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="4" className="p-4 text-center">Cargando...</td></tr>
                  ) : alerts.map(alert => (
                    <tr key={alert.id} className="group hover:bg-[#FDFBF7] transition-colors">
                      <td className="py-4 pl-2">
                        <div className="font-medium text-gray-800">
                          {products.find(p => p.id === alert.productId)?.name || 'Producto no encontrado'}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{products.find(p => p.id === alert.productId)?.stockQuantity || 'N/A'}</td> {/* Nueva columna */}
                      <td className="py-4 text-sm text-gray-600">{alert.threshold}</td>
                      <td className="py-4">
                        <span className={`font-semibold ${alert.status === 'Stock Bajo' ? 'text-red-500' : 'text-green-600'}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button
                          onClick={() => handleDelete(alert.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && alerts.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                  No se encontraron alertas
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}