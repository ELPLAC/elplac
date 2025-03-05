import { toast } from "react-toastify";
import React from "react";
import "./Notifications.css";
import Image from "next/image";
import loginBanner from "@/assets/loginBanner.png";
import shoes from "@/assets/shoes.png";
import sunglasses from "@/assets/sunglasses.png";
import { AiOutlineMail } from "react-icons/ai";

<AiOutlineMail />;

interface ToastWithButtonsProps {
  message: string;
  onAccept?: () => void;
  onCancel?: () => void;
}

const ToastRegular: React.FC<ToastWithButtonsProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-2">
    {message}
  </div>
);

const ToastWithHeader: React.FC<ToastWithButtonsProps> = ({ message }) => (
  <div className="flex flex-col gap-10 p-0 m-0 relative">
    <div className="absolute -translate-x-[7px] -translate-y-9 h-[35px] w-[300px] p-0 m-0">
      <Image
        src={loginBanner}
        alt="loginbanner"
        layout="fill"
        objectFit="cover"
        objectPosition="0px 0px"
      />
    </div>
    <div className="absolute translate-y-1 text-primary-darker font-bold flex flex-col items-center justify-center h-3 w-full p-0 m-0">
      {message}
    </div>
  </div>
);

const ToastSuccess: React.FC<ToastWithButtonsProps> = ({ message }) => (
  <div className="flex flex-col gap-10 p-0 m-0 relative ">
    <div className="absolute translate-x-[2px] -translate-y-5 h-[40px] w-[40px] p-0 m-0">
      <Image
        src={sunglasses}
        alt="loginbanner"
        layout="fill"
        objectFit="cover"
        objectPosition="0px 0px"
      />
    </div>
    <div className="absolute translate-x-[30px] -translate-y-2 text-center text-primary-darker font-bold flex flex-col items-center justify-center h-3 w-full p-0 m-0">
      {message}
    </div>
  </div>
);

const ToastError: React.FC<ToastWithButtonsProps> = ({ message }) => (
  <div className="flex flex-col gap-10 p-0 m-0 relative">
    <div className="absolute translate-x-[2px] -translate-y-5 h-[40px] w-[40px] p-0 m-0">
      <Image
        src={shoes}
        alt="loginbanner"
        layout="fill"
        objectFit="cover"
        objectPosition="0px 0px"
      />
    </div>
    <div className="absolute translate-x-[30px] -translate-y-2 text-center text-red-800 font-bold flex flex-col items-center justify-center h-3 w-full p-0 m-0">
      {message}
    </div>
  </div>
);

const ToastWarning: React.FC<ToastWithButtonsProps> = ({ message }) => (
  <div className="flex flex-col gap-10 p-0 m-0 relative">
    <div className="absolute translate-x-[2px] -translate-y-5 h-[40px] w-[40px] p-0 m-0">
      <Image
        src={shoes}
        alt="loginbanner"
        layout="fill"
        objectFit="cover"
        objectPosition="0px 0px"
      />
    </div>
    <div className="absolute translate-x-[30px] -translate-y-2 text-center text-primary-darker font-bold flex flex-col items-center justify-center h-3 w-full p-0 m-0">
      {message}
    </div>
  </div>
)
const ToastRedirect: React.FC<ToastWithButtonsProps> = ({
  message,
  onAccept,
  onCancel,
}) => (
  <div className="flex flex-col gap-10 p-0 m-0 relative h-16">
    <div className="absolute translate-y-1 text-center text-primary-darker font-bold flex flex-col items-center justify-center h-16 w-full p-0 m-0 mb-2">
      {message}
      <br />
      <div className="flex flex-row gap-4 pt-2">
      </div>
    </div>
  </div>
);

const ToastDelete: React.FC<ToastWithButtonsProps> = ({
  message,
  onAccept,
  onCancel,
}) => (
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    {message}
    <br />
    <div className="flex flex-row gap-4">
      <button
        className="flex h-12 w-28 items-center justify-center rounded-3xl border border-neutral-700 p-4 text-sm"
        onClick={onAccept}
      >
        Si
      </button>

      <button
        className="items-center w-28 flex h-12 justify-center rounded-3xl border border-neutral-700 p-4 text-sm"
        onClick={onCancel}
      >
        No
      </button>
    </div>
  </div>
);

