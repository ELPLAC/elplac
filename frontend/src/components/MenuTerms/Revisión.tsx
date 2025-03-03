"use client";

function Revision() {
  return (
    <div className="flex bg-primary-lighter m-10">
      <div className="w-full p-6 mr-8">
        <div>
          <h2 className="text-lg font-bold text-primary-darker mb-8">
            Revisión
          </h2>

          <p className="text-primary-dark text-justify mb-2">
            Los artículos recibidos por los usuarios registrados como vendedores, serán revisados por nuestro personal para
            asegurarnos que se encuentren en condiciones aptas para su venta. En
            caso de que encontráramos en uno o varios de ellos algún detalle o
            desperfecto que imposibilite su venta estos no serán aceptados.
          </p>

          <p className="text-primary-dark text-justify mb-2">
            En ningún caso podremos hacernos responsables por objetos olvidados
            dentro de los artículos recibidos para inspección y/o consignación.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Revision;
