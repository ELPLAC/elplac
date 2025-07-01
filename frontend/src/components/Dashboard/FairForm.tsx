"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import Input from "./InputFairForm";
import "react-toastify/dist/ReactToastify.css";
import { postCreateFair, updateFairStatus } from "../../helpers/services";
import { useAuth } from "@/context/AuthProvider";
import WithAuthProtect from "@/helpers/WithAuth";
import { useFair } from "@/context/FairProvider";
import { useRouter } from "next/navigation";
import { notify } from "../Notifications/Notifications";
import { Checkbox, Label } from "flowbite-react";
import {
  CategoryData,
  CategoryDataField,
  FairDaysData,
  IsCheckedType,
} from "@/types";
import * as Yup from "yup";
import { FaCheckCircle } from "react-icons/fa";
import "./FairForm.css";
import EditFairAddress from "./EditAddressFair";
import { URL } from "../../../envs";

const CreateFairForm: React.FC = () => {
  const { token } = useAuth();
  const [hasCost, setHasCost] = useState(false);
  const { activeFair, setActiveFair } = useFair();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState<IsCheckedType>({
    youngMan: false,
    youngWoman: false,
    man: false,
    woman: false,
    adults: false,
    booksToys: false,
    booksToysWater: false,
    deco: false,
    backToSchool: false,
    entrepreneurs: false,
    others: false,
  });
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [categoryErrors, setCategoryErrors] = useState<string | undefined>(
    undefined
  );
  const [openModalUserId, setOpenModalUserId] = useState<boolean>(false);
  const [fairDays, setFairDays] = useState<FairDaysData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newEntryPrice, setNewEntryPrice] = useState(
    activeFair?.entryPriceBuyer || ""
  );

  const handleUpdateEntryPrice = async (newPrice: string) => {
    if (!activeFair?.id) return;

    try {
      const response = await fetch(
        `${URL}/fairs/${activeFair.id}/update-entry-price-buyer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ entryPriceBuyer: newPrice }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ${response.status}: ${
            errorData.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      setActiveFair({
        ...activeFair,
        entryPriceBuyer: data.fair.entryPriceBuyer,
      });

      notify("ToastSuccess", "Precio de entrada actualizado correctamente");
      setIsEditingPrice(false);
    } catch (error) {
      notify("ToastError", "Error al actualizar el precio de entrada");
    }
  };
  const handleToggleLabelVisibility = async () => {
    if (!activeFair?.id) return;

    try {
      const response = await fetch(
        `${URL}/fairs/${activeFair.id}/update-label-printing`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ${response.status}: ${
            errorData.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      setActiveFair({
        ...activeFair!,
        isLabelPrintingEnabled: data.fair.isLabelPrintingEnabled,
      });

      notify(
        "ToastSuccess",
        `Impresión de etiquetas ${
          data.isLabelPrintingEnabled ? "habilitada" : "deshabilitada"
        } correctamente`
      );
    } catch (error) {
      console.error(error);
      notify(
        "ToastError",
        "Error al actualizar la visibilidad de impresión de etiquetas"
      );
    }
  };

  const handleFairDayChange = (
    index: number,
    field: keyof FairDaysData,
    value: string | number | boolean
  ) => {
    const updatedFairDays = [...fairDays];

    if (field === "day") {
      const selectedDate = new Date(value as string);
      const currentDate = new Date();

      if (selectedDate.getTime() < currentDate.setHours(0, 0, 0, 0)) {
        alert("La fecha seleccionada no puede ser anterior a la fecha actual.");
        return;
      }
    }

    switch (field) {
      case "day":
        updatedFairDays[index].day = value as string;
        break;
      case "startTime":
      case "endTime":
        updatedFairDays[index][field] = value as string;
        break;
      case "timeSlotInterval":
      case "capacityPerTimeSlot":
        updatedFairDays[index][field] = value as number;
        break;
      case "isClosed":
        updatedFairDays[index].isClosed = value as boolean;
        break;
      default:
        break;
    }

    setFairDays(updatedFairDays);
  };

  const handleAddFairDay = () => {
    setFairDays([
      ...fairDays,
      {
        day: "",
        startTime: "",
        endTime: "",
        timeSlotInterval: undefined,
        capacityPerTimeSlot: undefined,
        isClosed: false,
      },
    ]);
  };

  const handleRemoveFairDay = (index: number) => {
    const updatedFairDays = fairDays.filter((_, i) => i !== index);
    setFairDays(updatedFairDays);
  };

  const closeModalHandler = () => {
    setOpenModalUserId(false);
  };

  const handleConcludeFair = async () => {
    closeModalHandler();
    if (!activeFair) return;

    const res = await updateFairStatus(token, activeFair?.id);
    if (res?.ok) {
      notify("ToastSuccess", "Feria concluida con éxito");
      setActiveFair(undefined);
      router.push("/admin/fairs");
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setIsChecked((prevState) => ({
      ...prevState,
      [name]: checked,
    }));

    setCategoriesData((prevCategories) => {
      const updatedCategories = checked
        ? [
            ...prevCategories,
            {
              name,
              maxProductsSeller: "",
              minProductsSeller: "",
              maxSellers: "",
              maxProducts: "",
            },
          ]
        : prevCategories.filter((category) => category.name !== name);

      return updatedCategories;
    });
  };

  const handleCategoryChange = (
    index: number,
    field: CategoryDataField,
    value: string
  ) => {
    const numericValue = parseInt(value, 10);

    if (isNaN(numericValue) || numericValue < 0) {
      return;
    }

    const updatedCategories = [...categoriesData];
    updatedCategories[index][field] = value;

    if (field === "minProductsSeller" || field === "maxProductsSeller") {
      const minProductsSeller = parseInt(
        updatedCategories[index].minProductsSeller as string,
        10
      );
      const maxProductsSeller = parseInt(
        updatedCategories[index].maxProductsSeller as string,
        10
      );

      if (minProductsSeller > maxProductsSeller) {
        setCategoryErrors(
          "Min Productos por Vendedor no puede ser mayor que Max Productos por Vendedor"
        );
        return;
      } else {
        setCategoryErrors(undefined);
      }
    }

    if (field === "maxSellers" || field === "maxProductsSeller") {
      const { maxSellers, maxProductsSeller } = updatedCategories[index];
      if (maxSellers && maxProductsSeller) {
        updatedCategories[index].maxProducts = (
          parseInt(maxSellers, 10) * parseInt(maxProductsSeller, 10)
        ).toString();
      }
    }
    setCategoriesData(updatedCategories);
  };

  const categoryMap = {
    youngMan: "Varón 0 a 12 meses",
    youngWoman: "Mujer 0 a 12 meses",
    man: "Varón +12 meses a 12 años",
    woman: "Mujer +12 meses a 12 años",
    adults: "Adultos",
    booksToys: "Juguetes y libros",
    booksToysWater: "Juguetes, libros y agua",
    deco: "Deco-Hogar",
    backToSchool: "Vuelta al cole",
    entrepreneurs: "Emprendedores",
    others: "Otras",
  };

  const handleCreateFair = async () => {
    setLoading(true);

    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      notify("ToastError", "Completa todos los campos antes de continuar.");
      setLoading(false);
      return;
    }

    try {
      await formik.handleSubmit();
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      entryPriceBuyer: 0,
      entryPriceSeller: 0,
      entryDescription: "",
      descripcion: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es obligatorio"),
      address: Yup.string().required("La dirección es obligatoria"),
      entryPriceBuyer: Yup.number()
        .required("El precio de entrada para compradores es obligatorio")
        .min(0, "Debe ser un valor positivo"),
      entryPriceSeller: Yup.number()
        .required("El precio de entrada para vendedores es obligatorio")
        .min(0, "Debe ser un valor positivo"),
      entryDescription: Yup.string()
        .required("La descripción es obligatoria")
        .min(10, "La descripción debe tener al menos 10 caracteres"),
      fairDays: Yup.array().of(
        Yup.object().shape({
          day: Yup.string()
            .required("El día es obligatorio")
            .test(
              "is-not-past-date",
              "La fecha no puede ser anterior a la fecha actual",
              (value) => {
                if (!value) return true;

                const selectedDate = new Date(value);
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                const selectedHours = selectedDate.getHours();
                const selectedMinutes = selectedDate.getMinutes();

                const currentHours = currentDate.getHours();
                const currentMinutes = currentDate.getMinutes();

                const isSelectedDateGreaterOrEqual =
                  selectedHours > currentHours ||
                  (selectedHours === currentHours &&
                    selectedMinutes >= currentMinutes);

                return isSelectedDateGreaterOrEqual;
              }
            ),
        })
      ),
    }),

    onSubmit: async (values) => {
      const transformedData = {
        name: values.name,
        address: values.address,
        entryPriceBuyer: hasCost ? values.entryPriceBuyer : 0,
        entryPriceSeller: values.entryPriceSeller,
        entryDescription: values.entryDescription,
        fairCategories: categoriesData.map((cat) => ({
          maxProductsSeller: parseInt(cat.maxProductsSeller, 10),
          minProductsSeller: parseInt(cat.minProductsSeller, 10),
          maxSellers: parseInt(cat.maxSellers, 10),
          maxProducts: parseInt(cat.maxProducts, 10),
          category: {
            name: categoryMap[cat.name as keyof typeof categoryMap],
          },
        })),
        fairDays: fairDays.map((day) => ({
          day: day.day,
          startTime: day.startTime,
          endTime: day.endTime,
          isClosed: day.isClosed,
          capacityPerTimeSlot: day.capacityPerTimeSlot,
          timeSlotInterval: day.timeSlotInterval,
        })),
      };

      try {
        const response: any = await postCreateFair(transformedData, token);
        setActiveFair(response);
        router.push("/admin");
        notify("ToastSuccess", "Feria Creada Exitosamente");
        if (response && response.error) {
          console.log(response.error);
          throw new Error("Error al crear la feria" + response.error);
        }
      } catch (error) {}
    },
  });

  return (
    <div className="container mx-auto px-6 py-6 container-general">
      <div className="bg-[#f1fafa] p-8 rounded-lg shadow-md ">
        {activeFair && (
          <div className="w-full h-[120vh] p-6 bg-gray-50 conteiner-active-fair">
            <>
              <h2 className="text-4xl text-primary-darker font-semibold mb-6 w-full">
                ¡Ya existe una feria activa!
              </h2>
              <p className="text-2xl text-primary-darker mb-6 w-full">
                Ve a la sección de Productos para verificar si hay solicitudes
                de vendedores, donde podrás clasificar los productos enviados.
                Al finalizar la feria, dirigite a la sección de administración
                para cambiarle el estado a los productos (vendido / no vendido /
                vendido en liquidación). Cuando ya hayas finalizado, puedes
                concluir la feria.
              </p>
              <div className="flex gap-4 mb-6">
                <a
                  href="/admin/postFair"
                  className="action-button w-full mt-5 mb-5 bg-white flex items-center justify-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-primary-darker hover:text-white hover:shadow-md transition duration-200"
                >
                  <FaCheckCircle /> Clasificar productos en venta
                </a>
                <a
                  href="/admin/products"
                  className="action-button w-full mt-5 mb-5 bg-white flex items-center justify-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-primary-darker hover:text-white hover:shadow-md transition duration-200"
                >
                  <FaCheckCircle /> Ver solicitudes de clasificación
                </a>
                <button
                  onClick={() => setOpenModalUserId(true)}
                  className="action-button w-full mt-5 mb-5 bg-white flex items-center justify-center text-red-600 gap-2 p-2 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white hover:shadow-md transition duration-200"
                >
                  <FaCheckCircle /> Concluir feria
                </button>
              </div>
              <div className="pb-6 mb-6 border-b border-gray-300 opacity-60"></div>

              <div className="pb-6 mb-6 border-b border-gray-300 opacity-60">
                <h1 className="text-primary-darker text-xl font-semibold mb-4">
                  Datos de la feria actual
                </h1>
                <p className="text-lg mb-2 text-primary-dark">
                  <strong className="text-primary-darker">Nombre:</strong>{" "}
                  {activeFair?.name}
                </p>

                <div>
                  <p className="text-lg mb-2 text-primary-dark">
                    <strong className="text-primary-darker">Dirección:</strong>{" "}
                    {isEditing ? (
                      <EditFairAddress
                        activeFair={activeFair}
                        token={token}
                        setIsEditing={setIsEditing}
                      />
                    ) : (
                      <>
                        {activeFair?.address}
                        <button
                          onClick={() => setIsEditing(true)}
                          className="ml-8 text-blue-500 hover:text-blue-600"
                        >
                          Editar
                        </button>
                      </>
                    )}
                  </p>
                </div>

                <div className="pb-6 mb-6 border-b border-gray-300 opacity-60"></div>
                <h3 className="text-primary-darker text-xl font-semibold mb-4">
                  Compradores
                </h3>
                <p className="text-lg mb-2 text-primary-dark">
                  <strong className="text-primary-darker">
                    Precio de entrada para compradores:
                  </strong>{" "}
                  {isEditingPrice ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newEntryPrice}
                        onChange={(e) => setNewEntryPrice(e.target.value)}
                        className="w-1/2 p-2 border rounded-md text-primary-dark"
                      />
                      <button
                        onClick={() => handleUpdateEntryPrice(newEntryPrice)}
                        className="ml-2 text-green-500"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditingPrice(false)}
                        className="ml-2 text-red-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      {Number(activeFair?.entryPriceBuyer) === 0
                        ? "Entrada gratis"
                        : `$${activeFair?.entryPriceBuyer}`}
                      <button
                        onClick={() => setIsEditingPrice(true)}
                        className="ml-4 text-blue-500 hover:text-blue-600"
                      >
                        Editar
                      </button>
                    </>
                  )}
                </p>
                <div className="pb-6 mb-6 border-b border-gray-300 opacity-60"></div>

                <h3 className="text-primary-darker text-xl font-semibold mb-4">
                  Vendedores
                </h3>
                <p className="text-lg mb-2 text-primary-dark">
                  <strong className="text-primary-darker">
                    Precio de entrada para vendedores:
                  </strong>{" "}
                  ${activeFair.entryPriceSeller}
                </p>

                <p className="text-lg mb-2 text-primary-dark">
                  <strong className="text-primary-darker">Categorías:</strong>{" "}
                  {activeFair?.fairCategories &&
                  Array.isArray(activeFair.fairCategories)
                    ? activeFair.fairCategories
                        .map((category) => category.category.name)
                        .join(", ")
                    : "Sin categorías"}
                </p>
                <div className="pb-6 mb-6 border-b border-gray-300 opacity-60"></div>

                <button
                  onClick={handleToggleLabelVisibility}
                  className="action-button mt-5 mb-5 bg-white flex items-center justify-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-primary-darker hover:text-white hover:shadow-md transition duration-200"
                >
                  <FaCheckCircle />
                  {activeFair?.isLabelPrintingEnabled
                    ? "Deshabilitar impresión de etiquetas"
                    : "Habilitar impresión de etiquetas"}
                </button>
                <div className="mt-6">
                  <h3 className="text-xl text-primary-darker font-semibold mb-4">
                    Días de la Feria
                  </h3>
                  <div className="p-4 rounded-lg text-primary-dark">
                    {activeFair?.fairDays &&
                    Array.isArray(activeFair.fairDays) &&
                    activeFair.fairDays.length > 0 ? (
                      activeFair.fairDays
                        .sort((a, b) => {
                          const dateA = new Date(a.day).getTime();
                          const dateB = new Date(b.day).getTime();
                          return dateB - dateA;
                        })
                        .map((fairDay, index) => {
                          const formattedDay = new Date(fairDay.day);
                          const formattedStartTime = new Date(
                            `1970-01-01T${fairDay.startTime}`
                          );
                          const formattedEndTime = new Date(
                            `1970-01-01T${fairDay.endTime}`
                          );

                          const dayFormatted = new Intl.DateTimeFormat(
                            "es-ES"
                          ).format(formattedDay);

                          const startTimeFormatted =
                            formattedStartTime.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                          const endTimeFormatted =
                            formattedEndTime.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            });

                          return (
                            <div key={index} className="mb-4 text-primary-dark">
                              {fairDay.isClosed ? (
                                <p>
                                  <strong>{dayFormatted}</strong> - Feria
                                  Cerrada
                                </p>
                              ) : (
                                <p>
                                  <strong>{dayFormatted}</strong> -{" "}
                                  {startTimeFormatted} a {endTimeFormatted}
                                </p>
                              )}
                            </div>
                          );
                        })
                    ) : (
                      <p className="text-primary-dark">
                        No hay días registrados para esta feria.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          </div>
        )}

        {!activeFair && (
          <>
            <h2 className="text-4xl text-primary-darker font-semibold mb-6">
              Crear una feria
            </h2>
            <form
              onSubmit={formik.handleSubmit}
              className="form-container container-fair-form"
            >
              <div className="general-section container-fair-form">
                <h3 className="text-xl text-primary-darker font-semibold mb-4">
                  Datos Generales
                </h3>
                <div className="mb-4 border p-4 rounded-lg">
                  <div className="mb-4">
                    <Input
                      label="Nombre"
                      name="name"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      onBlur={formik.handleBlur}
                      placeholder="Nombre de la feria"
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      errorMessage={formik.errors.name}
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      label="Dirección"
                      name="address"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.address}
                      onBlur={formik.handleBlur}
                      placeholder="Ubicación"
                      error={
                        formik.touched.address && Boolean(formik.errors.address)
                      }
                      errorMessage={formik.errors.address}
                    />
                  </div>
                </div>
              </div>

              <div className="entries-section container-fair-form">
                <h3 className="text-xl text-primary-darker font-semibold mb-4">
                  Entradas
                </h3>
                <div className="border p-4 rounded-lg container-fair-form">
                  <div className="flex space-x-4 container-fair-form">
                    <div className="w-1/2">
                      <Input
                        label="Valor del Turno (Usuario)"
                        name="entryPriceBuyer"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.entryPriceBuyer}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.entryPriceBuyer &&
                          Boolean(formik.errors.entryPriceBuyer)
                        }
                        errorMessage={formik.errors.entryPriceBuyer}
                      />
                    </div>
                    <div className="w-1/2">
                      <Input
                        label="Valor de Inscripción (Vendedor)"
                        name="entryPriceSeller"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.entryPriceSeller}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.entryPriceSeller &&
                          Boolean(formik.errors.entryPriceSeller)
                        }
                        errorMessage={formik.errors.entryPriceSeller}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Input
                      label="Información y requisitos"
                      name="entryDescription"
                      type="url"
                      onChange={formik.handleChange}
                      value={formik.values.entryDescription}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.entryDescription &&
                        Boolean(formik.errors.entryDescription)
                      }
                      errorMessage={formik.errors.entryDescription}
                      placeholder="https://ejemplo.com"
                    />
                    {formik.values.entryDescription && (
                      <a
                        href={formik.values.entryDescription}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline mt-2 block"
                      >
                        Ver enlace
                      </a>
                    )}
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="hasCost"
                      checked={hasCost}
                      onChange={() => setHasCost(!hasCost)}
                      className="mr-2"
                    />
                    <label htmlFor="hasCost">
                      Tiene costo para el comprador
                    </label>
                  </div>
                </div>
              </div>

              <div className="fairDays-section container-fair-form">
                <h3 className="text-xl text-primary-darker font-semibold mb-4">
                  Días de la Feria
                </h3>
                <div className="border p-4 rounded-lg container-fair-form">
                  {fairDays.map((fairDay, index) => (
                    <div key={index} className="mb-4">
                      <div className="grid grid-cols-2 gap-4 container-fair-form">
                        <div className="">
                          <Input
                            label="Día"
                            name={`fairDays[${index}].day`}
                            type="date"
                            value={fairDay.day}
                            onChange={(e) =>
                              handleFairDayChange(index, "day", e.target.value)
                            }
                          />
                          {errorMessage && (
                            <p className="text-red-500 text-sm">
                              {errorMessage}
                            </p>
                          )}
                        </div>
                        {!fairDay.isClosed && (
                          <>
                            <div className="">
                              <Input
                                label="Hora de inicio"
                                name={`fairDays[${index}].startTime`}
                                type="time"
                                value={fairDay.startTime || "00:00"}
                                onChange={(e) =>
                                  handleFairDayChange(
                                    index,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="">
                              <Input
                                label="Hora de fin"
                                name={`fairDays[${index}].endTime`}
                                type="time"
                                value={fairDay.endTime || "00:00"}
                                onChange={(e) =>
                                  handleFairDayChange(
                                    index,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="">
                              <Input
                                label="Intervalo de tiempo (minutos)"
                                name={`fairDays[${index}].timeSlotInterval`}
                                type="text"
                                value={
                                  fairDay.timeSlotInterval !== undefined
                                    ? fairDay.timeSlotInterval
                                    : 0
                                }
                                onChange={(e) =>
                                  handleFairDayChange(
                                    index,
                                    "timeSlotInterval",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div className="">
                              <Input
                                label="Capacidad por intervalo"
                                name={`fairDays[${index}].capacityPerTimeSlot`}
                                type="text"
                                value={
                                  fairDay.capacityPerTimeSlot !== undefined
                                    ? fairDay.capacityPerTimeSlot
                                    : 0
                                }
                                onChange={(e) =>
                                  handleFairDayChange(
                                    index,
                                    "capacityPerTimeSlot",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`fairDayClosed-${index}`}
                          checked={fairDay.isClosed}
                          onChange={(e) =>
                            handleFairDayChange(
                              index,
                              "isClosed",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <label htmlFor={`fairDayClosed-${index}`}>
                          Cerrado
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFairDay(index)}
                        className="submit-button mt-5 mb-5 bg-red-100 flex items-center justify-center text-red-600 gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-red-600 hover:text-white hover:shadow-md transition duration-200"
                      >
                        <FaCheckCircle />
                        Eliminar Día
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddFairDay}
                    className="submit-button mt-5 mb-5 bg-white flex items-center justify-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-primary-darker hover:text-white hover:shadow-md transition duration-200"
                  >
                    <FaCheckCircle />
                    Agregar Día
                  </button>
                </div>
              </div>

              <div className="categories-section container-fair-form">
                <h3 className="text-xl text-primary-darker font-semibold mb-4">
                  Categorías
                </h3>
                <div className="border p-4 rounded-lg ">
                  <div className="grid grid-cols-2 gap-4 mb-4 container-fair-form">
                    {Object.keys(isChecked).map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={category}
                          name={category}
                          checked={isChecked[category as keyof IsCheckedType]}
                          onChange={handleCheckboxChange}
                        />
                        <Label htmlFor={category} className="ml-2">
                          {categoryMap[category as keyof typeof categoryMap]}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {categoriesData.map((category, index) => (
                    <div
                      key={category.name}
                      className="mb-4 border p-4 rounded-lg container-fair-form"
                    >
                      <h4 className="text-md text-primary-darker font-semibold mb-2">
                        {categoryMap[category.name as keyof typeof categoryMap]}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 container-fair-form">
                        <Input
                          label="Max Productos por Vendedor"
                          name="maxProductsSeller"
                          type="text"
                          onChange={(e) =>
                            handleCategoryChange(
                              index,
                              "maxProductsSeller",
                              e.target.value
                            )
                          }
                          value={category.maxProductsSeller}
                        />
                        <Input
                          label="Min Productos por Vendedor"
                          name="minProductsSeller"
                          type="text"
                          onChange={(e) =>
                            handleCategoryChange(
                              index,
                              "minProductsSeller",
                              e.target.value
                            )
                          }
                          value={category.minProductsSeller}
                          error={categoryErrors !== undefined}
                          errorMessage={categoryErrors}
                        />
                        <Input
                          label="Max Vendedores"
                          name="maxSellers"
                          type="text"
                          onChange={(e) =>
                            handleCategoryChange(
                              index,
                              "maxSellers",
                              e.target.value
                            )
                          }
                          value={category.maxSellers}
                        />
                        <Input
                          label="Max Productos"
                          name="maxProducts"
                          type="text"
                          onChange={(e) =>
                            handleCategoryChange(
                              index,
                              "maxProducts",
                              e.target.value
                            )
                          }
                          value={category.maxProducts}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateFair}
                className={`submit-button w-full mt-5 mb-5 bg-white flex items-center justify-center text-primary-darker gap-2 p-2 border border-[#D0D5DD] rounded-lg hover:bg-primary-darker hover:text-white hover:shadow-md transition duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <FaCheckCircle />
                    Creando feria...
                  </span>
                ) : (
                  <>
                    <FaCheckCircle />
                    Crear feria
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {openModalUserId && (
          <div
            className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => closeModalHandler()}
          >
            <div
              className="bg-primary-lighter h-[40vh] w-[50vw] p-8 m-3 md:m-0 rounded-3xl relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-2xl font-bold text-primary-darker rounded-full"
                onClick={() => closeModalHandler()}
              >
                ✖
              </button>
              <div className="flex flex-col gap-4 justify-center items-center">
                <p className="font-bold text-3xl flex items-center justify-center text-center text-primary-darker">
                  ¿Querés concluir la feria?
                </p>
                <div className="gap-4 flex">
                  <button
                    onClick={() => handleConcludeFair()}
                    className="bg-primary-darker text-white w-20 p-2 rounded-lg border border-[#D0D5DD]"
                  >
                    Si
                  </button>
                  <button
                    onClick={() => closeModalHandler()}
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

export default WithAuthProtect({ Component: CreateFairForm, role: "admin" });
