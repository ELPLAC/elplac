/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import {
  Notification,
  IProductNotification,
  IProductRequestTableProps,
  IHandleSelectProductStatus,
  productsStatusEnum,
  IProduct,
} from "@/types";
import {
  checkedProductRequest,
  getAllProductRequest,
  getProductRequestById,
  updateProductStatus,
} from "@/helpers/services";
import { useAuth } from "@/context/AuthProvider";
import Dropdown from "../Dropdown";
import { URL } from "../../../envs";
import { notify } from "../Notifications/Notifications";

const ProductsTable: React.FC<IProductRequestTableProps> = ({
  columns,
  detailColumns,
  activeFair,
  trigger,
  setTrigger,
}) => {
  const [details, setDetails] = useState<boolean>(false);

  const { token } = useAuth();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [productRequest, setProductRequest] = useState<Notification[]>([]);
  const [productRequestId, setProductRequestId] = useState<Notification | null>(
    null
  );
  const [triggerProducts, setTriggerProducts] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] =
    useState<Partial<IProduct> | null>(null);

  const handleEditProduct = (product: IProduct) => {
    setEditingProduct(product);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditingProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingProduct) return;

    try {
      const response = await fetch(
        `${URL}/products/update/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editingProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }

      await response.json();
      notify("ToastSuccess", "¡Producto actualizado correctamente!");

      setEditingProduct(null);
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      notify("ToastError", "Hubo un error al actualizar el producto.");
    }
  };

  const handleDetails = async (id: string) => {
    const productRequest: Notification = await getProductRequestById(id, token);
    setProductRequestId(productRequest);
    setDetails(!details);
  };

  useEffect(() => {
    const fetchData = async () => {
      const productRequests = await getAllProductRequest(token);
      setProductRequest(productRequests);
      if (productRequestId) {
        const productRequestUpdated = await getProductRequestById(
          productRequestId?.id,
          token
        );
        setProductRequestId(productRequestUpdated);
      }
    };

    fetchData();
  }, [token, triggerProducts, setTriggerProducts, trigger, setTrigger]);

  const handleBack = () => {
    setDetails(false);
    setProductRequestId(null);
  };

  const statusMapping: { [key: string]: string } = {
    accepted: "Aceptado",
    notAccepted: "No aceptado",
    notAvailable: "No entregado",
    categoryNotApply: "No corresponde",
    secondMark: "Segunda marca",
    acceptedPlay: "Aceptado PLAY",
  };

  const handleSelect = async ({ id, status }: IHandleSelectProductStatus) => {
    try {
      if (!productRequestId) {
        return;
      }
      await updateProductStatus(id, status, productRequestId.id, token);

      setTriggerProducts((prev) => !prev);
    } catch (error: any) {}
  };

  const actionsOptions = [
    {
      id: productsStatusEnum.accepted,
      name: "Aceptado",
    },
    {
      id: productsStatusEnum.acceptedPlay,
      name: "Aceptado PLAY",
    },
    { id: productsStatusEnum.notAccepted, name: "No aceptado" },
    { id: productsStatusEnum.notAvailable, name: "No entregado" },
    {
      id: productsStatusEnum.categoryNotApply,
      name: "No corresponde",
    },
    { id: productsStatusEnum.secondMark, name: "Segunda marca" },
  ];

  const currentColumns = details ? detailColumns : columns;

  const applyLiquidation = (price: number) => {
    const discount = price * 0.25;
    const finalPrice = price - discount;
    return finalPrice;
  };

  const informSeller = async (id: string) => {
    if (!id) {
      notify("ToastError", "ID de vendedor inválido.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      notify("ToastError", "No hay un token válido.");
      return;
    }
  
    try {
      const response = await fetch(`${URL}/sellers/informSellers`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerIds: [id] }), 
      });
  
      if (!response.ok) {
        let errorMessage = "Error al informar al vendedor";
  
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
        }
  
        throw new Error(errorMessage);
      }
  
      notify("ToastSuccess", "Vendedor informado correctamente.");
    } catch (error) {
      console.error("Error en informSeller:", error);
      notify("ToastError", `Hubo un error`);
    }
  };
  
  

  const checkRequest = async () => {
    if (productRequestId) {
      const notPending = productRequestId.products.every(
        (product) => product.status !== productsStatusEnum.pendingVerification
      );

      if (notPending) {
        const res = await checkedProductRequest(productRequestId?.id, token);
        if (setTrigger) {
          setTrigger(!trigger);
        }
        handleBack();
      }
    }
  };

  return (
    <>
      <table className="w-full mb-20 text-sm text-left rtl:text-right bg-[#f1fafa] overflow-x-auto">
        <thead className="text-sm text-primary-darker uppercase bg-[#f1fafa] border-b-primary-default border">
          <tr>
            <th scope="col" className="p-4">
              {details && (
                <div className="flex gap-2 items-center ">
                  <button onClick={handleBack}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 42 42"
                    >
                      <path
                        fill="#2F8083"
                        fillRule="evenodd"
                        d="M27.066 1L7 21.068l19.568 19.569l4.934-4.933l-14.637-14.636L32 5.933z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => checkRequest()}
                    className="bg-primary-darker hover:bg-primary-default transition m-auto text-white font-semibold p-2 rounded-lg shadow"
                  >
                    Enviar
                  </button>
                </div>
              )}
            </th>

            {currentColumns?.map((column) => (
              <th key={column.id} scope="col" className="px-5 py-3">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#667085] text-nowrap">
          {!details ? (
            productRequest.length !== 0 ? (
              productRequest.map(
                (product: Notification) =>
                  product.fair.id === activeFair?.id && (
                    <tr key={product.id} className="shadow-sm">
                      <th
                        scope="row"
                        className="px-5 py-4 font-medium whitespace-nowrap"
                      ></th>
                      <td className="px-5 py-4 text-primary-darker font-medium">
                        {product.seller.sku || "-"}
                      </td>
                      <td className="px-5 py-4 text-primary-darker font-medium">
                        {product.category}
                      </td>
                      <td className="px-5 py-4 text-primary-darker font-medium">
                        {product.status.toUpperCase()}
                      </td>
                      <td className="px-5 py-4 text-primary-darker font-medium">
                        {product.seller.user.name}{" "}
                        {product.seller.user.lastname}
                      </td>
                      <td className="px-5 py-4 ">
                        {product.status === "pending" ? (
                          <p
                            className="text-[#344054] font-medium bg-[#D0D5DD] p-2 w-fit rounded-lg cursor-pointer"
                            onClick={() => handleDetails(product.id)}
                          >
                            Ver detalles
                          </p>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              className="text-white font-medium bg-blue-500 p-2 w-fit rounded-lg cursor-pointer"
                              onClick={() => informSeller(product.seller.id)}
                            >
                              Informar al vendedor
                            </button>
                            <p
                              className="text-[#344054] font-medium bg-[#D0D5DD] p-2 w-fit rounded-lg cursor-pointer"
                              onClick={() => handleDetails(product.id)}
                            >
                              Ver detalles
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
              )
            ) : (
              <tr className="shadow-md bg-[#F9FAFB]">
                <td colSpan={columns && columns.length + 1} className="p-32">
                  <div className="flex flex-col gap-4 items-center justify-center">
                    <p className="font-semibold text-2xl text-primary-dark">
                      No hay solicitudes de productos
                    </p>
                  </div>
                </td>
              </tr>
            )
          ) : (
            productRequestId?.products.map((product: IProductNotification) => (
              <tr key={product.id} className="shadow-sm">
                <th
                  scope="row"
                  className="px-5 py-4 font-medium whitespace-nowrap"
                ></th>
                <td className="px-5 py-4 text-primary-darker font-medium">
                  {product.code}
                </td>
                <td className="px-5 py-4 text-primary-darker font-medium">
                  {product.size}
                </td>
                <td className="px-5 py-4 text-primary-darker font-medium">
                  {product.brand}
                </td>
                <td className="px-5 py-4  text-primary-darker font-medium">
                  <div className=" flex  items-center ">
                    <p className=" overflow-hidden text-wrap w-32 overflow-ellipsis">
                      {expanded || product.description.length <= 30
                        ? product.description
                        : `${product.description.slice(0, 30)}...`}
                      {product.description.length > 30 && (
                        <button
                          className="text-white rounded-md p-1 text-xs bg-primary-dark hover:bg-primary-default cursor-pointer "
                          onClick={() => setExpanded((prev) => !prev)}
                        >
                          {expanded ? "Mostrar menos" : "Ver más"}
                        </button>
                      )}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 text-primary-darker font-medium">
                  ${product.price}
                </td>
                <td className="px-5 py-4 text-primary-darker font-medium">
                  {product.liquidation
                    ? `$${applyLiquidation(product.price)}`
                    : "No aplica"}
                </td>
                <td className="px-5 py-4 text-primary-darker font-medium">
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
                      statusMapping[product.status] || "Selecciona el estado"
                    }
                    noId={true}
                  />
                </td>
                <td className="px-5 py-4 text-primary-darker font-medium">
                  {productRequestId.seller?.user?.name}{" "}
                  {productRequestId.seller?.user?.lastname}
                </td>
                <td className="px-5 py-4">
                  <button
                    className="text-[#344054] font-medium bg-[#D0D5DD] p-2 w-fit rounded-lg cursor-pointer hover:bg-[#344054] hover:text-white"
                    onClick={() => handleEditProduct(product)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-[var(--primary-lighter)] p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-semibold text-[var(--primary-darker)] mb-6">
              Editar Producto
            </h2>
            <form onSubmit={handleSaveProduct}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--primary-darker)]">
                  Talle <span className="texts-xs">(Si aplica)</span>
                </label>
                <input
                  type="text"
                  value={editingProduct?.size || ""}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                  placeholder="Talle"
                  className="w-full p-3 bg-white border border-[var(--primary-dark)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-default)] text-[var(--primary-darker)]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--primary-darker)]">
                  Marca/Autor
                </label>
                <input
                  type="text"
                  value={editingProduct?.brand || ""}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Marca"
                  className="w-full p-3 bg-white border border-[var(--primary-dark)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-default)] text-[var(--primary-darker)]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--primary-darker)]">
                  Descripción/Título
                </label>
                <input
                  type="text"
                  value={editingProduct?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Descripción"
                  className="w-full p-3 bg-white border border-[var(--primary-dark)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-default)] text-[var(--primary-darker)]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--primary-darker)]">
                  Precio
                </label>
                <input
                  type="text"
                  value={editingProduct.price?.toString() || ""}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Precio"
                  className="w-full p-3 bg-white border border-[var(--primary-dark)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-default)] text-[var(--primary-darker)]"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-[var(--primary-default)] hover:bg-[var(--primary-dark)] text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="bg-[var(--secondary-lighter)] hover:bg-[var(--secondary-light)] text-[var(--primary-darker)] font-medium py-2 px-6 rounded-lg transition-all duration-300"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsTable;
