import { FairDto, IFair } from "@/types";

export type ProductPrinter = {
    id: string;
    brand: string;
    description: string;
    price: number;
    size: string;
    photoUrl: string;
    liquidation: boolean;
    code: string;
    status: string;
    category: string;
    fairCategory: {
      fair: IFair;
    };
  };