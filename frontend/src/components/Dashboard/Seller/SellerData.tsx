"use client";
import { useFair } from "@/context/FairProvider";
import { useProfile } from "@/context/ProfileProvider";
import { StepProps } from "@/types";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SellerData: React.FC<StepProps> = ({ setVisibleStep }) => {
  const { userDtos, sellerDtos } = useProfile();
  const { activeFair } = useFair();
  const fairSeller = activeFair?.sellerRegistrations.find(
    (registration: any) => registration.seller.id === sellerDtos?.id
  );
  const sellerCategoryFair = fairSeller?.categoryFair;
  const maxProducts = sellerCategoryFair?.maxProductsSeller ?? 0;
  const minProducts = sellerCategoryFair?.minProductsSeller ?? 0;

  return (
    <div className="mt-4 bg-secondary-lighter rounded-md max-h-full min-h-[50vh] max-w-full min-w-[50%] shadow-lg font-semibold text-primary-dark p-10 overflow-auto">
      <div className="bg-secondary-lighter rounded-md max-h-full min-h-[40vh] max-w-full min-w-[40%] shadow-lg font-semibold text-primary-dark p-5 overflow-auto">
  <div className="space-y-6 text-lg gap-5"> 
    <h4 className="mb-5">MIS DATOS</h4>
    <div className="flex justify-between border-t border-primary-lighter mb-6"> 
      <p>Nombre:</p>
      <p className="text-gray-400 font-normal cursor-default">
        {userDtos?.name}
      </p>
    </div>
    <div className="flex justify-between border-t border-primary-lighter mb-6">
      <p>Apellido:</p>
      <p className="text-gray-400 font-normal cursor-default">
        {userDtos?.lastname}
      </p>
    </div>
    <div className="flex justify-between border-t border-primary-lighter mb-6">
      <p>SKU:</p>
      <p className="text-gray-400 font-normal cursor-default">
        {userDtos?.seller?.sku}
      </p>
    </div>
    <div className="flex justify-between border-t border-primary-lighter mb-6">
      <p>Feria Actual:</p>
      <p className="text-gray-400 font-normal cursor-default">
        {activeFair?.name}
      </p>
    </div>
    <div className="flex justify-between border-t border-primary-lighter mb-6">
      <p>Categoría:</p>
      <p className="text-gray-400 font-normal cursor-default">
        {fairSeller?.categoryFair?.category?.name}
      </p>
    </div>
    <div className="flex justify-between border-t border-primary-lighter mb-6">
      <p>Participa de la liquidación:</p>
      <p className="text-gray-400 font-normal cursor-default">
        {fairSeller?.liquidation ? "Sí" : "No"}
      </p>
    </div>
    <div className="flex justify-between border-t border-primary-lighter mb-6">
      <p>
        Recordá que el mínimo de productos para la categoría que te
        inscribiste es de: {minProducts}, y el máximo de productos es de:{" "}
        {maxProducts}
      </p>
    </div>
  </div>
</div>

      <div className="w-full flex items-end justify-between mt-5">
        <button
          onClick={() => setVisibleStep("TIPS")}
          className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-lighter transition duration-200">
          <FaChevronLeft />
          <span>Volver</span>
        </button>

        <button
          onClick={() => setVisibleStep("PRODUCTOS")}
          className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-light transition duration-200"
        >
          <span>Continuar</span>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SellerData;
