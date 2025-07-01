"use client";
import React, { useState } from "react";
import SidebarDashboard from "./SidebarDashboard";
import { useProfile } from "@/context/ProfileProvider";
import Dropdown from "../Dropdown";
import { Checkbox } from "flowbite-react";
import Ticket from "../Fair/Ticket";
import { DropdownOption, FairCategories, IFair } from "@/types";
import { useFair } from "@/context/FairProvider";
import useFairSelection from "@/helpers/useFairSelection";
import Navbar from "../Navbar";
import WithAuthProtect from "@/helpers/WithAuth";
import "./Fair.css";

const Fairs = () => {

  const handleDeleteFair = async (fairId: string) => {
    const confirmed = confirm("¿Estás seguro que querés eliminar esta feria?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fairs/${fairId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Error al eliminar la feria");
      window.location.reload(); // O actualizar estado si se maneja localmente
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la feria");
    }
  };

  const [termsChecked, setTermsChecked] = useState(false);
  const [salesChecked, setSalesChecked] = useState("Elegí una opcion");
  const { userDtos } = useProfile();
  const { activeFair } = useFair();
  const {
    selectedOption,
    categoriesArray,
    selectedOptionCategory,
    handleSelect,
    handleSelectCategory,
    fairDescription,
  } = useFairSelection();

  const activeArray = [activeFair];

  const handleCheckboxChangeTerms = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTermsChecked(event.target.checked);
  };

  const handleDropdownChange = (selectedOption: DropdownOption) => {
    setSalesChecked(selectedOption.name);
  };

  const isSellerInactive = userDtos?.seller?.status === "no_active";
  const isUserInactive = userDtos?.statusGeneral === "inactive";

  return (
    <div className="bg-secondary-lighter h-full">
      <div className="w-full h-32 flex items-center bg-primary-lighter">
        <Navbar />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-8 gap-0 relative place-content-center">
        <div className="hidden sm:block bg-secondary-lighter h-full col-span-1">
          <SidebarDashboard userRole={userDtos?.role} />
        </div>
        <div className="bg-secondary-lighter flex flex-col items-center lg:h-[100vh] col-span-1 sm:col-span-7 px-4 py-8">
          {isSellerInactive && isUserInactive ? (
            <div className="flex flex-col justify-center items-center p-5 w-full max-w-5xl">
              <h1 className="text-primary-darker p-2 font-semibold text-4xl">
                Ferias
              </h1>
              <div className="p-8 pb-16 shadow-md w-full flex flex-col">
                <h2 className="text-primary-darker font-semibold mb-3 text-3xl">
                  Inscripción
                </h2>
                <div className="gap-8 flex flex-col lg:flex-row w-full">
                  <div className="flex flex-col w-full lg:w-1/2 gap-6 items-center">
                    <h2 className="font-semibold text-primary-darker mb-2">
                      Ferias disponibles
                    </h2>
                    <Dropdown
                      value={selectedOption || "Elegí una opción"}
                      options={activeArray?.map((f: IFair | undefined) => ({
                        id: "",
                        name: f ? f.name : "No hay Feria disponible",
                      }))}
                      onSelect={handleSelect}
                      className="lg:w-full z-20"
                    />
                    <h2 className="font-semibold text-primary-darker mb-2">
                      Categorías disponibles
                    </h2>
                    <Dropdown
                      value={selectedOptionCategory || "Elegí una opción"}
                      options={categoriesArray
                        ?.filter((c: FairCategories) => c.maxSellers > 0)
                        .map((c: FairCategories) => ({
                          id: c.id,
                          name: c.category?.name || "Categoría no disponible",
                        }))}
                      onSelect={handleSelectCategory}
                      className="lg:w-full"
                    />

                    <div className="mt-2">
                      {categoriesArray?.map((c: FairCategories) => (
                        <div key={c.id} className="text-sm text-gray-600">
                          <p>
                            {c.category?.name}:{" "}
                            {c.maxSellers > 0
                              ? `${c.maxSellers} cupos`
                              : "Sin cupos"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="text-center w-full mt-5">
                      <p className="text-primary-darker font-semibold text-lg">
                        ¿Participás de la liquidación?
                      </p>
                      <p className="text-primary-darker text-sm sm:text-base px-4 py-2 rounded-md max-w-lg mx-auto">
                        Al sumarte, tus precios se reducen un 25%, y recibirás
                        el 70% del precio de Liquidación
                      </p>
                    </div>

                    <Dropdown
                      value={salesChecked || ""}
                      options={[
                        { id: "1", name: "si" },
                        { id: "2", name: "no" },
                      ]}
                      onSelect={handleDropdownChange}
                      className="lg:w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/2 gap-6">
                    <div className="w-full h-32">
                      <h2 className="font-semibold text-primary-darker mb-2">
                        Información y requisitos
                      </h2>
                      <a
                        href={fairDescription || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 shadow-md rounded-lg h-full block 
                   overflow-auto break-words p-4 hover:underline hover:text-primary-darker-dark"
                      >
                        {fairDescription || "Selecciona una feria"}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                      <Checkbox
                        id="acceptTerms"
                        checked={termsChecked}
                        onChange={handleCheckboxChangeTerms}
                      />
                      <p>Acepto Información y requisitos</p>
                    </div>

                    <div className="flex justify-center mt-4">
                      <Ticket
                        name={selectedOption || ""}
                        salesChecked={salesChecked}
                        category={selectedOptionCategory}
                        termsChecked={termsChecked}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full items-center justify-center pb-16 flex flex-col text-primary-dark gap-16">
              <h1 className="text-primary-darker pt-12 font-semibold text-3xl">
                ¡Ya te registraste para vender! 🎉
              </h1>
              <div className="bg-transparent w-full sm:w-2/3 lg:w-1/3 shadow-lg rounded-lg p-6">
                {userDtos?.seller?.registrations
                  ?.filter(
                    (fairRegistred) => fairRegistred.fair?.id === activeFair?.id
                  )
                  .map((fairRegistred) => (
                    <div
                      key={fairRegistred.fair?.id}
                      className="flex justify-between flex-col gap-4 text-lg"
                    >
                      <p className="text-xl mt-2">
                        <strong>Feria:</strong> {fairRegistred.fair?.name}
                      </p>
                      <p className="text-xl mt-2">
                        * Ve a la pestaña de productos y comienza a cargar tus
                        artículos
                      </p>
                      <a
                        href="/dashboard/products"
                        className="mt-4 px-4 py-2 w-fit m-auto text-white rounded-md hover:bg-primary-dark bg-primary-darker text-center"
                      >
                        Ir ahora
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithAuthProtect({ Component: Fairs, role: "seller" });
