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

// Extendemos la interfaz para aceptar los productos locales
interface ExtendedProps extends ISellerProductRequestTableProps {
  productsToPreview?: any[]; // Array de productos que el usuario está editando
}

const SellerProductRequestResponse: React.FC<ExtendedProps> = ({ 
  sellerId, 
  productsToPreview 
}) => {
  const [productsGetted, setProductsGetted] = useState<
    ProductsGettedBySellerId[] | null
  >(null);
  const { token } = useAuth();
  const { activeFair } = useFair();

  useEffect(() => {
    if (activeFair && sellerId) {
      getProductsBySeller(sellerId, token)
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
    return price - discount;
  };

  // Priorizamos los productos que el usuario está cargando actualmente
  // Si no hay productos en carga, mostramos los que ya están en la base de datos
  const displayProducts = (productsToPreview && productsToPreview.length > 0) 
    ? productsToPreview 
    : productsGetted;

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

        {displayProducts && displayProducts.length > 0 ? (
          <tbody className="text-[#667085]">
            {displayProducts.map((product, index) => (
              <tr
                key={product.id || index}
                className="gap-2 mt-2 border-b border-primary-light"
              >
                <td className="px-6 py-4">
                  <p className="text-[#027A48] font-medium bg-[#00ff9523] rounded-full p-2 text-center">
                    {product.code ? `#${product.code}` : "Pendiente"}
                  </p>
                </td>
                <td className="px-6 py-4 text-primary-darker font-medium">
                  <p className="truncate max-w-[555px] break-words">
                    {product.description}
                  </p>
                  {product.brand && (
                    <span className="text-xs text-gray-500 block">Marca: {product.brand}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-primary-darker font-medium">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-primary-darker font-medium">
                  {product.liquidation || product.liquidationSelected
                    ? `$${applyLiquidation(Number(product.price))}`
                    : "No aplica"}
                </td>
                <td className="px-6 py-4 text-primary-darker font-medium">
                  {product.status ? (
                    <Badge type={product.status} />
                  ) : (
                    <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs">
                      En carga
                    </span>
                  )}
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