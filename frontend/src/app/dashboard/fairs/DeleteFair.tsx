
import React from 'react';
import axios from 'axios';

interface Props {
  fairId: string;
  onDeleted?: () => void;
}

const DeleteFair: React.FC<Props> = ({ fairId, onDeleted }) => {
  const deleteFair = async () => {
    const confirmDelete = confirm("¿Eliminar esta feria definitivamente?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/fairs/history/${fairId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Feria eliminada.");
      if (onDeleted) onDeleted();
    } catch (error) {
      alert("Error al eliminar feria.");
      console.error(error);
    }
  };

  return (
    <button
      onClick={deleteFair}
      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
    >
      Eliminar del historial
    </button>
  );
};

export default DeleteFair;
