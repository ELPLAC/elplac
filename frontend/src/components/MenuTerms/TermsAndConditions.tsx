import React, { useState } from "react";
import Aceptaciondelosterminos from "./Aceptaciondelosterminos";
import Cookies from "./Cookies";
import Licencia from "./Licencia";
import Avisolegal from "./Avisolegal";
import TermsAndCondition from "./TermsAndCondition";
import Revision from "./Revisión";
import Reembolsos from "./Claim";

function TermsAndConditions() {
  const [activeComponent, setActiveComponent] = useState("TermsAndCondition");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case "TermsAndCondition": return <TermsAndCondition />;
      case "Aceptaciondelosterminos": return <Aceptaciondelosterminos />;
      case "Cookies": return <Cookies />;
      case "Licencia": return <Licencia />;
      case "Avisolegal": return <Avisolegal />;
      case "Revision": return <Revision />;
      case "Reembolsos": return <Reembolsos />;
      default: return <TermsAndCondition />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-primary-lighter w-full">
      <button
        className="md:hidden p-4 bg-primary-darker text-white text-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Cerrar Menú" : "Abrir Menú"}
      </button>
      
      <div className={`md:w-1/4 p-10 bg-primary-lighter ${menuOpen ? "block" : "hidden"} md:block`}>
        <ul className="bg-primary-lighter">
          {["TermsAndCondition", "Aceptaciondelosterminos", "Revision", "Cookies", "Licencia", "Avisolegal", "Reembolsos"].map((item) => (
            <li
              key={item}
              className={`cursor-pointer py-2 ${activeComponent === item ? "font-bold text-lg text-primary-darker" : "font-semibold text-primary-darker"}`}
              onClick={() => {
                setActiveComponent(item);
                setMenuOpen(false);
              }}
            >
              {{"TermsAndCondition": "Política de Términos y Condiciones",
                "Aceptaciondelosterminos": "Aceptación de los términos",
                "Revision": "Revisión",
                "Cookies": "Cookies",
                "Licencia": "Licencia",
                "Avisolegal": "Aviso legal",
                "Reembolsos": "Política de devoluciones y reembolsos"
              }[item]}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="md:w-3/4 p-6 flex-1 overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
}

export default TermsAndConditions;
