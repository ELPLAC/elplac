import {
  IDashboardSellerErrors,
  IDashboardUserErrors,
  ILoginFormErrors,
  IPasswordChangeErrors,
  IPasswordChangeForgotErrors,
  IRegisterFormErrors,
} from "@/types";

export async function registerSellerValidations(
  values: any
): Promise<IRegisterFormErrors> {
  const errors: IRegisterFormErrors = {};
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexName = /^[a-zA-ZÀ-ÿ\s]+$/;
  const regexPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-])/;
  try {

    if (!values.name) {
      errors.name = "Ingresa tu nombre";
    } else if (!regexName.test(values.name)) {
      errors.name = "El nombre solo puede tener letras y espacios";
    } else if (values.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (values.name.length > 25) {
      errors.name = "El nombre debe tener menos de 26 caracteres";
    }

    if (!values.lastname) {
      errors.lastname = "Ingresa tu apellido";
    } else if (!regexName.test(values.lastname)) {
      errors.lastname = "El apellido solo puede tener letras y espacios";
    } else if (values.name.length < 3) {
      errors.lastname = "El apellido debe tener al menos 3 caracteres";
    } else if (values.name.length > 25) {
      errors.lastname = "El apellido debe tener menos de 26 caracteres";
    }

    if (!values.email) {
      errors.email = "Ingresa tu email";
    } else if (!regexEmail.test(values.email)) {
      errors.email =
        "El email solo puede contener letras, números, puntos y guiones";
    } 

    if (typeof values.address !== "string") {
      errors.address = "La dirección debe ser un texto";
    } else if (values.address.length < 3) {
      errors.address = "La dirección debe tener al menos 3 caracteres";
    } else if (values.address.length > 40) {
      errors.address = "La dirección no debe tener más de 40 caracteres";
    }

    if (!values.phone) {
      errors.phone = "Ingresa tu teléfono";
    } else if (isNaN(Number(values.phone))) {
      errors.phone = "El teléfono solo puede contener números";
    }

    if (!values.dni) {
      errors.dni = "Ingresa tu dni";
    } else if (isNaN(Number(values.dni))) {
      errors.dni = "El DNI solo pueden ser números";
    } else if (Number(values.dni) < 1000000) {
      errors.dni = "Tiene que ser un número de DNI valido";
    } else if (Number(values.dni) > 99999999) {
      errors.dni = "Tiene que ser un número de DNI valido";
    }

    if (values.social_media && typeof values.social_media !== "string") {
      errors.social_media = "El campo de Instagram debe ser texto";
    }

    if (!values.password) {
      errors.password = "Ingresa tu contraseña";
    } else if (typeof values.password !== "string") {
      errors.password = "La contraseña debe ser un texto";
    } else if (values.password.length < 8 || values.password.length > 15) {
      errors.password = "La contraseña debe tener entre 8 y 15 caracteres";
    } else if (!regexPassword.test(values.password)) {
      errors.password =
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Ingresa la contraseña otra vez";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Las contraseñas deben ser iguales";
    }

    return errors;
  } catch (error: any) {
    return errors;
  }
}
export async function registerUserValidations(
  values: any
): Promise<IRegisterFormErrors> {
  const errors: IRegisterFormErrors = {};
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexName = /^[a-zA-ZÀ-ÿ\s]+$/;
  const regexPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-])/;
  try {

    if (!values.name) {
      errors.name = "Ingresa tu nombre";
    } else if (!regexName.test(values.name)) {
      errors.name = "El nombre solo puede tener letras y espacios";
    } else if (values.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (values.name.length > 25) {
      errors.name = "El nombre debe tener menos de 26 caracteres";
    }

    if (!values.lastname) {
      errors.lastname = "Ingresa tu apellido";
    } else if (!regexName.test(values.lastname)) {
      errors.lastname = "El apellido solo puede tener letras y espacios";
    } else if (values.name.length < 3) {
      errors.lastname = "El apellido debe tener al menos 3 caracteres";
    } else if (values.name.length > 25) {
      errors.lastname = "El apellido debe tener menos de 26 caracteres";
    }

    if (!values.email) {
      errors.email = "Ingresa tu email";
    } else if (!regexEmail.test(values.email)) {
      errors.email =
        "El email solo puede contener letras, números, puntos y guiones";
    } 

    if (!values.dni) {
      errors.dni = "Ingresa tu dni";
    } else if (isNaN(Number(values.dni))) {
      errors.dni = "El DNI solo pueden ser números";
    } else if (Number(values.dni) < 1000000) {
      errors.dni = "Tiene que ser un número de DNI valido";
    } else if (Number(values.dni) > 99999999) {
      errors.dni = "Tiene que ser un número de DNI valido";
    }

    if (!values.password) {
      errors.password = "Ingresa tu contraseña";
    } else if (typeof values.password !== "string") {
      errors.password = "La contraseña debe ser un texto";
    } else if (values.password.length < 8 || values.password.length > 15) {
      errors.password = "La contraseña debe tener entre 8 y 15 caracteres";
    } else if (!regexPassword.test(values.password)) {
      errors.password =
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Ingresa la contraseña otra vez";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Las contraseñas deben ser iguales";
    }

    return errors;
  } catch (error: any) {
    return errors;
  }
}

