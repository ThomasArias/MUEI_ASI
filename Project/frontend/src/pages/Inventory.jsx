import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Edit, Trash2, Plus, Save, X } from 'lucide-react';
import MovementDetailsModal from '../components/MovementDetailsModal';
import { useUser } from '../context/UserContext';

export default function Inventory() {
  const { role } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'movements'

  const initialFormState = {
    name: '',
    supplierReference: '',
    stockQuantity: '',
    warehouseLocation: '',
    supplierName: '',
    numberOfBoxes: '',
    piecesPerBox: '',
    minStockThreshold: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null); 

  const [movements, setMovements] = useState([]);
  const [movementForm, setMovementForm] = useState({ productId: '', quantity: '', type: 'IN', reason: '' });
  const [selectedMovement, setSelectedMovement] = useState(null);

  const fetchProducts = () => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  const updateAlertStatuses = async () => {
  try {
    await fetch('http://localhost:8080/api/alerts/update-status', { method: 'PUT' });
  } catch (error) {
    console.error("Error actualizando estados de alertas:", error);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchMovements = () => {
    fetch('http://localhost:8080/api/movements')
      .then(res => res.json())
      .then(data => setMovements(data))
      .catch(() => setMovements([]));
  };

  useEffect(() => {
    if (activeTab === 'movements') fetchMovements();
  }, [activeTab]);

  // Initialize activeTab from URL ?tab=movements|products (so sidebar can link)
  const location = useLocation();
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      if (tab === 'movements' || tab === 'products') {
        setActiveTab(tab);
      } else {
        setActiveTab('products');
      }
    } catch (e) {
      setActiveTab('products');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:8080/api/products/${editingId}`
      : 'http://localhost:8080/api/products';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchProducts();
        await updateAlertStatuses();
        handleClear(); 
      }
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  const handleRegisterMovement = async (e) => {
    e && e.preventDefault();
    if (!movementForm.productId || !movementForm.quantity) {
      alert('Seleccione producto e ingrese la cantidad');
      return;
    }

    const payload = {
      productId: Number(movementForm.productId),
      quantity: Number(movementForm.quantity),
      type: movementForm.type === 'IN' ? 'IN' : 'OUT',
      reason: movementForm.reason,
      responsibleUser: 'warehouse_user'
    };

    try {
      const res = await fetch('http://localhost:8080/api/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMovementForm({ productId: '', quantity: '', type: 'IN', reason: '' });
        fetchProducts();
        fetchMovements();
      } else {
        const text = await res.text();
        alert('Error: ' + text);
      }
    } catch (error) {
      console.error('Error registrando movimiento:', error);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      await fetch(`http://localhost:8080/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const handleEditClick = (product) => {
    setFormData(product);
    setEditingId(product.id);
  };

  const handleClear = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.supplierName && product.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inputClass = "w-full bg-[#F3F0E7] border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-600/20 focus:outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1 ml-1";

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Inventario</h1>

      {/* Se eliminó el desplegable interno de selección de sección; la navegación se controla desde la barra lateral */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {activeTab === 'products' ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE5D5]">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                {editingId ? 'Editar Producto' : 'Añadir Producto'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej: Fertilizante Orgánico"
                    className={inputClass}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Referencia del Proveedor</label>
                  <input
                    type="text"
                    placeholder="Ej: SUP-00123"
                    className={inputClass}
                    value={formData.supplierReference}
                    onChange={e => setFormData({ ...formData, supplierReference: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Cantidad en Stock</label>
                  <input
                    required
                    type="number"
                    placeholder="Ej: 500"
                    className={inputClass}
                    value={formData.stockQuantity}
                    onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Ubicación en Almacén</label>
                  <input
                    type="text"
                    placeholder="Ej: Pasillo 3, Estante B"
                    className={inputClass}
                    value={formData.warehouseLocation}
                    onChange={e => setFormData({ ...formData, warehouseLocation: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Proveedor Asociado</label>
                  <input
                    type="text"
                    placeholder="Ej: Granjas del Valle Verde"
                    className={inputClass}
                    value={formData.supplierName}
                    onChange={e => setFormData({ ...formData, supplierName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nº de Cajas</label>
                    <input
                      type="number"
                      placeholder="Ej: 50"
                      className={inputClass}
                      value={formData.numberOfBoxes}
                      onChange={e => setFormData({ ...formData, numberOfBoxes: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Piezas / Caja</label>
                    <input
                      type="number"
                      placeholder="Ej: 10"
                      className={inputClass}
                      value={formData.piecesPerBox}
                      onChange={e => setFormData({ ...formData, piecesPerBox: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Umbral Mínimo (Alerta)</label>
                  <input
                    type="number"
                    placeholder="Ej: 100"
                    className={inputClass}
                    value={formData.minStockThreshold}
                    onChange={e => setFormData({ ...formData, minStockThreshold: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#2F4F2F] text-white py-3 rounded-xl font-semibold hover:bg-[#243c24] transition-colors flex justify-center items-center gap-2"
                  >
                    <Save size={18} />
                    {editingId ? 'Actualizar' : 'Guardar'}
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE5D5]">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Movimiento</h2>

              <div>
                <label className={labelClass}>Producto</label>
                <select
                  className={inputClass}
                  value={movementForm.productId}
                  onChange={e => setMovementForm({ ...movementForm, productId: e.target.value })}
                >
                  <option value="">Seleccionar Producto</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Cantidad</label>
                <input
                  type="number"
                  className={inputClass}
                  value={movementForm.quantity}
                  onChange={e => setMovementForm({ ...movementForm, quantity: e.target.value })}
                  placeholder="Ingrese la cantidad"
                />
              </div>

              <div>
                <label className={labelClass}>Tipo de Movimiento</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMovementForm({ ...movementForm, type: 'IN' })}
                    className={`flex-1 py-2 rounded-lg ${movementForm.type === 'IN' ? 'bg-green-200' : 'bg-gray-100'}`}
                  >Entrada</button>
                  <button
                    onClick={() => setMovementForm({ ...movementForm, type: 'OUT' })}
                    className={`flex-1 py-2 rounded-lg ${movementForm.type === 'OUT' ? 'bg-red-200' : 'bg-gray-100'}`}
                  >Salida</button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Motivo</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={movementForm.reason}
                  onChange={e => setMovementForm({ ...movementForm, reason: e.target.value })}
                  placeholder="Ej: Compra a proveedor, Venta a cliente"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRegisterMovement}
                  className="w-full bg-[#2F4F2F] text-white py-3 rounded-xl font-semibold hover:bg-[#243c24] transition-colors"
                >Registrar</button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE5D5] h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-800">{activeTab === 'products' ? 'Lista de Productos' : 'Movimientos Recientes'}</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F3F0E7] rounded-lg text-sm focus:outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
                  <Filter size={16} />
                  Filtrar
                </button>
              </div>
            </div>

            <div className="overflow-auto flex-1">
              {activeTab === 'products' ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 font-semibold pl-2">Nombre del Producto</th>
                      <th className="pb-3 font-semibold">Proveedor</th>
                      <th className="pb-3 font-semibold">Cantidad</th>
                      <th className="pb-3 font-semibold text-right pr-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan="4" className="p-4 text-center">Cargando...</td></tr>
                    ) : filteredProducts.map((product) => (
                      <tr key={product.id} className="group hover:bg-[#FDFBF7] transition-colors">
                        <td className="py-4 pl-2">
                          <div className="font-medium text-gray-800">{product.name}</div>
                          {product.supplierReference && (
                            <div className="text-xs text-gray-400 mt-0.5">{product.supplierReference}</div>
                          )}
                        </td>
                        <td className="py-4 text-sm text-gray-600">{product.supplierName}</td>
                        <td className="py-4">
                          <span className={`font-semibold ${product.stockQuantity < (product.minStockThreshold || 10) ? 'text-red-500' : 'text-gray-700'}`}>
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 font-semibold pl-2">Fecha</th>
                      <th className="pb-3 font-semibold">Producto</th>
                      <th className="pb-3 font-semibold">Cantidad</th>
                      <th className="pb-3 font-semibold">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {movements.length === 0 ? (
                      <tr><td colSpan="4" className="p-4 text-center">No hay movimientos</td></tr>
                    ) : movements.slice(0, 50).map(m => (
                      <tr key={m.id} className="group hover:bg-[#FDFBF7] transition-colors">
                        <td className="py-3 pl-2 text-sm text-gray-600">{new Date(m.date).toLocaleDateString()}</td>
                        <td className="py-3 text-sm text-gray-800">
                          <button
                            onClick={() => setSelectedMovement(m)}
                            className="text-left w-full hover:underline text-sm text-blue-600 font-semibold cursor-pointer"
                            title="Ver detalles del movimiento"
                          >
                            {m.product?.name}
                          </button>
                        </td>
                        <td className="py-3 text-sm text-gray-700">{m.quantity}</td>
                        <td className="py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${m.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {m.type === 'IN' ? 'Entrada' : 'Salida'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedMovement && (
        <MovementDetailsModal movement={selectedMovement} onClose={() => setSelectedMovement(null)} />
      )}
    </div>
  );
}