"use client";
import React, { useState } from "react";
import Header from "./Header/Header";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const formattedAnswer = answer
    .replace(
      "* FERIAS DE ROPA Y ARTÍCULOS:",
      '<span class="text-xl font-bold">FERIAS DE ROPA Y ARTÍCULOS:</span>'
    )
    .replace(
      "*FERIAS DE ROPA:",
      '<span class="text-xl font-bold">FERIAS DE ROPA:</span>'
    )
    .replace(
      "FERIA DE DÍA DEL NIÑO Y DICIEMBRE:",
      '<span class="text-xl font-bold">FERIA DE DÍA DEL NIÑO Y DICIEMBRE:</span>'
    )
    .replace(
      "SOLO PARA FERIAS DE DICIEMBRE:",
      '<span class="text-xl font-bold">SOLO PARA FERIAS DE DICIEMBRE:</span>'
    );
  return (
    <div className="mb-2">
      <button
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center p-4 bg-secondary-lighter rounded-md text-left focus:outline-none focus:ring-2 focus:from-primary-darker border border-secondary-light"
      >
        <span className="font-medium text-lg text-primary-darker">
          {question}
        </span>
        <span className="ml-4 font-bold text-primary-dark">
          {isOpen ? "-" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="mt-2 p-4 bg-secondary-lighter rounded-md ">
          <p
            className="font-medium text-primary-dark whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: formattedAnswer }}
          />
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs: FAQItemProps[] = [
    {
      question: "¿Tengo que estar presente para vender en la feria?",
      answer: `- No. El vendedor no tiene que estar presente para vender en la feria.`,
    },
    {
      question: "¿Cuáles son mis ganancias?",
      answer: `- El vendedor asigna los precios y gana el 70%.`,
    },
    {
      question: "¿Cuáles son los requisitos para participar en la feria?",
      answer: `- Registrarse como vendedor
              - Pagar la inscripción
              - Seguir los pasos para preparar artículos
              - Entregar o enviar productos en el lugar y fecha designada`,
    },
    {
      question: "¿Qué productos se venden en las ferias?",
      answer: `
      *FERIAS DE ROPA:
      - Ropa talles 0 meses a 12 años, y calzado únicamente de temporada de la feria, de primera marca y en excelente estado. Debe estar limpio, planchado y sin agujeros, manchas, pelos, decoloración, partes faltantes, ni roturas
              - Ropa de embarazo de temporada
              - Accesorios de bebé (portabebé, sacaleche, mochila maternal, gimnasio, piso de goma eva, etc.).
              
              FERIA DE DÍA DEL NIÑO Y DICIEMBRE:
              - Juguetes
              - Bicicletas, camicletas, rollers, patines
              - Peluches: únicamente de personajes conocidos
              - Juegos de mesa completos, sin partes faltantes
              - Rompecabezas hasta 200 piezas (contadas y completas)
              - Disfraces
              - Mochilas, cartucheras infantiles (impecables)
              - Libros infantiles en castellano o inglés

              SOLO PARA FERIAS DE DICIEMBRE: 
              - Trajes de baño de primeras marcas
              - Remeras/trajes de agua
              - Toallas infantiles/ponchos/salidas de baño
              - Calzado de neoprene/crocs/ojotas
              - Gorros
              - Accesorios tipo anteojos, antiparras
              - Chalecos y salvavidas (NO bracitos)`,
    },

    {
      question: "¿Qué productos NO se pueden vender en la feria?",
      answer: `
      * FERIAS DE ROPA Y ARTÍCULOS:
      - Ropa y artículos fuera de temporada
      - Segundas marcas (ej.: Advanced, Gamise, Blue, Naranjo, Zuppa, Le Utthe, Creciendo, Tex, Urb, Luz de Estrellita, etc.)
      - Gorritos bebé de algodón simples (ej.: los del ajuar que tienen forma de semicírculo o nudo)
      - Sábanas, chichoneras, ropa de cama
      - Chupetes, mordillos, etc. usados
      - Ropa interior usada
      - Pañales
      - Productos de tocador
      - Medicación y objetos medicinales
      - Productos singulares (ej.: un accesorio para un cochecito específico que no es universal)
      - CDs/DVDs
      - Inflables
      
      *FERIA DE DÍA DEL NIÑO Y DICIEMBRE:
      - Juguetes/accesorios simples de bebé (ej: sonajeros básicos, mordillos, trapitos de apego, peluches, etc.)
      - Juguetes de plástico de baja calidad (ejemplo marca Bimbi)
      - Juguetes de McDonalds, Burger King, etc.
      - Juegos de cartas tipo “Bontus”
      - Rompecabezas carton sueltas sin su caja/imagen
      - Juguetes que fueron furor por un tiempo corto (ej: spinners, pop-its)
      - Juguetes con desperfectos que perjudiquen su funcionamiento
      - Juguetes rotos o con rajaduras
      - Juguetes incompletos, sin pila, etc.
      - Peluches genéricos
      - Inflables (incluyendo bracitos)
      - CDs/DVDs`,
    },
    {
      question: "¿Qué sucede con los artículos que no se venden?",
      answer: `Para los artículos que no se vendan, el vendedor tiene la posibilidad de:
      1) Dejarlos a la venta con EL PLAC, en cuenta crédito (50%),
Consignación (40%) o Pago Adelantado (20%)
      2) Retirarlos 
      3) Donarlos a nuestra Canasta Solidaria`,
    },
    {
      question: "¿Cómo es la modalidad de pago?",
      answer: `Al finalizar la feria, los vendedores reciben un mail "post-feria" con los pasos a seguir. Se podrá elegir cobrar por transferencia o en efectivo.
`,
    },
  ];

  return (
    <div className="">
      <div className="">
        <Header />
      </div>

      <div className="bg-primary-lighter">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-primary-darker text-5xl font-bold">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-primary-dark mt-5">
                Todo lo que necesitas saber para participar en la feria
              </p>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <div className="flex flex-col space-y-4 h-full max-h-full overflow-y-auto">
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