export const loginValidations = (values: any) => {
  try {
    const errors: ILoginFormErrors = {};
    if (!values.email) {
      errors.email = "Ingresa el email";
    }
    if (!values.password) {
      errors.password = "Ingresa la contraseña";
    }

    return errors;
  } catch (error: any) {
  }
};

export const forgotPassValidations = (values: any) => {
  try {
    const errors: ILoginFormErrors = {};
    if (!values.email) {
      errors.email = "Ingresa el email";
    }

    return errors;
  } catch (error: any) {
  }
};

export const resetPasswordValidations = (values: any) => {
  const errors: IPasswordChangeForgotErrors = {};
  const regexPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-])/;

  if (values.newPassword !== values.confirmNewPassword) {
    errors.newPassword = "Las contraseñas deben ser iguales";
  } else if (!regexPassword.test(values.newPassword)) {
    errors.newPassword =
      "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial";
  }

  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = "Ingresa la contraseña otra vez";
  } else if (values.confirmNewPassword !== values.newPassword) {
    errors.confirmNewPassword = "Las contraseñas deben ser iguales";
  }

  return errors;
};

export const passwordValidations = (values: any) => {
  const errors: IPasswordChangeErrors = {};
  const regexPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_\-])/;

  if (!values.current_password) {
    errors.current_password = "Ingresa tu contraseña";
  } else if (typeof values.current_password !== "string") {
    errors.current_password = "Debe ser un texto";
  } else if (
    values.current_password.length < 8 ||
    values.current_password.length > 15
  ) {
    errors.current_password = "Debe tener entre 8 y 15 caracteres";
  } else if (!regexPassword.test(values.current_password)) {
    errors.current_password =
      "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial";
  }

  if (!values.newPassword) {
    errors.newPassword = "Ingresa la contraseña otra vez";
  } else if (values.newPassword === values.current_password) {
    errors.newPassword = "Debe ser diferente de su contraseña actual";
  } else if (values.newPassword !== values.confirmNewPassword) {
    errors.newPassword = "Las contraseñas deben ser iguales";
  } else if (!regexPassword.test(values.newPassword)) {
    errors.newPassword =
      "Debe contener al menos una mayúscula, una minúscula, un número y un carácter especial";
  }

  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = "Ingresa la contraseña otra vez";
  } else if (values.confirmNewPassword !== values.newPassword) {
    errors.confirmNewPassword = "Las contraseñas deben ser iguales";
  } else if (values.confirmNewPassword === values.current_password) {
    errors.newPassword = "Debe ser diferente de su contraseña actual";
  }

  return errors;
};

