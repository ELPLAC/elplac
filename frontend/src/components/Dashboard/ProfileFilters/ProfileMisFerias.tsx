import { useProfile } from "@/context/ProfileProvider";
import { IProduct, ProfileFairsProps } from "@/types";
import React from "react";

const MisFerias: React.FC<ProfileFairsProps> = ({ fairs }) => {
  const { userDtos } = useProfile();
  const userRegistrations = userDtos?.registrations || [];
  const userFairs = userDtos?.seller?.registrations || [];
  const products = userDtos?.seller?.products || [];
  const numberOfFairs =
    userDtos?.role === "seller"
      ? userFairs.length
      : userDtos?.role === "user"
      ? userRegistrations.length
      : 0;

  return (
    <div className="h-full flex p-2 flex-col overflow-y-auto max-h-[900px] overflow-x-hidden">
      <label className="font-semibold text-primary-darker text-sm">
        Historial de {numberOfFairs} feria/s:
      </label>

      {userDtos?.role === "seller" && (
        <div className="shadow-lg flex flex-col font-semibold rounded-lg p-4 mt-4 w-full max-w-[500px]">
          {userFairs.length > 0 ? (
            userFairs.map((registration: any, index: number) => {
              const fairProducts = products.filter((product: IProduct) => {
                return product.fairCategory?.fair?.id === registration?.fair?.id;
              });

              let totalSinLiquidacion = 0;
              let totalLiquidacion = 0;
              let totalPostFeria = 0;

              fairProducts.forEach((product: any) => {
                const status = product?.status as string; // Casting para evitar errores de TS
                if (status === "sold") {
                  totalSinLiquidacion += product?.price * 0.7 || 0;
                } else if (status === "soldOnClearance") {
                  totalLiquidacion += product?.price * 0.75 * 0.7 || 0;
                } else if (status === "sold_post_fair") {
                  totalPostFeria += product?.price * 0.6 || 0; // Ganancia del 60% para post-feria
                }
              });

              const totalProductsSold = fairProducts.filter(
                (p) => (p.status as string) === "sold"
              ).length;
              const totalProductsSoldOnClearance = fairProducts.filter(
                (p) => (p.status as string) === "soldOnClearance"
              ).length;
              const totalProductsPostFair = fairProducts.filter(
                (p) => (p.status as string) === "sold_post_fair"
              ).length;
              const totalProductsUnsold = fairProducts.filter(
                (p) => (p.status as string) === "unsold"
              ).length;

              return (
                <details key={registration.id || index} className="mb-4 border-b pb-2">
                  <summary className="cursor-pointer text-primary-darker text-sm border-b border-primary-default mb-2">
                    <strong>Feria: </strong> {registration?.fair?.name}{" - "}(
                    {registration?.fair?.isActive ? "Activa" : "Cerrada"})
                  </summary>

                  <div className="ml-4 mt-2">
                    <h3 className="text-primary-darker text-sm font-semibold mt-2">
                      Productos:
                    </h3>
                    <div className="max-h-[200px] overflow-y-auto">
                      {fairProducts.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {fairProducts.map((product: any) => {
                            const isPostFair = (product.status as string) === "sold_post_fair";
                            return (
                              <li 
                                key={product.id} 
                                className={`text-sm p-1 rounded ${
                                  isPostFair ? "bg-cyan-50 text-cyan-800 font-bold" : "text-primary-darker"
                                }`}
                              >
                                {product.brand} - {product.description} - ${product.price} -{" "}
                                {product.status === "sold"
                                  ? "Vendido"
                                  : product.status === "soldOnClearance"
                                  ? "Vendido en liquidación"
                                  : isPostFair
                                  ? "Vendido Post-feria"
                                  : "No vendido"}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-primary-darker text-sm">
                          No hay productos registrados.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-1 mt-3 border-t pt-2">
                      <p className="text-primary-darker text-xs font-normal">
                        <strong>Vendidos (Feria): </strong>
                        {totalProductsSold + totalProductsSoldOnClearance}
                      </p>
                      <p className="text-cyan-700 text-xs font-bold">
                        <strong>Vendidos (Post-Feria): </strong>
                        {totalProductsPostFair}
                      </p>
                      <p className="text-primary-darker text-xs font-normal">
                        <strong>No vendidos: </strong>
                        {totalProductsUnsold}
                      </p>
                    </div>

                    <div className="mt-4 bg-gray-50 p-2 rounded-lg">
                      <h3 className="text-primary-darker text-sm font-semibold mb-1">
                        Ganancias estimadas:
                      </h3>
                      <p className="text-primary-darker text-xs font-normal">
                        Total Original (70%): ${totalSinLiquidacion.toFixed(2)}
                      </p>
                      <p className="text-primary-darker text-xs font-normal">
                        Total Liquidación (70% s/desc): ${totalLiquidacion.toFixed(2)}
                      </p>
                      <p className="text-cyan-700 text-xs font-bold">
                        Total Post-Feria (60%): ${totalPostFeria.toFixed(2)}
                      </p>
                      <div className="border-t border-gray-300 mt-1 pt-1">
                        <p className="text-primary-darker text-sm font-bold">
                          Total Final a recibir: ${(totalSinLiquidacion + totalLiquidacion + totalPostFeria).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </details>
              );
            })
          ) : (
            <p>No se encontraron ferias para mostrar.</p>
          )}
        </div>
      )}

      {userDtos?.role === "user" && (
        <div className="shadow-lg flex flex-col font-semibold rounded-lg p-4 mt-4 w-full max-w-[500px]">
          {userRegistrations.length > 0 ? (
            userRegistrations.map((registration: any, index: number) => {
              const {
                fair,
                registrationDate,
                registrationDay,
                registrationHour,
                entryFee,
              } = registration;
              const entryText =
                entryFee === 0 ? "Entrada gratuita" : `$${entryFee}`;

              return (
                <details key={registration.id || index} className="mb-4 border-b pb-2">
                  <summary className="cursor-pointer text-primary-darker text-sm border-b border-primary-default mb-2">
                    <strong>Feria: </strong> {fair?.name}{" - "}({registration?.fair?.isActive ? "Activa" : "Cerrada"})
                  </summary>

                  <div className="ml-4 mt-2">
                    <p className="text-primary-darker text-sm font-normal">
                      <strong>Fecha de registro: </strong>
                      {registrationDate &&
                        new Date(registrationDate).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                    </p>

                    <p className="text-primary-darker text-sm font-normal">
                      <strong>Día para ir: </strong>
                      {registrationDay &&
                        new Date(registrationDay).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                    </p>

                    <p className="text-primary-darker text-sm font-normal">
                      <strong>Hora para ir: </strong>
                      {registrationHour}
                    </p>
                    <p className="text-primary-darker text-sm font-normal">
                      <strong>Precio de entrada: </strong>
                      {entryText}
                    </p>
                  </div>
                </details>
              );
            })
          ) : (
            <p>No te has registrado en ninguna feria aún.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MisFerias;