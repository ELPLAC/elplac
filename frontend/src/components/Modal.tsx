import { ModalProps } from "@/types";
import React from "react";

const Modal: React.FC<ModalProps> = ({ onCloseModal, message }) => {
  return (
    <div
      className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCloseModal}>
      <div
        className="bg-primary-lighter h-[40vh] w-[50vw] p-8 m-3 md:m-0 rounded-3xl relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-2xl font-bold text-primary-darker rounded-full"
          onClick={onCloseModal}>
          ✖
        </button>
        <div className="flex justify-center items-center">
          <p className="font-bold text-3xl flex items-center justify-center text-center text-primary-darker">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
