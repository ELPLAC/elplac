"use client";
import Dropdown from "@/components/Dropdown";
import Calendar from "@/components/Fair/Calendar";
import Ticket from "@/components/Fair/Ticket";
import TimeRange from "@/components/Fair/TimeRange";
import { notify } from "@/components/Notifications/Notifications";
import { useAuth } from "@/context/AuthProvider";
import { useFair } from "@/context/FairProvider";
import { useProfile } from "@/context/ProfileProvider";
import { IFair, ProfileFairsProps } from "@/types";
import { useState } from "react";

const ProfileFairs: React.FC<ProfileFairsProps> = ({
  selectedOption,
  fairs,
  handleSelect,
}) => {
  const { userDtos } = useProfile();
  const { activeFair } = useFair();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { token } = useAuth();

  
  const fairFilter = fairs?.find(
    (f: IFair | undefined) => f?.id === activeFair?.id
  );
  console.log("feria activa", activeFair);

  console.log("feria disponible", fairFilter);
  
  console.log("dias de feria", fairFilter?.fairDays);

  const isUserInactive = userDtos?.statusGeneral === "inactive";

  const lastRegisteredFair = userDtos?.registrations?.find(
    (reg) => reg.fair?.id === activeFair?.id
  );

  const handleCancel = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://elplac-production-3a9f.up.railway.app/users/${userDtos?.id}/cancel/fair/${activeFair?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cancelar turno");

      notify("ToastSuccess", "Turno cancelado exitosamente");
    } catch (error) {
      console.error(error);
      notify("ToastError", "Error al cancelar turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-primary-dark mt-3 h-full w-full px-4 sm:px-2">
      {isUserInactive ? (
        <>
          <label className="font-bold text-lg sm:text-base">
            Ferias Disponibles
          </label>
          <div className="w-full mt-3 sm:mt-4">
            <Dropdown
              value={selectedOption || "Selecciona una feria"}
              options={fairs?.map((f: IFair | undefined) => ({
                id: f?.id || "",
                name: f ? f.name : "No hay Feria disponible",
              }))}
              onSelect={handleSelect}
              className="w-48 z-10"
            />
          </div>
          {userDtos?.role === "user" && (
            <>
              <Calendar fairDays={fairFilter?.fairDays || []} />
              <TimeRange />
            </>
          )}
          <Ticket name={selectedOption || null} />
        </>
      ) : (
        <>
          <div className="flex flex-col">
            <label className="font-bold">¡Ya tenés tu turno reservado!</label>
            <div className="bg-transparent border-b w-2/3 text-wrap text-sm sm:text-base border-primary-dark">
              {lastRegisteredFair ? (
                <div
                  key={lastRegisteredFair.id}
                  className="flex justify-between flex-col gap-4"
                >
                  <p>Feria: {lastRegisteredFair?.fair?.name}</p>
                  <p>
                    Hora:{" "}
                    {new Date(
                      lastRegisteredFair?.registrationDay as string
                    ).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p>Hora: {lastRegisteredFair?.registrationHour}</p>
                  <p>Dirección: {lastRegisteredFair?.fair?.address}</p>
                  <p className="text-sm mt-2">
                    * Revisa tu casilla de correo para obtener el QR con tus
                    datos, que te permitirá ingresar al Showroom. Te esperamos!
                  </p>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Cancelando..." : "Cancelar turno"}
                  </button>

                  {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <p className="text-lg font-semibold text-gray-900 text-center">
                          ⚠️ AVISO IMPORTANTE ⚠️ <br />
                          ¿Estás seguro de que quieres cancelar tu turno? Esta
                          acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-between gap-4">
                          <button
                            onClick={() => setModalOpen(false)}
                            className="w-1/2 px-4 py-3 text-lg font-semibold text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-lg transition-all"
                            disabled={loading}
                          >
                            NO CANCELAR
                          </button>
                          <button
                            onClick={async () => {
                              setLoading(true);
                              await handleCancel();
                              setLoading(false);
                              setModalOpen(false);
                            }}
                            className="w-1/2 px-4 py-3 text-lg font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all"
                            disabled={loading}
                          >
                            {loading ? "Cancelando..." : "CANCELAR"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p>No tienes ninguna feria registrada para mostrar.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileFairs;
