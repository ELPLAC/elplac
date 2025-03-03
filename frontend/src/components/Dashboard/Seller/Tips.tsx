import { useFair } from "@/context/FairProvider";
import { StepProps } from "@/types";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

const Tips: React.FC<StepProps> = ({ setVisibleStep }) => {
  const { activeFair } = useFair();
  const termsandcond = activeFair?.entryDescription;
  return (
    <>
      <div className="bg-secondary-lighter rounded-md max-h-full min-h-[50vh] max-w-full min-w-[50%] shadow-lg font-semibold text-primary-dark p-10 overflow-auto">
        <div className="bg-secondary-lighter rounded-md max-w-full min-w-[50%] shadow-lg font-semibold text-primary-dark p-10 overflow-auto mb-2">
          <h1 className="mb-2">INFORMACIÓN Y REQUISITOS:</h1>
          <p>Ingresá al siguiente link:</p>
          <a
            href={termsandcond || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-blue-600 shadow-md rounded-lg h-full block 
                 overflow-auto break-words p-4 hover:underline hover:text-primary-darker-dark"
          >
            {termsandcond || "No hay información"}
          </a>
        </div>
        <div className="bg-secondary-lighter rounded-md max-h-full min-h-[50vh] max-w-full min-w-[50%] shadow-lg font-semibold text-primary-dark p-10 overflow-auto">
          <h4 className="mb-3">TIPS:</h4>
          <ul className="space-y-4 text-lg">
            <li>
              <span>1. </span>Revisar tus items con luz del día para poder
              descartar o lavar artículos manchados o con detalles
            </li>
            <li>
              <span>2. </span>Abrochar botones y/o broches de bodies, camisas,
              etc.
            </li>
            <li>
              <span>3. </span>Atar cordones del calzado
            </li>
            <li>
              <span>4. </span>Lavar el calzado, especialmente las suelas
            </li>
            <li>
              <span>5. </span>Planchar la ropa
            </li>
            <li>
              <span>6. </span>Prestar atención a nuestros precios sugeridos: más
              accesible el precio, mejor posibilidad de venta
            </li>
            <li>
              <span>7. </span>Llenar la descripción de la planilla de productos
              con el mejor detalle posible
            </li>
            <li>
              <span>8. </span>Preparar artículos con piezas sueltas en bolsas
              transparentes
            </li>
            <li>
              <span>9. </span>Todo lo que lleve pilas se entrega con pilas
              funcionando
            </li>
            <li>
              <span>10. </span>Fijar una nota explicando qué es el producto si
              no está claro al solo mirarlo
            </li>
          </ul>
        </div>
        <div className="w-full flex items-end justify-end mt-5">
          <button
            onClick={() => setVisibleStep("DATOS")}
            className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-md shadow-md hover:bg-primary-light transition duration-200"
          >
            <span>Continuar</span>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default Tips;
