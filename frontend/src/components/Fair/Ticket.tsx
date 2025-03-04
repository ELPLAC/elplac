"use client";
import { useFair } from "@/context/FairProvider";
import { useProfile } from "@/context/ProfileProvider";
import React, { useEffect, useState } from "react";
import { TicketProps } from "@/types";
import Modal from "../Modal";
import { postInscription, postTicket } from "@/helpers/services";
import { useAuth } from "@/context/AuthProvider";
import PaymentsUser from "../Payments/PaymentsUser";
import PaymentsSeller from "../Payments/PaymentsSeller";

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Ticket: React.FC<TicketProps> = ({
  name,
  salesChecked,
  category,
  termsChecked,
}) => {
  const [amount, setAmount] = useState<number | string>("");
  const [charitableEntity, setCharitableEntity] = useState("");
  const { fairs, timeSelect, dateSelect } = useFair();
  const { token } = useAuth();
  const { userDtos } = useProfile();
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fairSelectedPerUser = fairs.find((f) => f.name === name);
  const categorySelected = fairSelectedPerUser?.fairCategories.find(
    (c) => c.category?.name === category
  );
  const formattedDate = dateSelect
    ? formatDateToYYYYMMDD(new Date(dateSelect))
    : null;
  console.log("fairSelectedPerUser:", fairSelectedPerUser);
  console.log("salesChecked:", salesChecked);
  console.log("categorySelected:", categorySelected);
  console.log("termsChecked:", termsChecked);

  useEffect(() => {
    if (fairSelectedPerUser) {
      if (
        userDtos?.role === "seller" &&
        fairSelectedPerUser.entryPriceSeller !== undefined &&
        fairSelectedPerUser.entryPriceSeller > 0
      ) {
        setAmount(fairSelectedPerUser.entryPriceSeller);
      } else if (
        userDtos?.role === "user" &&
        fairSelectedPerUser.entryPriceBuyer !== undefined &&
        fairSelectedPerUser.entryPriceBuyer > 0
      ) {
        setAmount(fairSelectedPerUser.entryPriceBuyer);
        setCharitableEntity(fairSelectedPerUser.entryDescription || "");
      } else {
        setAmount("");
        setCharitableEntity("");
      }
    } else {
      setAmount("");
      setCharitableEntity("");
    }
  }, [fairSelectedPerUser, userDtos?.role]);

  const handleBuy = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      if (!fairSelectedPerUser || !token || !userDtos) {
        alert("Datos incompletos. Por favor revisa la información.");
        return;
      }

      if (userDtos?.role === "seller") {
        if (!categorySelected) {
          alert("Por favor selecciona una categoría.");
          return;
        }
        const liquidation = salesChecked === "si" ? "si" : "no";

        const response = await postInscription(
          fairSelectedPerUser?.id,
          userDtos?.seller?.id,
          categorySelected?.id,
          liquidation,
          token
        );
        if (response) {
          alert("Inscripción realizada con éxito.");
        } else {
          alert("Error al realizar la inscripción.");
        }
      }

      if (userDtos?.role === "user") {
        if (!formattedDate || !timeSelect) {
          alert("Por favor selecciona una fecha y hora.");
          return;
        }

        const response = await postTicket(
          fairSelectedPerUser?.id,
          userDtos?.id,
          token,
          formattedDate,
          timeSelect
        );
        if (response) {
          setOpenModal(true);
        } else {
          alert("Error al adquirir el turno.");
        }
      }
    } catch (error) {
      alert("Ocurrió un error. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    window.location.reload();
  };

  return (
    <div className="text-primary-darker">
      <div className="flex items-center">
        {userDtos?.role === "user" ? (
          <>
            <p className="font-bold"></p>
            {fairSelectedPerUser &&
            fairSelectedPerUser.entryPriceBuyer === 0 ? (
              <div className="flex flex-col">
                <input
                  type="text"
                  value="¡Sin costo!"
                  readOnly
                  className="text-primary-darker bg-transparent"
                />
                <button
                  onClick={handleBuy}
                  className="mt-4 px-4 py-2 text-white rounded-md hover:bg-primary-dark focus:outline-none bg-primary-darker disabled:cursor-not-allowed disabled:bg-primary-light"
                  disabled={!fairSelectedPerUser || !dateSelect || !timeSelect}
                >
                  Adquirí tu turno
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-2">
                  <label className="font-bold"> Precio:</label>
                  <p>${amount}</p>
                </div>
                <div>
                  <label className="font-bold">Descripción</label>
                  <p>{charitableEntity}</p>
                </div>
                <div>
                  <PaymentsUser
                    userId={userDtos.id}
                    fairId={fairSelectedPerUser?.id}
                    registrationHour={timeSelect}
                    registrationDay={formattedDate}
                    handleBuy={handleBuy}
                    className="mt-4 px-4 py-2 text-white rounded-md hover:bg-primary-dark focus:outline-none bg-primary-darker disabled:cursor-not-allowed disabled:bg-primary-light"
                    disabled={
                      !fairSelectedPerUser || !dateSelect || !timeSelect
                    }
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="mb-2">
              {amount && (
                <>
                  <p>Inscripción:</p>
                  <p>${amount}</p>
                </>
              )}
            </div>
            <div>
              <PaymentsSeller
                userId={userDtos?.id}
                fairId={fairSelectedPerUser?.id}
                categoryId={categorySelected?.id}
                liquidation={salesChecked === "si" ? "si" : "no"}
                handleBuy={handleBuy}
                className="mt-4 px-4 py-2 text-white rounded-md hover:bg-primary-dark focus:outline-none bg-primary-darker disabled:cursor-not-allowed disabled:bg-primary-light"
                disabled={
                  !fairSelectedPerUser ||
                  !salesChecked ||
                  !categorySelected ||
                  !termsChecked
                }
              />
            </div>
          </div>
        )}
        {openModal && (
          <div>
            <Modal
              onCloseModal={handleModalClose}
              message="Gracias por inscribirte en la Feria, en breve te enviaremos un mail con tus datos para que presentes en la entrada para poder ingresar"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;
