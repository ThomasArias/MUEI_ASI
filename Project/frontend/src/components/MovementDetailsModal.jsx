import React from 'react';
import { X } from 'lucide-react';

export default function MovementDetailsModal({ movement, onClose }) {
  if (!movement) return null;

  const { product = {}, quantity, type, reason, date } = movement;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 p-6 relative z-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold mb-2">Detalles del Movimiento</h3>

        <div className="text-sm text-gray-600 space-y-2">
          <div><strong>Fecha:</strong> {date ? new Date(date).toLocaleString() : '-'}</div>
          <div className="text-lg font-semibold text-gray-800"><strong>Producto:</strong> {product.name || '-'}</div>
          {product.supplierName && <div><strong>Proveedor:</strong> {product.supplierName}</div>}
          {product.supplierReference && <div><strong>Ref. Proveedor:</strong> {product.supplierReference}</div>}
          {product.warehouseLocation && <div><strong>Ubicación:</strong> {product.warehouseLocation}</div>}
          <div><strong>Cantidad:</strong> {quantity}</div>
          <div><strong>Tipo:</strong> {type === 'IN' ? 'Entrada' : 'Salida'}</div>
          {reason && <div><strong>Motivo:</strong> {reason}</div>}
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