export async function dashboardUserValidations(
  values: any
): Promise<IDashboardUserErrors> {
  const errors: IDashboardUserErrors = {};
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexName = /^[a-zA-ZÀ-ÿ\s]+$/;
  try {

    if (!values.name) {
      errors.name = "Ingresa tu nombre";
    } else if (!regexName.test(values.name)) {
      errors.name = "El nombre solo puede tener letras y espacios";
    } else if (values.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (values.name.length > 25) {
      errors.name = "El nombre debe tener menos de 26 caracteres";
    }

    if (!values.lastname) {
      errors.lastname = "Ingresa tu apellido";
    } else if (!regexName.test(values.lastname)) {
      errors.lastname = "El apellido solo puede tener letras y espacios";
    } else if (values.name.length < 3) {
      errors.lastname = "El apellido debe tener al menos 3 caracteres";
    } else if (values.name.length > 25) {
      errors.lastname = "El apellido debe tener menos de 26 caracteres";
    }

    if (!values.email) {
      errors.email = "Ingresa tu email";
    } else if (!regexEmail.test(values.email)) {
      errors.email =
        "El email solo puede contener letras, números, puntos y guiones";
    }

    if (!values.dni) {
      errors.dni = "Ingresa tu dni";
    } else if (isNaN(Number(values.dni))) {
      errors.dni = "El DNI solo pueden ser números";
    } else if (Number(values.dni) < 1000000) {
      errors.dni = "Tiene que ser un número de DNI valido";
    } else if (Number(values.dni) > 99999999) {
      errors.dni = "Tiene que ser un número de DNI valido";
    }
    return errors;
  } catch (error: any) {
    return errors;
  }
}

export async function dashboardSellerValidations(
  values: any
): Promise<IDashboardSellerErrors> {
  const errors: IRegisterFormErrors = {};
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexName = /^[a-zA-ZÀ-ÿ\s]+$/;
  try {
    if (!values.name) {
      errors.name = "Ingresa tu nombre";
    } else if (!regexName.test(values.name)) {
      errors.name = "El nombre solo puede tener letras y espacios";
    } else if (values.name.length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (values.name.length > 25) {
      errors.name = "El nombre debe tener menos de 26 caracteres";
    }
    if (!values.lastname) {
      errors.lastname = "Ingresa tu apellido";
    } else if (!regexName.test(values.lastname)) {
      errors.lastname = "El apellido solo puede tener letras y espacios";
    } else if (values.name.length < 3) {
      errors.lastname = "El apellido debe tener al menos 3 caracteres";
    } else if (values.name.length > 25) {
      errors.lastname = "El apellido debe tener menos de 26 caracteres";
    }

    if (!values.email) {
      errors.email = "Ingresa tu email";
    } else if (!regexEmail.test(values.email)) {
      errors.email =
        "El email solo puede contener letras, números, puntos y guiones";
    } 
    if (!values.address) {
      errors.address = "Ingresa tu dirección";
    } else if (typeof values.address !== "string") {
      errors.address = "La dirección debe ser un texto";
    } else if (values.address.length < 3) {
      errors.address = "La dirección debe tener al menos 3 caracteres";
    } else if (values.address.length > 40) {
      errors.address = "La dirección no debe tener más de 40 caracteres";
    }

    if (!values.phone) {
      errors.phone = "Ingresa tu teléfono";
    } else if (isNaN(Number(values.phone))) {
      errors.phone = "El teléfono solo puede contener números";
    }

    if (!values.dni) {
      errors.dni = "Ingresa tu dni";
    } else if (isNaN(Number(values.dni))) {
      errors.dni = "El DNI solo pueden ser números";
    } else if (Number(values.dni) < 1000000) {
      errors.dni = "Tiene que ser un número de DNI valido";
    } else if (Number(values.dni) > 99999999) {
      errors.dni = "Tiene que ser un número de DNI valido";
    }

    if (!values.social_media) {
      errors.social_media = "Ingresa tu instagram";
    }

    return errors;
  } catch (error: any) {
    return errors;
  }
}

export async function dashboardSellerPaymentsValidations(
  values: any
): Promise<IRegisterFormErrors> {
  const errors: IRegisterFormErrors = {};

  const regexBankAccount = /^[a-zA-Z0-9\s.]+$/;

  if (!values.address) {
    errors.address = "Ingresa tu dirección";
  } else if (typeof values.address !== "string") {
    errors.address = "La dirección debe ser un texto";
  } else if (values.address.trim().length < 3) {
    errors.address = "La dirección debe tener al menos 3 caracteres";
  } else if (values.address.trim().length > 40) {
    errors.address = "La dirección no debe tener más de 40 caracteres";
  }

  if (!values.phone || !values.phone.trim()) {
    errors.phone = "Ingresa tu teléfono";
  } else if (isNaN(Number(values.phone))) {
    errors.phone = "El teléfono solo puede contener números";
  }

  if (!values.social_media || !values.social_media.trim()) {
    errors.social_media = "Ingresa tu instagram";
  }

  return errors;
}
