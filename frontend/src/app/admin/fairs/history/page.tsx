'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FairsHistoryPage() {
  const [fairs, setFairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFairs = async () => {
    try {
      const res = await axios.get('/api/fairs/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFairs(res.data);
    } catch (error) {
      console.error('Error al cargar historial de ferias', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFair = async (id: string) => {
    const confirmDelete = confirm("¿Eliminar esta feria definitivamente?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/fairs/history/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("Feria eliminada del historial.");
      fetchFairs();
    } catch (error) {
      alert("Error al eliminar la feria.");
    }
  };

  useEffect(() => {
    fetchFairs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Ferias Concluidas</h1>

      {loading ? (
        <p>Cargando ferias...</p>
      ) : fairs.length === 0 ? (
        <p>No hay ferias concluidas.</p>
      ) : (
        <ul className="space-y-4">
          {fairs.map((fair) => (
            <li key={fair.id} className="border p-4 rounded-md shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{fair.name}</h2>
                <p className="text-sm text-gray-600">{fair.address}</p>
              </div>
              <button
                onClick={() => deleteFair(fair.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
