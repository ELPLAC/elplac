import { UserDto } from "@/types";

export const verifyUserDetails = (userDtos: UserDto) => {
  if (userDtos && userDtos.email) {
    const missingFields: string[] = [];

    const dni = userDtos.dni.trim();
    const profilePicture = userDtos.profile_picture?.trim();

    if (userDtos.role === "user") {
      if (!dni) missingFields.push("DNI");
      if (!profilePicture) missingFields.push("foto de perfil");
    } else if (userDtos.role === "seller") {
      const phone = userDtos.seller?.phone;
      const address = userDtos.seller?.address.trim();
      const socialMedia = userDtos.seller?.social_media.trim();

      if (!dni) missingFields.push("DNI");
      if (!phone) missingFields.push("teléfono");
      if (!address) missingFields.push("dirección");
      if (!socialMedia) missingFields.push("redes sociales");
      if (!profilePicture) missingFields.push("foto de perfil");
    }

    if (missingFields.length) {
      return "Completá los datos faltantes";
    }
  }
  return null;
};
