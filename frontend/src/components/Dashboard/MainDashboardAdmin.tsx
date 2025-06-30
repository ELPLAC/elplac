'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserFromLocalStorage } from '@/helpers/getUserFromLocalStorage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fair } from '@/types/fair';

export default function MainDashboardAdmin() {
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [filteredFairs, setFilteredFairs] = useState<Fair[]>([]);
  const [search, setSearch] = useState('');
  const user = getUserFromLocalStorage();

  const fetchFairs = async () => {
    try {
      const { data } = await axios.get('/api/fairs');
      const concluded = data.filter((f: Fair) => f.isActive === false);
      setFairs(concluded);
      setFilteredFairs(concluded);
    } catch (err) {
      console.error('Error cargando ferias concluidas:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('¿Estás seguro de eliminar esta feria?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/fairs/conclude/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Feria eliminada correctamente');
      fetchFairs();
    } catch (err) {
      console.error('Error al eliminar la feria:', err);
      alert('No se pudo eliminar la feria.');
    }
  };

  useEffect(() => {
    fetchFairs();
  }, []);

  useEffect(() => {
    const filtered = fairs.filter((fair) =>
      fair.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFairs(filtered);
  }, [search, fairs]);

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
        <p>No hay ferias concluidas disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {filteredFairs.map((fair) => (
            <Card
              key={fair.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{fair.name}</h3>
                <p className="text-sm text-gray-600">{fair.address}</p>
              </div>

              {user?.role === 'admin' && (
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(fair.id)}
                >
                  Eliminar
                </Button>
              )}
            </Card>
          ))}
        </ul>
      )}
    </section>
  );
}
