import dotenv from "dotenv";
dotenv.config();

export const URL = process.env.NEXT_PUBLIC_API_URL_BACK || "elplac-production-3a9f.up.railway.app";

export const MERCADOPAGO_PUBLIC_KEY: string =
  process.env.MERCADOPAGO_PUBLIC_KEY || " ";

