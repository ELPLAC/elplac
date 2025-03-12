import { decodeJWT } from "./decoder";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = decodeJWT(token); 

    if (!decodedToken || !decodedToken.exp) {
      console.warn('El token no tiene campo de expiración o no es válido');
      return true; 
    }

    const expirationTime = decodedToken.exp * 1000; 
    return Date.now() > expirationTime; 
  } catch (error) {
    console.error('Error al verificar si el token ha expirado:', error);
    return true; 
  }
};
