import React, { useState, useEffect } from "react";
import { URL } from "../../../envs";
import { useFair } from "@/context/FairProvider";
import { notify } from "../Notifications/Notifications";

const EditFairAddress = ({
    activeFair,
    token,
    setIsEditing,
  }: {
    activeFair: any;
    token: string;
    setIsEditing: (value: boolean) => void;
  }) => {
    const [newAddress, setNewAddress] = useState(activeFair?.address || "");
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const { setActiveFair } = useFair();

  useEffect(() => {
    setNewAddress(activeFair?.address || "");
  }, [activeFair]);

  const handleSave = async () => {
    if (!newAddress) return;

    setLoadingEdit(true);
    setError(null);

    try {
      const response = await fetch(`${URL}/fairs/edit/${activeFair?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
      }
      const updatedFair = await response.json();
      notify("ToastSuccess", "Dirección actualizada con éxito, refresque la página.");

      setActiveFair(updatedFair);

      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={handleSave} disabled={loadingEdit} className="ml-2 text-green-500">
        {loadingEdit ? "Guardando..." : "Guardar"}
      </button>
      <button onClick={() => setIsEditing(false)} className="ml-2 text-red-500">
        Cancelar
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default EditFairAddress;
