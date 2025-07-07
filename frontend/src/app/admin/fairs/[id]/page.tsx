'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FairDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [fair, setFair] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFair = async () => {
      try {
        const response = await axios.get(`/api/fairs/${id}`);
        setFair(response.data);
      } catch (error) {
        console.error('Error al cargar la feria', error);
      }
    };

    fetchFair();
  }, [id]);

  const handleConcludeFair = async () => {
    const confirmed = confirm('¿Estás seguro de concluir esta feria? Esta acción eliminará todos sus datos.');

    if (!confirmed) return;

    try {
      setLoading(true);
      await axios.delete(`/api/fairs/conclude/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Feria concluida correctamente.');
      router.push('/admin/fairs');
    } catch (error) {
      alert('Error al concluir la feria.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!fair) return <div className="p-4">Cargando feria...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalle de la Feria</h1>
      <p><strong>Nombre:</strong> {fair.name}</p>
      <p><strong>Dirección:</strong> {fair.address}</p>
      <p><strong>Precio comprador:</strong> {fair.entryPriceBuyer}</p>

      <button
        onClick={handleConcludeFair}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Concluyendo...' : 'Concluir Feria'}
      </button>
    </div>
  );
}
