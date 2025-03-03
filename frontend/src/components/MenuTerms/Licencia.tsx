"use client";
import React, { useState } from "react";

function Licencia() {
  return (
    <div className="flex bg-primary-lighter m-10">
      <div className="w-full p-6 mr-8">
        <div>
          <h2 className="text-lg font-bold text-primary-darker mb-8">
            Licencia
          </h2>

          <p className="text-primary-dark text-justify mb-2">
          A menos que se indique lo contrario, a El Plac le  pertenecen los derechos de propiedad intelectual de todo el material de la página web.
          </p>

          <p className="text-primary-dark text-justify mb-2">
          Todos los derechos de propiedad intelectual están reservados. Puedes ver y/o imprimir páginas desde www.elplac.com  para tu uso personal sujeto a las restricciones establecidas en estos términos y condiciones.
          </p>

          <p className="text-primary-dark text-justify mb-2">No debes:</p>

          <p className="text-primary-dark text-justify mb-2">
            - Volver a publicar material desde www.elplac.com .
          </p>

          <p className="text-primary-dark text-justify mb-2">
            - Vender, alquilar u otorgar una sub-licencia de material desde
            www.elplac.com.
          </p>

          <p className="text-primary-dark text-justify mb-2">
            - Reproducir, duplicar o copiar material desde www.elplac.com .
          </p>

          <p className="text-primary-dark text-justify mb-2">
            - Redistribuir contenido de El Plac, a menos de que el contenido se
            haga específicamente para la redistribución.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Licencia;
