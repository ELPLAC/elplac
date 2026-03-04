import React, { useEffect, useState } from "react";
import {
  IProductNotification,
  ProductsGettedBySellerId,
  SellerGettingActiveFairProps,
} from "@/types";
import { useFair } from "@/context/FairProvider";
import { useAuth } from "@/context/AuthProvider";
import { getProductsBySeller } from "@/helpers/services";

const SellerGettingActiveFair: React.FC<SellerGettingActiveFairProps> = ({
  sellerId,
}) => {
  const { activeFair } = useFair();
  const { token } = useAuth();
  const [productsGetted, setProductsGetted] = useState<ProductsGettedBySellerId[]>([]);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        if (activeFair && token) {
          const products = await getProductsBySeller(sellerId, token);
          const filteredProducts = products.filter((product: IProductNotification) => {
            const belongsToActiveFairCategory = activeFair.fairCategories.some(
              (categoryFair) => categoryFair.id === product.fairCategory?.id
            );
            const hasValidStatus = [
              "accepted", "acceptedPlay", "sold", "unsold", "soldOnClearance", "sold_post_fair" // ✅ 1. Agregado al filtro inicial
            ].includes(product.status);
            return belongsToActiveFairCategory && hasValidStatus;
          });
          setProductsGetted(filteredProducts);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSellerProducts();
  }, [sellerId, token, activeFair]);

  // Sección productos vendidos a precio original
  const productsSold = productsGetted.filter((product) => product.status === "sold");
  const totalSoldValue = productsSold.reduce((total, product) => total + (product.price || 0), 0);
  const seventyPercent = totalSoldValue * 0.7;

  // ✅ 2. NUEVA SECCIÓN: Productos vendidos Post-feria (60%)
  const productsPostFair = productsGetted.filter((product) => (product.status as string) === "sold_post_fair");
  const totalPostFairValue = productsPostFair.reduce((total, product) => total + (product.price || 0), 0);
  const postFairEarnings = totalPostFairValue * 0.6;

  // Sección productos vendidos en liquidación
  const productsSoldOnClearance = productsGetted.filter((product) => product.status === "soldOnClearance");
  const totalClearanceValue = productsSoldOnClearance.reduce((total, product) => total + (product.price || 0), 0);
  const clearanceDiscounted = totalClearanceValue * 0.75;
  const clearanceEarnings = clearanceDiscounted * 0.7;

  // ✅ 3. Totales finales actualizados
  const totalProductsSold = productsSold.length + productsPostFair.length + productsSoldOnClearance.length;
  const totalGanancia = seventyPercent + postFairEarnings + clearanceEarnings;

  return (
    <div className="bg-secondary-lighter flex flex-col gap-4">
      {activeFair?.isActive ? (
        <>
          <h1 className="font-semibold text-primary-darker text-3xl">{activeFair?.name}</h1>

          <div className="text-primary-darker font-medium flex flex-col gap-6 text-lg">

            {/* Productos vendidos a precio original */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">🎪 PRODUCTOS VENDIDOS A PRECIO ORIGINAL</h2>
              <div className="flex gap-2">
                <p>Cantidad:</p>
                <span>{productsSold.length.toLocaleString("es-ES")}</span>
              </div>
              <div className="flex gap-2">
                <p>Total en ventas:</p>
                <span>${totalSoldValue.toLocaleString("es-ES")}</span>
              </div>
              <div className="flex gap-2">
                <p>Ganancia (70%):</p>
                <span>${seventyPercent.toLocaleString("es-ES")}</span>
              </div>
            </div>

            {/* ✅ 4. RENDERIZADO NUEVA SECCIÓN POST-FERIA */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold uppercase">🛍️ PRODUCTOS VENDIDOS POST-FERIA</h2>
              <div className="flex gap-2">
                <p>Cantidad:</p>
                <span>{productsPostFair.length.toLocaleString("es-ES")}</span>
              </div>
              <div className="flex gap-2">
                <p>Total en ventas:</p>
                <span>${totalPostFairValue.toLocaleString("es-ES")}</span>
              </div>
              <div className="flex gap-2">
                <p>Ganancia (60%):</p>
                <span className="font-bold text-green-700">${postFairEarnings.toLocaleString("es-ES")}</span>
              </div>
            </div>

            {/* Productos vendidos en liquidación */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">🏷️ PRODUCTOS VENDIDOS EN LIQUIDACIÓN</h2>
              <div className="flex gap-2">
                <p>Cantidad:</p>
                <span>{productsSoldOnClearance.length.toLocaleString("es-ES")}</span>
              </div>
              <div className="flex gap-2">
                <p>Total en ventas (con 25% de descuento):</p>
                <span>${clearanceDiscounted.toLocaleString("es-ES")}</span>
              </div>
              <div className="flex gap-2">
                <p>Ganancia (70% sobre monto con descuento):</p>
                <span>${clearanceEarnings.toLocaleString("es-ES")}</span>
              </div>
            </div>

            {/* Total final */}
            <div className="flex flex-col gap-2 border-t-2 border-primary-darker pt-4">
              <h2 className="text-2xl font-bold">📦 TOTAL FINAL</h2>
              <div className="flex gap-2">
                <p>Total de productos vendidos:</p>
                <span>{totalProductsSold.toLocaleString("es-ES")}</span>
              </div>
              <div className="flex gap-2 underline decoration-double">
                <p>Total a recibir:</p>
                <span className="font-bold text-3xl text-green-800">${totalGanancia.toLocaleString("es-ES")}</span>
              </div>
            </div>

          </div>
        </>
      ) : (
        <h2 className="font-semibold text-primary-darker text-2xl">
          No hay una feria activa en este momento.
        </h2>
      )}
    </div>
  );
};

export default SellerGettingActiveFair;