const ToastChoose: React.FC<ToastWithButtonsProps> = ({
  message,
  onAccept,
  onCancel,
}) => (
  <div className="flex flex-col items-center justify-center gap-4 text-center font-bold text-primary-darker">
    {message}
    <br />
    <div className="flex flex-row gap-4">
      <button
        className="flex h-12 w-28 items-center justify-center rounded-3xl border border-neutral-700 p-4 text-sm"
        onClick={onAccept}
      >
        Si
      </button>

      <button
        className="items-center w-28 flex h-12 justify-center rounded-3xl border border-neutral-700 p-4 text-sm"
        onClick={onCancel}
      >
        No
      </button>
    </div>
  </div>
);

export const notify = (
  type:
    | "ToastError"
    | "ToastRegular"
    | "ToastRedirect"
    | "ToastSuccess"
    | "ToastWithHeader"
    | "ToastChoose"
    | "ToastDelete"
    |  "ToastWarning",
  message: string,
  onAccept?: () => void,
  onCancel?: () => void,
  removeFromCart?: (id: number) => void,
  id?: number
) => {
  switch (type) {
    case "ToastWarning":
      toast(
        <ToastWarning
          message={message}
          onAccept={() => toast.dismiss()}
          onCancel={() => toast.dismiss()}
        />,
        {
          position: "top-right",
          className: "custom-toast-warning",
          style: {
            color: "#FFFFFF",
            fontSize: "15px",
            width: "300px",
            border: "1px solid #343434",
          },
          autoClose: 8000,
        }
      );
      break;

    case "ToastError":
      toast(
        <ToastError
          message={message}
          onAccept={() => toast.dismiss()}
          onCancel={() => toast.dismiss()}
        />,
        {
          position: "top-right",
          className: "custom-toast-error",
          style: {
            color: "#FFFFFF",
            fontSize: "15px",
            width: "300px",
            border: "1px solid #343434",
          },
          autoClose: 4000,
        }
      );
      break;

    case "ToastRegular":
      toast(
        <ToastRegular
          message={message}
          onAccept={() => toast.dismiss()}
          onCancel={() => toast.dismiss()}
        />,
        {
          position: "top-right",
          style: {
            backgroundColor: "#171717",
            color: "#FFFFFF",
            fontSize: "15px",
            width: "300px",
            border: "1px solid #343434",
          },
          autoClose: 4000,
        }
      );
      break;

    case "ToastSuccess":
      toast(
        <ToastSuccess
          message={message}
          onAccept={() => toast.dismiss()}
          onCancel={() => toast.dismiss()}
        />,
        {
          position: "top-right",
          className: "custom-toast-success",
          style: {
            color: "#FFFFFF",
            fontSize: "15px",
            width: "300px",
            border: "1px solid #343434",
          },
          autoClose: 4000,
        }
      );
      break;

    case "ToastWithHeader":
      toast(
        <ToastWithHeader
          message={message}
          onAccept={() => toast.dismiss()}
          onCancel={() => toast.dismiss()}
        />,
        {
          position: "top-right",
          className: "custom-toast-with-header",
          style: {
            color: "#FFFFFF",
            fontSize: "15px",
            width: "300px",
            border: "1px solid #343434",
          },
          autoClose: 4000,
        }
      );
      break;

    case "ToastRedirect":
      toast(
        <ToastRedirect
          message={message}
          onAccept={() => toast.dismiss()}
          onCancel={() => toast.dismiss()}
        />,
        {
          position: "top-right",
          style: {
            color: "#FFFFFF",
            fontSize: "15px",
            width: "300px",
            border: "1px solid #343434",
          },
          autoClose: 8000,
        }
      );
      break;

    case "ToastDelete":
      toast(
        <ToastDelete
          message={message}
          onAccept={() => {
            if (removeFromCart && id) {
              removeFromCart(id);
              toast.dismiss();
            }
          }}
          onCancel={() => toast.dismiss()}
        />,
        {
          position: "top-right",
          style: {
            backgroundColor: "#171717",
            color: "#FFFFFF",
            fontSize: "15px",
            width: "300px",
            border: "1px solid #343434",
          },
          autoClose: 4000,
        }
      );
      break;

    case "ToastChoose":
      toast(
        <ToastChoose
          message={message}
          onAccept={() => {
            toast.dismiss();
            notify(
              "ToastSuccess",
              "Turno confirmado - Revisa tu casilla de correo"
            );
          }}
          onCancel={() => toast.dismiss()}
        />,
        {
          position: "top-right",
          style: {
            color: "#FFFFFF",
            fontSize: "15px",
            width: "300px",
            border: "1px solid #343434",
          },
          autoClose: 10000,
        }
      );
      break;

    default:
      toast(message, {
        position: "top-right",
        style: {
          backgroundColor: "#9E9E9E",
          color: "#FFFFFF",
          fontSize: "20px",
          width: "300px",
        },
      });
  }
};
