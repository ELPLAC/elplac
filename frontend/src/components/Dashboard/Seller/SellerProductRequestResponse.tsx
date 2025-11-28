import React, { useEffect, useState } from "react";
import {
  ProductsGettedBySellerId,
  ISellerProductRequestTableProps,
  IProductNotification,
} from "@/types";
import { getProductsBySeller } from "@/helpers/services";
import { Badge } from "../../Badges";
import { useAuth } from "@/context/AuthProvider";
import { useFair } from "@/context/FairProvider";

const SellerProductRequestResponse: React.FC<
  ISellerProductRequestTableProps
> = ({ sellerId }) => {
  const [productsGetted, setProductsGetted] = useState<
    ProductsGettedBySellerId[] | null
  >(null);
  const { token } = useAuth();
  const { activeFair } = useFair();

  useEffect(() => {
    if (activeFair && token && sellerId) {
      getProductsBySeller(activeFair.id,sellerId, token)
        .then((products) => {
          const filteredProducts = products.filter(
            (product: IProductNotification) =>
              activeFair.fairCategories.some(
                (categoryFair) => categoryFair.id === product.fairCategory?.id
              )
          );
          setProductsGetted(filteredProducts);
        })
        .catch((error) => {});
    }
  }, [sellerId, token, activeFair]);

  const detailsColumns = [
    { id: "code", label: "Código", sortable: true },
    { id: "description", label: "Descripción", sortable: true },
    { id: "price", label: "Precio", sortable: true },
    { id: "liquidation", label: "Liquidación", sortable: true },
    { id: "states", label: "Estado", sortable: true },
  ];

  const applyLiquidation = (price: number) => {
    const discount = price * 0.25;
    const finalPrice = price - discount;
    return finalPrice;
  };

  return (
    <div className="overflow-x-auto overflow-y-auto w-full">
      <table className="w-full min-w-max text-base text-left rtl:text-right bg-secondary-lighter border-separate border-spacing-0 mb-12">
        <thead className="text-sm text-primary-darker uppercase bg-[#F9FAFB] border-b border-primary-light">
          <tr>
            {detailsColumns?.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="px-6 py-3 text-sm font-semibold text-primary-darker"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
  
        {productsGetted && productsGetted.length > 0 ? (
          <tbody className="text-[#667085]">
            {productsGetted.map((product) => (
              <tr
                key={product.id}
                className="gap-2 mt-2 border-b border-primary-light"
              >
                <td className="px-6 py-4">
                  <p className="text-[#027A48] font-medium bg-[#00ff9523] rounded-full p-2">
                    #{product.code}
                  </p>
                </td>
                <td className="px-6 py-4 text-primary-darker font-medium">
                  <p className="truncate max-w-[555px] break-words">
                    {product.description}
                  </p>
                </td>
                <td className="px-6 py-4 text-primary-darker font-medium">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-primary-darker font-medium">
                  {product.liquidation
                    ? `$${applyLiquidation(product.price)}`
                    : "No aplica"}
                </td>
                <td className="px-6 py-4 text-primary-darker font-medium">
                  <Badge type={product.status} />
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td
                colSpan={detailsColumns.length}
                className="text-center py-4 text-lg text-primary-dark font-semibold"
              >
                ¡Ve a la pestaña de productos y comienza a cargarlos!
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
  
};

export default SellerProductRequestResponse;
