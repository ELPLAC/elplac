import { useState } from "react";
import PrintButton from "./components/PrintButton";
import { printContent } from "./components/utils/printContent";
import { ProductPrinter } from "./components/utils/Product.type";
import { useAuth } from "@/context/AuthProvider";
import { fetchProductsForAdmin } from "./components/utils/Api";

const PrintLabelForAdmin: React.FC<{ fairId: string | undefined }> = ({ fairId }) => {
  const [productInfo, setProductInfo] = useState<ProductPrinter[] | null>(null);
  const { token } = useAuth();

  const getProductsAndPrint = async () => {
    try {
      if (!fairId) {
        return;
      }
  
      const data = await fetchProductsForAdmin(fairId, token); 
      
      const allowedStatuses = ["accepted", "unsold", "sold", "soldOnClearance", "acceptedPlay"];
      const filteredData = data.filter((product: any) => allowedStatuses.includes(product.status));
  
      setProductInfo(filteredData);
      printLabel(filteredData);
    } catch (error) {
    }
  };
  

  const printLabel = (products: ProductPrinter[]) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent(products));
      printWindow.document.close();
    }
  };

  return (
    <PrintButton 
      onClick={getProductsAndPrint} 
      isDisabled={!fairId}  
    />
  );
};

export default PrintLabelForAdmin;
