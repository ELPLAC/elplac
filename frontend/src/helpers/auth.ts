import { decodeJWT } from "./decoder";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.exp) {

      return true;
    }
    const expirationTime = decodedToken.exp * 1000; 
    return Date.now() > expirationTime; 
  } catch (error) {

    return true; 
  }
};
