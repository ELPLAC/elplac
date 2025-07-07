'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Modal } from 'flowbite-react';
import { toast } from 'react-toastify';

export default function ConcluirFeriaButton({ fairId }: { fairId: string }) {
  const { data: session } = useSession();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const isAdmin = session?.user?.roles?.includes('admin');

  if (!isAdmin) return null;

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/fairs/${fairId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      toast.success('Feria eliminada correctamente');
      router.push('/admin/fairs'); // redirige al listado
    } catch (err) {
      toast.error('Error al concluir la feria');
    } finally {
      setOpenModal(false);
    }
  };

  return (
    <>
      <Button color="failure" onClick={() => setOpenModal(true)}>
        Concluir feria
      </Button>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>¿Concluir feria?</Modal.Header>
        <Modal.Body>
          Esta acción eliminará todos los productos, registros y datos de esta feria. ¿Estás seguro?
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDelete}>
            Confirmar
          </Button>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
