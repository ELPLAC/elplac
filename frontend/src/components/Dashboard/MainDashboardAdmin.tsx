'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';

interface Fair {
  id: string;
  name: string;
  address: string;
  entryDescription: string;
  isActive: boolean;
}

export default function MainDashboardAdmin() {
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [search, setSearch] = useState('');
  
  const fetchFairs = async () => {
    try {
      const { data } = await axios.get('/api/fairs');
      const concludedFairs = data.filter((f: Fair) => !f.isActive);
      setFairs(concludedFairs);
    } catch (err) {
      console.error('Error al obtener ferias concluidas:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('¿Eliminar esta feria definitivamente?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/fairs/conclude/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setFairs((prev) => prev.filter((fair) => fair.id !== id));
      alert('Feria eliminada correctamente.');
    } catch (err) {
      console.error('Error al eliminar la feria:', err);
      alert('Error al eliminar la feria.');
    }
  };

  useEffect(() => {
    fetchFairs();
  }, []);

  const filteredFairs = fairs.filter((fair) =>
    fair.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ferias concluidas</h2>

      <input
        type="text"
        placeholder="Buscar feria..."
        className="border px-4 py-2 rounded w-full mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredFairs.length === 0 ? (
        <p>No hay ferias concluidas.</p>
      ) : (
        <div className="space-y-4">
          {filteredFairs.map((fair) => (
            <Card
              key={fair.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{fair.name}</h3>
                <p className="text-sm text-gray-600">{fair.address}</p>
                <p className="text-sm text-gray-500">{fair.entryDescription}</p>
              </div>

                 <button
  onClick={() => handleDelete(fair.id)}
  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
>
  Eliminar
</button>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

