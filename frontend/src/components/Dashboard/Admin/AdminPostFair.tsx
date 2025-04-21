"use client";
import React, { useEffect, useState } from "react";
import {
  IHandleSelectProductStatus,
  IProductNotification,
  productsStatusEnum,
} from "@/types";
import { getAllProducts, putProductStatus } from "@/helpers/services";
import { useAuth } from "@/context/AuthProvider";
import { useFair } from "@/context/FairProvider";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";
import WithAuthProtect from "@/helpers/WithAuth";
import Dropdown from "@/components/Dropdown";
import downloadCSV from "@/helpers/exportToExcel";
import PrintLabelForAdmin from "@/components/PrintLabel/PrintLabelForAdmin";
import { URL } from "../../../../envs";
import { notify } from "@/components/Notifications/Notifications";
import "./adminPostFair.css";

const AdminPostFair = () => {
  const { token } = useAuth();
  const { activeFair } = useFair();
  const [products, setProducts] = useState<IProductNotification[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [openModalExport, setOpenModalExport] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [skuList, setSkuList] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [invalidSkus, setInvalidSkus] = useState<string[]>([]);
  const [duplicateSkus, setDuplicateSkus] = useState<string[]>([]);

  const handleBulkUpdate = async () => {
    const skuArray = skuList.split(",").map((sku) => sku.trim());

    if (skuArray.length === 0 || !skuList.trim()) {
      notify("ToastError", "Por favor, ingrese al menos un SKU.");
      return;
    }

    const uniqueSkuArray = [...new Set(skuArray)];

    const duplicateSkus = skuArray.filter(
      (sku, index) => skuArray.indexOf(sku) !== index
    );

    const productsToUpdate = products.filter((product) =>
      uniqueSkuArray.includes(product.code)
    );

    const invalidSkusList = uniqueSkuArray.filter(
      (sku) => !products.some((product) => product.code === sku)
    );

    if (invalidSkusList.length > 0) {
      setInvalidSkus(invalidSkusList);
    } else {
      setInvalidSkus([]);
    }

    if (duplicateSkus.length > 0) {
      notify("ToastRegular", "Advertencia: Algunos SKU fueron duplicados.");
      setDuplicateSkus(duplicateSkus);
    } else {
      setDuplicateSkus([]);
    }

    if (productsToUpdate.length === 0) {
      notify(
        "ToastError",
        "No se encontraron productos con los SKU ingresados."
      );
      return;
    }

    try {
      for (const product of productsToUpdate) {
        await putProductStatus(product.id, selectedStatus, token);
      }

      setTrigger((prev) => !prev);
      notify(
        "ToastSuccess",
        `Estado actualizado para ${productsToUpdate.length} productos.`
      );
    } catch (error: any) {
      notify("ToastError", "Hubo un error al actualizar los productos.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSkuList(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token && activeFair) {
          if (activeFair?.isActive === true) {
            const allProducts = await getAllProducts(token);

            const productsAccepted = allProducts.filter(
              (product: IProductNotification) => {
                return (
                  activeFair.fairCategories.some(
                    (categoryFair) =>
                      categoryFair.id === product.fairCategory?.id
                  ) &&
                  [
                    productsStatusEnum.accepted,
                    productsStatusEnum.unsold,
                    productsStatusEnum.sold,
                    productsStatusEnum.soldOnClearance,
                    productsStatusEnum.acceptedPlay,
                  ].includes(product.status)
                );
              }
            );

            setProducts(productsAccepted);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
      }
    };

    fetchData();
  }, [token, trigger, activeFair]);

  const filteredProducts = products.filter((product) =>
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => num.toLocaleString("es-ES");

  // Precio total de toda la mercancía
  const valorTotal = formatNumber(
    Math.round(products.reduce((acc, product) => acc + product.price, 0))
  );
  
  // Cantidad de productos "vendidos" con status sold
  const soldedProducts = products.filter(
    (product) => product.status === "sold"
  ).length;
  
  // Suma total de productos vendidos
const totalSoledProducts = products
.filter((product) => product.status === "sold")
.reduce((acc, product) => acc + product.price, 0);

// Función para truncar a 2 decimales sin redondear
const truncateToTwoDecimals = (num: number) => Math.trunc(num * 100) / 100;

// Truncar el total y las ganancias
const truncatedTotal = truncateToTwoDecimals(totalSoledProducts);
const truncatedGananciasTPV = truncateToTwoDecimals(truncatedTotal * 0.3);

// Formatear como string con 2 decimales y coma decimal (es-AR)
const priceSoledProducts = truncatedTotal.toLocaleString("es-AR", {
minimumFractionDigits: 2,
maximumFractionDigits: 2,
});

const gananciasTPV = truncatedGananciasTPV.toLocaleString("es-AR", {
minimumFractionDigits: 2,
maximumFractionDigits: 2,
});

  // Cantidad de productos "vendidos en liquidación" con status soldOnClearance
  const soldedOnClearance = products.filter(
    (product) => product.status === "soldOnClearance"
  ).length;
  
  // Cálculo del 25% de descuento por liquidación para cada producto
  const totalPriceSoldOnClearanceProducts = formatNumber(
    Math.round(
      products
        .filter((product) => product.status === "soldOnClearance")
        .reduce((acc, product) => acc + product.price * 0.75, 0)
    )
  );
  
  // 30% del total de las ganancias de los productos vendidos con status soldOnClearance
  const gananciasTPVOnClearance = formatNumber(
    Math.round((Number(totalPriceSoldOnClearanceProducts) || 0) * 0.3)
  );
  
  // Cantidad de productos "no vendidos"
  const unSoldedProducts = products.filter(
    (product) => product.status === "unsold"
  ).length;
  
  // Valor total de los productos "no vendidos"
  const priceUnSoldedProducts = formatNumber(
    Math.round(
      products
        .filter((product) => product.status === "unsold")
        .reduce((acc, product) => acc + product.price, 0)
    )
  );
  
  const applyLiquidation = (price: number) => {
    const discount = price * 0.25;
    return price - discount;
  };

  const actionsOptions = [
    { id: productsStatusEnum.sold, name: "Vendido" },
    { id: productsStatusEnum.soldOnClearance, name: "Vendido en liquidación" },
    { id: productsStatusEnum.unsold, name: "No vendido" },
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

  const handleSelect = async ({ id, status }: IHandleSelectProductStatus) => {
    try {
      const res = await putProductStatus(id, status, token);
      setTrigger((prev) => !prev);
    } catch (error: any) {}
  };

  const handleInformVendors = async () => {
    if (!Array.isArray(products) || products.length === 0) {
      notify("ToastError", "No hay productos para informar a los vendedores.");
      return;
    }

    const sellerIds = Array.from(
      new Set(products.map((product) => product.seller.id))
    );

    if (sellerIds.length === 0) {
      notify("ToastError", "No hay vendedores para informar.");
      return;
    }

    try {
      const response = await fetch(`${URL}/sellers/informSellers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al informar a los vendedores."
        );
      }

      notify("ToastSuccess", "Vendedores informados correctamente.");
    } catch (error) {
      console.error("Error en informSeller:", error);
      notify("ToastError", `Hubo un error`);
    }
  };

  const finalStateTranslate = {
    accepted: "Aceptado",
    notAccepted: "No aceptado",
    notAvailable: "No entregado",
    categoryNotApply: "No corresponde",
    secondMark: "Segunda marca",
    pendingVerification: "Pendiente de verificación",
    sold: "Vendido",
    soldOnClearance: "Vendido en liquidación",
    unsold: "No vendido",
    acceptedPlay: "Aceptado Play",
  };

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

  return (
    <div className="grid grid-rows-[auto_auto_1fr] grid-cols-2 mx-20 mt-8 gap-5 color">
      <div className="col-span-2">
        <div>
          <div className="gap-4 flex justify-end">
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
          <div className="flex items-end justify-end gap-2 mt-5 mb-5">
            <PrintLabelForAdmin fairId={activeFair?.id} />
          </div>

          <div className="w-full mt-5 flex p-4 md:p-6 flex-col rounded-lg bg-[#f1fafa]">
            <div>
              <h1 className="font-semibold text-primary-darker text-2xl md:text-3xl">
                {activeFair?.name}
              </h1>
              <div className="mt-4">
                <h3 className="text-[#5E5F60] text-lg">
                  Actualizar estado en masa
                </h3>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-2">
                  <textarea
                    placeholder="Ingrese los SKU separados por coma"
                    value={skuList}
                    onChange={handleInputChange}
                    className="input-sku p-2 border border-gray-300 rounded-md w-full md:w-auto"
                    rows={2}
                  />
                  <Dropdown
                    options={actionsOptions}
                    onSelect={(selectedOption) =>
                      setSelectedStatus(selectedOption.id)
                    }
                    value={selectedStatus || "Selecciona el estado"}
                    className="dropdown-status w-full md:w-auto"
                  />
                  <button
                    onClick={handleBulkUpdate}
                    className="bg-primary-darker text-white p-2 rounded-lg h-[3rem] hover:bg-primary-darker/80 w-full md:w-auto"
                  >
                    Actualizar Estado
                  </button>
                </div>
                {invalidSkus.length > 0 && (
                  <div className="warning-container mt-4">
                    <h3 className="warning-title text-red-600 font-semibold">
                      Advertencia: SKU no encontrados
                    </h3>
                    <ul className="warning-list list-disc pl-5 text-red-500">
                      {invalidSkus.map((sku, index) => (
                        <li key={index}>{sku}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {duplicateSkus.length > 0 && (
                  <div className="warning-container-dup mt-4">
                    <h3 className="warning-title-dup text-yellow-600 font-semibold">
                      Advertencia: SKU duplicados
                    </h3>
                    <p className="warning-p-dup text-yellow-500">
                      (Los productos se actualizan correctamente)
                    </p>
                    <ul className="warning-list-dup warning-duplicate list-disc pl-5 text-yellow-500">
                      {duplicateSkus.map((sku, index) => (
                        <li key={index}>{sku}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-5 flex p-4 md:p-6 flex-col rounded-lg bg-[#f1fafa]">
          <div>
            <h1 className="font-semibold text-primary-darker text-2xl md:text-3xl">
              {activeFair?.name}
            </h1>

            <div className="flex flex-col md:flex-wrap md:flex-row gap-4 md:gap-6 mt-4">
              <div className="border border-black"></div>

              <div>
                <h3 className="text-[#5E5F60] text-lg">T. Stock</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  ${valorTotal}
                </span>
              </div>
              <div>
                <h3 className="text-[#5E5F60] text-lg">#T. Stock</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {products.length}
                </span>
              </div>

              <div className="border border-black"></div>

              <div>
                <h3 className="text-[#5E5F60] text-lg">Monto T.P.V.</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  ${priceSoledProducts}
                </span>
              </div>
              <div>
                <h3 className="text-[#5E5F60] text-lg">T. Ingreso N.</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  ${gananciasTPV}
                </span>
              </div>

              <div>
                <h3 className="text-[#5E5F60] text-lg">#Ventas</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {soldedProducts}
                </span>
              </div>

              <div className="border border-black"></div>

              <div>
                <h3 className="text-[#5E5F60] text-lg">Monto T.P.V.Liq.</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  ${totalPriceSoldOnClearanceProducts}
                </span>
              </div>
              <div>
                <h3 className="text-[#5E5F60] text-lg">T. Ingreso N.Liq.</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  ${gananciasTPVOnClearance}
                </span>
              </div>
              <div>
                <h3 className="text-[#5E5F60] text-lg">#Ventas Liq</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  {soldedOnClearance}
                </span>
              </div>
              <div className="border border-black"></div>
              <div>
                <h3 className="text-[#5E5F60] text-lg">$No vend.</h3>
                <span className="text-[#5E5F60] text-3xl font-bold">
                  ${priceUnSoldedProducts}
                </span>
              </div>
              <div>
                <div>
                  <h3 className="text-[#5E5F60] text-lg">#No vend.</h3>
                  <span className="text-[#5E5F60] text-3xl font-bold">
                    {unSoldedProducts}
                  </span>
                </div>
              </div>
              <div className="border border-black"></div>

              <div className="w-full md:w-auto flex items-center text-primary-darker gap-2 ">
                <input
                  type="text"
                  placeholder="Buscar por SKU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-auto p-2 border rounded-md"
                />
              </div>
              <button
                onClick={handleInformVendors}
                className="bg-[#ebfafa] flex items-center text-primary-darker gap-2 border border-[#D0D5DD] rounded-lg hover:bg-[#D0D5DD] hover:text-[#ebfafa] p-2"
              >
                Informar a los vendedores
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row-span-3 col-span-2 h-[40rem] bg-[#f1fafa] w-full overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="bg-[#f1fafa] w-full table-auto min-w-full border-collapse">
            <thead className="hidden md:table-header-group">
              <tr>
                {detailsColumns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className="px-6 py-3 text-left"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: IProductNotification) => (
                  <tr
                    key={product.id}
                    className="shadow-sm block md:table-row border-b"
                  >
                    <td className="px-6 py-4 text-primary-darker font-medium block md:table-cell">
                      <span className="md:hidden font-bold">Código: </span>
                      {product.code}
                    </td>
                    <td className="px-6 py-4 text-primary-darker font-medium block md:table-cell">
                      <span className="md:hidden font-bold">Tamaño: </span>
                      {product.size}
                    </td>
                    <td className="px-6 py-4 text-primary-darker font-medium block md:table-cell">
                      <span className="md:hidden font-bold">Marca: </span>
                      {product.brand}
                    </td>
                    <td className="px-6 py-4 text-primary-darker font-medium block md:table-cell">
                      <span className="md:hidden font-bold">Descripción: </span>
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-primary-darker font-medium block md:table-cell">
                      <span className="md:hidden font-bold">Precio: </span>$
                      {product.price}
                    </td>
                    <td className="px-6 py-4 text-primary-darker font-medium block md:table-cell">
                      <span className="md:hidden font-bold">Liquidación: </span>
                      {product.liquidation
                        ? `$${applyLiquidation(product.price)}`
                        : "No aplica"}
                    </td>
                    <td className="px-5 py-4 text-primary-darker font-medium block md:table-cell">
                      <Dropdown
                        onSelect={(selectedOption) =>
                          handleSelect({
                            id: product.id,
                            status: selectedOption.id,
                          })
                        }
                        options={actionsOptions}
                        className="w-60"
                        bg="bg-[#F9FAFB]"
                        value={
                          actionsOptions.find(
                            (option) => option.id === product.status
                          )?.name || "Selecciona el estado"
                        }
                        noId={true}
                      />
                    </td>
                    <td className="px-6 py-4 text-primary-darker font-medium block md:table-cell">
                      <span className="md:hidden font-bold">Vendedor: </span>
                      {product.seller?.user?.name}{" "}
                      {product.seller?.user?.lastname}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block md:table-row">
                  <td
                    colSpan={detailsColumns.length + 1}
                    className="p-16 text-center"
                  >
                    <div className="flex flex-col gap-4 items-center justify-center">
                      <p className="font-semibold text-2xl text-primary-dark">
                        No se encontraron productos.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {openModalExport && (
          <div
            className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setOpenModalExport(false)}
          >
            <div
              className="bg-primary-lighter h-auto md:h-[40vh] w-[90%] md:w-[50vw] p-8 m-3 md:m-0 rounded-3xl relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-2xl font-bold text-primary-darker rounded-full"
                onClick={() => setOpenModalExport(false)}
              >
                ✖
              </button>
              <div className="flex flex-col gap-4 justify-center items-center text-center">
                <p className="font-bold text-2xl md:text-3xl text-primary-darker">
                  ¿Deseas exportar la información de esta feria?
                </p>
                <div className="gap-4 flex">
                  <button
                    onClick={() => handleExport()}
                    className="bg-primary-darker text-white w-20 p-2 rounded-lg border border-[#D0D5DD]"
                  >
                    Sí
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

export default WithAuthProtect({ Component: AdminPostFair, role: "admin" });
