"use client";

import { useAuth } from "@/context/AuthProvider";
import { useProfile } from "@/context/ProfileProvider";
import { createProductRequest, getProductsBySeller } from "@/helpers/services";
import { ProductProps } from "@/types";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "../SidebarDashboard";
import Tips from "./Tips";
import SellerData from "./SellerData";
import { FaArrowDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import SellerProductRequestResponse from "./SellerProductRequestResponse";
import SellerGettingActiveFair from "./SellerGettingActiveFair";
import { useFair } from "@/context/FairProvider";
import WithAuthProtect from "@/helpers/WithAuth";
import PrintLabel from "@/components/PrintLabel/PrintLabel";
import { PiCoatHanger } from "react-icons/pi";
import "./seller.css";
import { notify } from "@/components/Notifications/Notifications";

const SellerProducts = () => {
  const { token } = useAuth();
  const { userDtos, sellerDtos } = useProfile();
  const { activeFair } = useFair();

  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productsCountDB, setProductsCountDB] = useState<number>(0);
  const [visibleStep, setVisibleStep] = useState<string>("TIPS");
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState<boolean>(false);

  const userId = userDtos?.seller?.id;

  const fairSeller = activeFair?.sellerRegistrations.find(
    (registration: any) => registration.seller.id === userId
  );

  const sellerCategoryFair = fairSeller?.categoryFair;
  const maxProducts = sellerCategoryFair?.maxProductsSeller ?? 0;
  const minProducts = sellerCategoryFair?.minProductsSeller ?? 0;

  useEffect(() => {
    if (userId) {
      const savedProducts = localStorage.getItem(`savedProducts-${userId}`);
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`savedProducts-${userId}`, JSON.stringify(products));
    }
  }, [products, userId]);

  const fetchProductCount = useCallback(async () => {
    try {
      const data = await getProductsBySeller(userId, token);
      if (data && data.products) {
        setProductsCountDB(data.products.length);
        console.log("Cantidad de productos en BD:", data.products.length);
      }
    } catch (error) {
      console.error("Error al obtener la cantidad de productos:", error);
      setError("Hubo un problema al obtener la cantidad de productos.");
    }
  }, [userId, token]);

  useEffect(() => {
    if (activeFair && userId && token) {
      fetchProductCount();
    }
  }, [activeFair, userId, token, fetchProductCount]);

  useEffect(() => {
    console.log("Actualizando productsCountDB a:", productsCountDB);
  }, [productsCountDB]);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const checkRegistration = () => {
        if (
          sellerDtos?.status !== "active" ||
          !sellerDtos?.registrations ||
          sellerDtos.registrations.length === 0 ||
          !sellerDtos.registrations.some(
            (registration) => registration.fair.id === activeFair?.id
          )
        ) {
          setVisibleProducts(true);
        } else {
          setVisibleProducts(false);
        }
        setIsLoading(false);
      };

      checkRegistration();
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeFair, sellerDtos]);

  const totalProducts = products.length + productsCountDB;
  const remainingProducts = Math.max(0, maxProducts - totalProducts);
  const hasReachedMinProducts = totalProducts >= minProducts;
  const isProductValid = totalProducts < maxProducts;

  console.log("totalProducts:", totalProducts, "minProducts:", minProducts);

