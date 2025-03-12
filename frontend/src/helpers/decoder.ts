export const decodeJWT = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Token JWT inválido. Debe contener 3 partes.");
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Reemplazamos para base64 estándar

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)) // Escapamos los caracteres especiales
        .join("")
    );

    return JSON.parse(jsonPayload); 
  } catch (error) {
    console.error("Error al decodificar el token JWT:", error);
    return null; 
  }
};
