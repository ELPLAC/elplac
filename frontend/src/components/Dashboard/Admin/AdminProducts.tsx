"use client";
import React, { useEffect, useState } from "react";
import { IProductNotification, productsStatusEnum } from "@/types";
import { getAllProducts } from "@/helpers/services";
import { useAuth } from "@/context/AuthProvider";
import ProductsTable from "@/components/Table/ProductsTable";
import { useFair } from "@/context/FairProvider";
import WithAuthProtect from "@/helpers/WithAuth";
import downloadCSV from "@/helpers/exportToExcel";
import Papa from "papaparse";

const AdminProducts = () => {
  const { token } = useAuth();
  const { activeFair } = useFair();
  const [products, setProducts] = useState<IProductNotification[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [openModalExport, setOpenModalExport] = useState<boolean>(false);

  useEffect(() => {
    if (token && activeFair) {
      getAllProducts(token)
        .then((res) => {
          const filteredProducts = res.filter(
            (product: IProductNotification) =>
              product.fairCategory?.fair?.id === activeFair.id
          );
          setProducts(filteredProducts);
        })
        .catch((error) => {});
    }
  }, [token, trigger, activeFair]);

  const handleExport = () => {
    const filename = `${activeFair?.name || "feria_actual"}.csv`;
    const data = products.map((product) => ({
      SKU: product.code || "-",
      Descripcion: product.description,
      Precio: product.price,
      Marca: product.brand,
      Talle: product.size,
      Liquidacion: product.liquidation ? "Si" : "No Aplica",
      EstadoFinal: finalStateTranslate[product.status],
      Vendedor: product.seller.user?.name + " " + product.seller.user?.lastname,
    }));

    const csvContent = Papa.unparse(data);
    downloadCSV(csvContent, filename);
  };

  const finalStateTranslate = {
    accepted: "Aceptado",
    acceptedPlay: "Aceptado PLAY",
    notAccepted: "No aceptado",
    notAvailable: "No entregado",
    categoryNotApply: "No corresponde",
    secondMark: "Segunda marca",
    pendingVerification: "Pendiente de verificación",
    sold: "Vendido",
    soldOnClearance: "Vendido en liquidación",
    unsold: "No vendido",
  };

  const totalProducts = products.length || 0;
  const acceptedProducts = products.filter(
    (product) => 
      product.status === productsStatusEnum.accepted || 
      product.status === productsStatusEnum.acceptedPlay
  ).length;
  
  const rejectedProducts = products.filter(
    (product) =>
      product.status === productsStatusEnum.notAccepted ||
      product.status === productsStatusEnum.secondMark ||
      product.status === productsStatusEnum.categoryNotApply ||
      product.status === productsStatusEnum.notAvailable
  ).length;
  const pendingProducts = products.filter(
    (product) => product.status === "pendingVerification"
  ).length;

  const soldProducts = products.filter(
    (product) => product.status === productsStatusEnum.sold
  ).length;

  const unSoldProducts = products.filter(
    (product) => product.status === productsStatusEnum.unsold
  ).length;

  const soldOnClarence = products.filter(
    (product) => product.status === productsStatusEnum.soldOnClearance
  ).length;

  const sellersColumns = [
    { id: "sku", label: "SKU", sortable: true },
    { id: "fairCategory", label: "Categoria", sortable: true },
    { id: "status", label: "Estado", sortable: true },
    { id: "seller", label: "Vendedor", sortable: true },
    { id: "details", label: "Detalles", sortable: true },
  ];

  const detailsColumns = [
    { id: "code", label: "Código", sortable: true },
    { id: "size", label: "Talle", sortable: true },
    { id: "brand", label: "Marca/Autor", sortable: true },
    { id: "description", label: "Descripción/Título", sortable: true },
    { id: "price", label: "Precio", sortable: true },
    { id: "liquidation", label: "Liquidación", sortable: true },
    { id: "actions", label: "Acciones", sortable: true },
    { id: "seller", label: "Vendedor", sortable: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_1fr] mt-8 gap-5">
      <div className="col-span-1 md:col-span-2">
        <div className="w-full mt-5 flex p-6 flex-col rounded-lg bg-[#f1fafa]">
          <div>
            <div className="gap-4 flex justify-between sm:justify-end">
              <button
                onClick={() => setOpenModalExport(true)}
                className="bg-[#ebfafa] flex items-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="#2F8083"
                    d="M178.34 165.66L160 147.31V208a8 8 0 0 1-16 0v-60.69l-18.34 18.35a8 8 0 0 1-11.32-11.32l32-32a8 8 0 0 1 11.32 0l32 32a8 8 0 0 1-11.32 11.32M160 40a88.08 88.08 0 0 0-78.71 48.68A64 64 0 1 0 72 216h40a8 8 0 0 0 0-16H72a48 48 0 0 1 0-96c1.1 0 2.2 0 3.29.12A88 88 0 0 0 72 128a8 8 0 0 0 16 0a72 72 0 1 1 100.8 66a8 8 0 0 0 3.2 15.34a7.9 7.9 0 0 0 3.2-.68A88 88 0 0 0 160 40"
                  />
                </svg>
                Exportar
              </button>
            </div>
            <h1 className="font-semibold text-primary-darker text-3xl md:text-4xl">
              {activeFair?.name}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 mt-6">
              <div className="text-left border-r border-[#5E5F60] border-opacity-50 pr-6">
                <h3 className="text-[#5E5F60] text-lg">Productos</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {totalProducts}
                </span>
              </div>
              <div className="text-left border-r border-[#5E5F60] border-opacity-50 pr-6">
                <h3 className="text-[#5E5F60] text-lg">Aceptados</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {acceptedProducts}
                </span>
              </div>
              <div className="text-left border-r border-[#5E5F60] border-opacity-50 pr-6">
                <h3 className="text-[#5E5F60] text-lg">No aceptados</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {rejectedProducts}
                </span>
              </div>
              <div className="text-left border-r border-[#5E5F60] border-opacity-50 pr-6">
                <h3 className="text-[#5E5F60] text-lg">
                  Pendiente verificación
                </h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {pendingProducts}
                </span>
              </div>
              <div className="text-left border-r border-[#5E5F60] border-opacity-50 pr-6">
                <h3 className="text-[#5E5F60] text-lg">Vendidos</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {soldProducts}
                </span>
              </div>
              <div className="text-left border-r border-[#5E5F60] border-opacity-50 pr-6">
                <h3 className="text-[#5E5F60] text-lg">No vendidos</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {unSoldProducts}
                </span>
              </div>
              <div className="text-left">
                <h3 className="text-[#5E5F60] text-lg">
                  Vendidos en liquidación
                </h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {soldOnClarence}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row-span-3 col-span-2 h-[30rem] bg-[#f1fafa] w-full overflow-y-auto">
        <ProductsTable
          columns={sellersColumns}
          detailColumns={detailsColumns}
          trigger={trigger}
          products={products}
          activeFair={activeFair}
          setTrigger={setTrigger}
        />
        {openModalExport && (
          <div
            className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setOpenModalExport(false)}
          >
            <div
              className="bg-primary-lighter h-[40vh] w-[80vw] sm:w-[50vw] p-8 m-3 md:m-0 rounded-3xl relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-2xl font-bold text-primary-darker rounded-full"
                onClick={() => setOpenModalExport(false)}
              >
                ✖
              </button>
              <div className="flex flex-col gap-4 justify-center items-center">
                <p className="font-bold text-3xl text-center text-primary-darker">
                  ¿Deseas exportar la información de esta feria?
                </p>
                <div className="gap-4 flex">
                  <button
                    onClick={() => handleExport()}
                    className="bg-primary-darker text-white w-20 p-2 rounded-lg border border-[#D0D5DD]"
                  >
                    Si
                  </button>
                  <button
                    onClick={() => setOpenModalExport(false)}
                    className="bg-white text-primary-darker w-20 p-2 rounded-lg border border-[#D0D5DD]"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithAuthProtect({ Component: AdminProducts, role: "admin" });
