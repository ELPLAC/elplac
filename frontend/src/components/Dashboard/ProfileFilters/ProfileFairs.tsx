"use client";
import Dropdown from "@/components/Dropdown";
import Calendar from "@/components/Fair/Calendar";
import Ticket from "@/components/Fair/Ticket";
import TimeRange from "@/components/Fair/TimeRange";
import { useFair } from "@/context/FairProvider";
import { useProfile } from "@/context/ProfileProvider";
import { IFair, ProfileFairsProps } from "@/types";

const ProfileFairs: React.FC<ProfileFairsProps> = ({
  selectedOption,
  fairs,
  handleSelect,
}) => {
  const { userDtos } = useProfile();
  const { activeFair } = useFair();

  const fairFilter = fairs?.find(
    (f: IFair | undefined) => f?.id === activeFair?.id
  );

  const isUserInactive = userDtos?.statusGeneral === "inactive";

  const lastRegisteredFair = userDtos?.registrations?.find(
    (reg) => reg.fair?.id === activeFair?.id
  );

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