console.log("productos de base de datos: ", productsCountDB);


  const infoToPost = {
    sellerId: userDtos?.seller?.id ?? "",
    fairId: activeFair?.id ?? "",
  };

  const postProductsReq = async () => {
    let hasError = false;
    const newErrors: Record<string, string> = {};

    if (totalProducts < minProducts) {
      setError(`Debes cargar al menos ${minProducts} productos para enviar.`);
      notify(
        "ToastError",
        `Debes cargar al menos ${minProducts} productos para enviar.`
      );
      return;
    }
    if (maxProducts > 0 && totalProducts > maxProducts) {
      setError(`No puedes enviar más de ${maxProducts} productos.`);
      notify("ToastError", `No puedes enviar más de ${maxProducts} productos.`);
      return;
    }

    const productsToSend: Partial<ProductProps>[] = products.map((product) => {
      const { id, ...rest } = product;
      let numericPrice: number | undefined;

      if (typeof product.price === "string") {
        numericPrice = parseFloat(
          (product.price as string).replace(/[^\d.-]/g, "")
        );
        if (isNaN(numericPrice) || numericPrice <= 0) {
          newErrors[`${product.id}-price`] =
            "El precio debe ser un número válido y mayor a 0";
          hasError = true;
        }
      } else if (typeof product.price === "number") {
        numericPrice = product.price;
        if (numericPrice <= 0) {
          newErrors[`${product.id}-price`] = "El precio debe ser mayor a 0";
          hasError = true;
        }
      } else {
        newErrors[`${product.id}-price`] = "El precio es obligatorio";
        hasError = true;
      }

      if (!product.size.trim()) {
        newErrors[`${product.id}-size`] = "Este campo es obligatorio";
        hasError = true;
      }
      if (!product.brand.trim()) {
        newErrors[`${product.id}-brand`] = "Este campo es obligatorio";
        hasError = true;
      }
      if (!product.description.trim()) {
        newErrors[`${product.id}-description`] = "Este campo es obligatorio";
        hasError = true;
      }

      return {
        ...rest,
        price: numericPrice,
        ifUnsold: product.ifUnsold,
      };
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await createProductRequest(
        token,
        infoToPost.sellerId,
        productsToSend as ProductProps[],
        infoToPost.fairId
      );
      await fetchProductCount();

      localStorage.removeItem(`savedProducts-${userId}`);
      setProducts([]);

      setTimeout(() => {
        fetchProductCount();
      }, 1500);

      setVisibleStep("RESUMEN");
      setError(null);
    } catch (error: any) {
      setError("Hubo un problema al enviar los productos.");
    }
  };

  const handleInputChange = (
    id: number,
    field: keyof ProductProps,
    value: string
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

    if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${id}-${field}`]: "Este campo es obligatorio",
      }));
    } else {
      setErrors((prevErrors) => {
        const { [`${id}-${field}`]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: capitalizedValue } : product
      )
    );
  };

  const handleFocus = (id: number, field: keyof ProductProps) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: "" } : product
      )
    );
  };

  const handleBlur = (id: number, field: keyof ProductProps) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              [field]:
                product[field] !== undefined
                  ? formatPrice(product[field].toString())
                  : product[field],
            }
          : product
      )
    );
  };

  const formatPrice = (value: string): string => {
    const numberValue = parseFloat(value.replace(/[^\d.-]/g, ""));
    if (isNaN(numberValue)) return "$0.00";
    return `$${numberValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem(
      `savedProducts-${userId}`,
      JSON.stringify(updatedProducts)
    );
    setError(null);
  };

  const liquidationSelected = fairSeller?.liquidation ? "Si" : "No Aplica";

  const handleAddProduct = () => {
    if (totalProducts >= maxProducts) {
      setError(`No podés agregar más de ${maxProducts} productos.`);
      return;
    }

    const newProduct: ProductProps = {
      id: Date.now(),
      brand: "",
      description: "",
      price: 0,
      liquidation: liquidationSelected,
      size: "",
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <div className="bg-secondary-lighter h-full flex flex-col items-center">
      <div className="w-full h-32 flex items-center">
        <Navbar />
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-0 relative place-content-center w-full">
        <div className="hidden sm:block bg-secondary-lighter h-full col-span-1 w-full">
          <Sidebar userRole={userDtos?.role} />
        </div>
        <div className="bg-secondary-lighter col-span-6 sm:col-span-7 lg:h-[100vh] w-full container-r">
          {isLoading ? (
            <div className="w-full flex-col h-full flex items-center justify-center font-bold gap-4 p-4 sm:p-6">
              <h2 className="text-primary-darker text-3xl text-center sm:text-4xl">
                Cargando...
              </h2>
            </div>
          ) : (
            visibleProducts && (
              <div className="w-full flex-col h-full flex items-center justify-center font-bold gap-4 p-4 sm:p-6">
                <h2 className="text-primary-darker text-3xl text-center sm:text-4xl">
                  ¡No podés cargar productos todavía!
                </h2>
                <h2 className="text-primary-darker text-xl text-center sm:text-2xl">
                  Primero debes registrarte en la feria...
                </h2>
                <Link
                  href="/dashboard/fairs"
                  className="flex items-center rounded-md shadow-lg bg-secondary-light gap-2 p-2 sm:p-4"
                >
                  <PiCoatHanger
                    className="w-10 h-10"
                    style={{ color: "#2f8083" }}
                    size={40}
                  />
                  <h2 className="text-primary-darker text-xl sm:text-2xl">
                    Ir a Ferias
                  </h2>
                </Link>
              </div>
            )
          )}
          {!visibleProducts && (
            <div className="mx-5 flex flex-col items-center max-h-[100vh] w-full">
              <div className="mt-5 w-full flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
                <div className="border border-primary-lighter font-semibold rounded-lg text-primary-darker w-full sm:w-auto">
                  <div className="flex flex-wrap sm:flex-nowrap justify-between">
                    <button
                      onClick={() => setVisibleStep("TIPS")}
                      className={`p-2 w-full sm:w-auto ${
                        visibleStep === "TIPS"
                          ? "bg-[#F9FAFB] text-primary-darker"
                          : "bg-secondary-lighter text-primary-darker"
                      }`}
                    >
                      INFO Y TIPS
                    </button>
                    <button
                      onClick={() => setVisibleStep("DATOS")}
                      className={`border-t sm:border-t-0 sm:border-l border-gray-300 p-2 w-full sm:w-auto ${
                        visibleStep === "DATOS"
                          ? "bg-[#F9FAFB] text-primary-darker"
                          : "bg-secondary-lighter text-primary-darker"
                      }`}
                    >
                      DATOS
                    </button>
                    <button
                      onClick={() => setVisibleStep("PRODUCTOS")}
                      className={`border-t sm:border-t-0 sm:border-l border-gray-300 p-2 w-full sm:w-auto ${
                        visibleStep === "PRODUCTOS"
                          ? "bg-[#F9FAFB] text-primary-darker"
                          : "bg-secondary-lighter text-primary-darker"
                      }`}
                    >
                      PRODUCTOS
                    </button>
                    <button
                      onClick={() => setVisibleStep("RESUMEN")}
                      className={`border-t sm:border-t-0 sm:border-l border-gray-300 p-2 w-full sm:w-auto ${
                        visibleStep === "RESUMEN"
                          ? "bg-[#F9FAFB] text-primary-darker"
                          : "bg-secondary-lighter text-primary-darker"
                      }`}
                    >
                      RESUMEN
                    </button>
                  </div>
                </div>
              </div>
              {visibleStep === "TIPS" && (
                <Tips setVisibleStep={setVisibleStep} />
              )}
              {visibleStep === "DATOS" && (
                <SellerData setVisibleStep={setVisibleStep} />
              )}
              {visibleStep === "RESUMEN" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mt-2 sm:mt-10 h-[150vh] w-full mb-10">
                    <div className="sm:col-span-3 overflow-y-auto h-full">
                      <div className="w-full mt-2 flex flex-col h-full rounded-lg bg-secondary-lighter shadow-md">
                        <h1 className="font-semibold text-primary-darker text-xl sm:h-[50vh] w-full">
                          <SellerProductRequestResponse
                            sellerId={userDtos?.seller?.id}
                          />
                        </h1>
                      </div>
                    </div>

                    <div className="sm:col-span-1 h-full mb-5 rounded-lg bg-secondary-lighter shadow-md">
                      <div className="flex items-end justify-start gap-2">
                        <PrintLabel sellerId={userDtos?.seller?.id} />
                      </div>
                      <div className="w-full h-full flex p-6 flex-col mt-5">
                        <SellerGettingActiveFair
                          sellerId={userDtos?.seller?.id}
                        />
                        <button
                          onClick={() => setVisibleStep("PRODUCTOS")}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-lighter transition duration-200 w-fit mt-4"
                        >
                          <FaChevronLeft />
                          <span>Volver a productos</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {visibleStep === "PRODUCTOS" && (
                <>
                  {!isProductValid && (
                    <div className="bg-red-200 text-red-800 p-2 rounded mb-4">
                      {remainingProducts > 0
                        ? `Podés agregar ${remainingProducts} productos más.`
                        : `No podés agregar más de ${maxProducts} productos.`}
                    </div>
                  )}

                  {!hasReachedMinProducts && (
                    <div className="bg-yellow-200 text-yellow-800 p-2 rounded mb-4">
                      Te falta agregar al menos {minProducts - totalProducts}{" "}
                      producto(s) para cumplir con el mínimo de {minProducts}.
                    </div>
                  )}

                  <div className="w-full mt-4 mr-10">
                    <table className="w-full text-sm text-left rtl:text-right bg-[#F9FAFB] table">
                      <tbody className="text-primary-darker bg-[#F9FAFB]">
                        <tr>
                          <td colSpan={6} className="px-4 py-3 sm:px-6 sm:py-4">
                            <div className="text-primary-darker flex flex-wrap items-center gap-2 whitespace-normal sm:whitespace-nowrap text-center sm:text-left">
                              <span className="text-xl font-bold">*</span>
                              <p className="text-sm">
                                Para ferias donde se acepten libros {`📚`},
                                colocar el <strong>autor</strong> en la casilla
                                de <strong>Marca</strong> y el{" "}
                                <strong>título</strong> en{" "}
                                <strong>Descripción</strong>.
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>

                      {products.length !== 0 && (
                        <thead className="text-sm text-primary-darker uppercase bg-[#F9FAFB] border-b-primary-default border">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 sm:px-6 sm:py-3"
                            >
                              Talle{" "}
                              <span className="text-xs ml-2">
                                (&quot;X&quot; si no aplica)
                              </span>
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 sm:px-6 sm:py-3"
                            >
                              Marca
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 sm:px-6 sm:py-3 w-1/3"
                            >
                              Descripción
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 sm:px-6 sm:py-3"
                            >
                              Precio
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 sm:px-6 sm:py-3"
                            >
                              Liquidación
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 sm:px-6 sm:py-3"
                            >
                              Acciones
                            </th>
                          </tr>
                        </thead>
                      )}
                      <tbody className="text-[#667085]">
                        {products.length !== 0 ? (
                          products.map((product) => (
                            <tr
                              key={product.id}
                              className="bg-secondary-lighter border border-secondary-dark hover:bg-secondary-light"
                            >
                              <td className="px-4 py-4 text-primary-darker font-medium sm:px-6 sm:py-4">
                                <input
                                  type="text"
                                  value={product.size}
                                  onChange={(e) =>
                                    handleInputChange(
                                      product.id,
                                      "size",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Talle"
                                  className="w-full p-2 bg-white border border-gray-300 rounded"
                                />
                                {errors[`${product.id}-size`] && (
                                  <p className="text-red-500 text-sm">
                                    {errors[`${product.id}-size`]}
                                  </p>
                                )}
                              </td>
                              <td className="px-4 py-4 text-primary-darker font-medium sm:px-6 sm:py-4">
                                <input
                                  type="text"
                                  value={product.brand}
                                  onChange={(e) =>
                                    handleInputChange(
                                      product.id,
                                      "brand",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Marca"
                                  className="w-full p-2 bg-white border border-gray-300 rounded"
                                />
                                {errors[`${product.id}-brand`] && (
                                  <p className="text-red-500 text-sm">
                                    {errors[`${product.id}-brand`]}
                                  </p>
                                )}
                              </td>
                              <td className="px-4 py-4 text-primary-darker font-medium sm:px-6 sm:py-4 w-1/3">
                                <input
                                  type="text"
                                  value={product.description}
                                  onChange={(e) =>
                                    handleInputChange(
                                      product.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Descripción"
                                  className="w-full p-2 bg-white border border-gray-300 rounded"
                                />
                                {errors[`${product.id}-description`] && (
                                  <p className="text-red-500 text-sm">
                                    {errors[`${product.id}-description`]}
                                  </p>
                                )}
                              </td>
                              <td className="px-4 py-4 text-primary-darker font-medium sm:px-6 sm:py-4">
                                <input
                                  type="text"
                                  value={product.price.toString()}
                                  onChange={(e) =>
                                    handleInputChange(
                                      product.id,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  onFocus={() =>
                                    handleFocus(product.id, "price")
                                  }
                                  onBlur={() => handleBlur(product.id, "price")}
                                  placeholder="Precio"
                                  className="w-full p-2 bg-white border border-gray-300 rounded"
                                />
                                {errors[`${product.id}-price`] && (
                                  <p className="text-red-500 text-sm">
                                    {errors[`${product.id}-price`]}
                                  </p>
                                )}
                              </td>
                              <td className="px-4 py-4 text-primary-darker font-medium sm:px-6 sm:py-4">
                                <input
                                  type="text"
                                  value={liquidationSelected}
                                  readOnly
                                  disabled
                                  placeholder="Liquidación"
                                  className="w-full p-2 border border-gray-300 rounded cursor-default"
                                  onFocus={(e) => e.target.blur()}
                                  onClick={(e) => e.preventDefault()}
                                />
                              </td>
                              <td className="px-4 py-4 text-primary-darker font-medium sm:px-6 sm:py-4">
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="shadow-md bg-secondary-lighter">
                            <td className="flex flex-col gap-4 items-center justify-center w-full py-6 sm:gap-6 sm:flex-row">
                              <div className="flex flex-col items-center gap-4 w-full rounded-lg p-5 sm:flex-nowrap">
                                <p className="font-semibold text-2xl text-primary-dark text-center hazlick">
                                  Haz clic en el botón de abajo para empezar a
                                  cargar tus productos
                                </p>
                                <FaArrowDown />
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col items-center mt-5 space-y-4 mr-10">
                    <button
                      onClick={handleAddProduct}
                      disabled={totalProducts >= maxProducts}
                      className="text-lg text-white bg-primary-dark hover:bg-primary-light py-3 px-6 font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto btn-r"
                    >
                      + Agregar producto
                    </button>

                    <button
                      disabled={products.length === 0}
                      onClick={() => setIsFirstModalOpen(true)}
                      className="btn-r text-lg text-primary-dark bg-secondary-dark hover:bg-secondary-darker py-3 px-6 font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    >
                      Enviar productos para clasificar
                    </button>

                    {isFirstModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                          <p className="text-lg font-semibold text-gray-900 text-center">
                            ⚠️ AVISO IMPORTANTE ⚠️ <br />
                            ¿Estás seguro que terminaste de cargar y revisar el
                            100% de tus productos?
                          </p>
                          <div className="mt-6 flex justify-between gap-4">
                            <button
                              onClick={() => setIsFirstModalOpen(false)}
                              className="w-1/2 px-4 py-3 text-lg font-semibold text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-lg transition-all"
                            >
                              Sigo revisando
                            </button>
                            <button
                              onClick={() => {
                                setIsFirstModalOpen(false);
                                setIsSecondModalOpen(true);
                              }}
                              className="w-1/2 px-4 py-3 text-lg font-semibold text-white bg-primary-dark hover:bg-primary-light rounded-lg transition-all"
                            >
                              Sí
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {isSecondModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                          <p className="text-lg font-semibold text-gray-900 text-center">
                            ⚠️ AVISO IMPORTANTE ⚠️ <br />
                            Una vez enviados los productos no pueden
                            modificarse. ¿Estás seguro que deseas enviarlos?
                          </p>
                          <div className="mt-6 flex justify-between gap-4">
                            <button
                              onClick={() => setIsSecondModalOpen(false)}
                              className="w-1/2 px-4 py-3 text-lg font-semibold text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-lg transition-all"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => {
                                postProductsReq();
                                setIsSecondModalOpen(false);
                              }}
                              disabled={products.length === 0}
                              className="w-1/2 px-4 py-3 text-lg font-semibold text-white bg-primary-dark hover:bg-primary-light rounded-lg transition-all"
                            >
                              Enviar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="btn-r2 flex justify-between items-center mt-10 w-full mr-10">
                    <button
                      onClick={() => setVisibleStep("DATOS")}
                      className="btn-r2 flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-lighter transition duration-200 w-full sm:w-auto"
                    >
                      <FaChevronLeft />
                      <span>Volver</span>
                    </button>
                    <button
                      onClick={() => setVisibleStep("RESUMEN")}
                      className="btn-r2 flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-light transition duration-200 w-full sm:w-auto"
                    >
                      <span>Resumen</span>
                      <FaChevronRight />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithAuthProtect({ Component: SellerProducts, role: "seller" });
