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
          const filteredProducts = products.filter(
            (product: IProductNotification) => {
              const belongsToActiveFairCategory =
                activeFair.fairCategories.some(
                  (categoryFair) => categoryFair.id === product.fairCategory?.id
                );

              const hasValidStatus =
                ["accepted", "acceptedPlay", "sold", "unsold", "soldOnClearance"].includes(product.status);

              return belongsToActiveFairCategory && hasValidStatus;
            }
          );

          setProductsGetted(filteredProducts);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSellerProducts();
  }, [sellerId, token, activeFair]);

  const productsSold = productsGetted.filter((product) => product.status === "sold");

  const totalSoldValue = productsSold.reduce((total, product) => total + (product.price || 0), 0);

  const seventyPercent = totalSoldValue * 0.7;

  const productsSoldOnClearance = productsGetted.filter((product) => product.status === "soldOnClearance");

  const totalClearanceValue = productsSoldOnClearance.reduce((total, product) => total + (product.price || 0), 0);

  const totalAfterClearanceDiscount = totalClearanceValue * 0.75;

  const sellerEarnings = totalAfterClearanceDiscount * 0.7;

  const totalGanancia = sellerEarnings + seventyPercent;

  return (
    <div className="bg-secondary-lighter flex flex-col gap-4">
      {activeFair?.isActive ? (
        <>
          <h1 className="font-semibold text-primary-darker text-3xl">
            {activeFair?.name}
          </h1>
          <div className="text-primary-darker font-medium flex flex-row gap-4 text-lg">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p>Productos aceptados:</p> 
                <span>{productsGetted.length.toLocaleString("es-ES")}</span>
              </div>
  
              <div className="flex gap-2">
                <p>Productos vendidos:</p> 
                <span>{productsSold.length.toLocaleString("es-ES")}</span>
              </div>
  
              <div className="flex gap-2">
                <p>Total vendido:</p>
                <span>${totalSoldValue.toLocaleString("es-ES")}</span>
              </div>
  
              <div className="flex gap-2">
                <p>Total vendido en liquidación:</p>
                <span>${totalAfterClearanceDiscount.toLocaleString("es-ES")}</span>
              </div>
  
              <div className="flex gap-2">
                <p>Ganancia (%70):</p>
                <span>${totalGanancia.toLocaleString("es-ES")}</span>
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
