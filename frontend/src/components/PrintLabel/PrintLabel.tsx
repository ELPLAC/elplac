import { useState } from "react";
import PrintButton from "./components/PrintButton";
import { fetchProducts } from "./components/utils/Api";
import { ProductPrinter } from "./components/utils/Product.type";
import { printContent } from "./components/utils/printContent";
import { PrintLabelProps } from "@/types";
import { useAuth } from "@/context/AuthProvider";
import { useFair } from "@/context/FairProvider";

const PrintLabel: React.FC<PrintLabelProps> = ({ sellerId }) => {
  const [productInfo, setProductInfo] = useState<ProductPrinter[] | null>(null);
  const { token } = useAuth();
  const [isDisabled, setIsDisabled] = useState(false); 
  const {activeFair} = useFair();

  const fairId = activeFair?.id

  const getProductsAndPrint = async () => {
    try {
      setIsDisabled(true);
      const data = await fetchProducts(sellerId, token);
  
      console.log("Productos obtenidos:", data);
  
      const filteredProducts = data.filter(product => product.fairCategory?.fair?.id === fairId);
  
      console.log("Productos filtrados:", filteredProducts);
  
      setProductInfo(filteredProducts);
      printLabel(filteredProducts);
      setIsDisabled(false);
    } catch (error) {
      setIsDisabled(false);
    }
  };
  

  const printLabel = (products: ProductPrinter[]) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent(products));
      printWindow.document.close();
    }
  };

  return <PrintButton onClick={getProductsAndPrint} isDisabled={isDisabled} />;
};

export default PrintLabel;
