import {
  IPasswordChange,
  ISeller,
  IUser,
  IUserLogin,
  ProductProps,
  UniqueData,
  UserDto,
  FairDto,
} from "@/types";
import { URL } from "../../envs";

export const postUserRegister = async (user: Partial<UserDto>) => {
  try {
    const checkUnique = await getUniqueData();

    const existUserDni = checkUnique.userInfo.some(
      (unique: Partial<IUser>) => unique.dni === user.dni
    );

    const existUserEmail = checkUnique.userInfo.some(
      (unique: Partial<IUser>) => unique.email === user.email
    );

    if (existUserDni) {
      throw new Error("Este dni ya está registrada en nuestra base de datos");
    }

    if (existUserEmail) {
      throw new Error("Este email ya está registrado en nuestra base de datos");
    } else {
      const res = await fetch(`${URL}/auth/register/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        throw new Error("Error en el registro");
      }

      return res;
    }
  } catch (error: any) {
    throw new Error(error.message || "Error en el registro");
  }
};

export const postSellerRegister = async (seller: Partial<ISeller>): Promise<Response> => {
  try {
    const res = await fetch(`https://elplac-production-3a9f.up.railway.app/auth/register-seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seller),
    });

    const responseText = await res.text(); 
    console.log("Respuesta del backend:", responseText);

    if (!res.ok) {
      throw new Error(responseText || "Error en el registro");
    }

    return res;
  } catch (error: any) {
    console.error("Error en la solicitud:", error);
    throw new Error(error.message || "Error en el registro");
  }
};


export const postUserLogin = async (
  user: IUserLogin & { rememberMe: boolean }
) => {
  try {
    const res = await fetch(`https://elplac-production-3a9f.up.railway.app/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error en la solicitud");
    }
    const data = await res.json();

    return data;
  } catch (error: any) {
    throw error;
  }
};

export const getUser = async (token: string, id: string) => {
  try {
    const res = await fetch(`${URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getSeller = async (token: string, id: string) => {
  try {
    const res = await fetch(`${URL}/sellers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Error ${res.status}: ${errorData.message || res.statusText}`
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
  }
};

export const putUser = async (
  token: string,
  id: string,
  user: Partial<UserDto>
) => {
  try {
    const res = await fetch(`${URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      await res.text();
      throw new Error("Error en la petición");
    }
  } catch (error) {
  }
};

export const putSeller = async (
  token: string,
  id: string,
  user: Partial<UserDto>
) => {
  try {
    const res = await fetch(`${URL}/sellers/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(user),
    });
    if (!res.ok) {
      await res.text();
      throw new Error("Error en la petición");
    }
  } catch (error) {
  }
};

export const changeRole = async (
  userId: string,
  role: string,
  token: string
) => {
  try {
    const res = await fetch(`${URL}/users/changeRole/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: role }),
    });

    if (!res.ok) {
      await res.text();
      throw new Error("Error en la petición");
    }
  } catch (error) {
  }
};

export const putChangePassword = async (
  id: string,
  token: string,
  pass: Partial<IPasswordChange>
) => {
  try {
    const res = await fetch(`${URL}/users/update-password/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pass),
    });
    if (!res.ok) {
      await res.text();
      throw new Error("Error en la petición");
    }
  } catch (error) {
  }
};

export const postForgotPassword = async (email: string) => {
  try {
    const checkUnique = await getUniqueData();

    const existUserEmail = checkUnique.userInfo.some(
      (unique: Partial<IUser>) => unique.email === email
    );

    if (!existUserEmail) {
      throw new Error("Este email no está registrado en nuestra base de datos");
    }

    const res = await fetch(`${URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error en la petición");
    }
    const responseText = await res.text();
    if (responseText) {
      return JSON.parse(responseText);
    } else {
      return {};
    }
  } catch (error: any) {
    throw new Error(error.message || "Error en el registro");
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmPassword: string
) => {
  try {
    const res = await fetch(`${URL}/auth/reset-password/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: newPassword,
        confirmPassword: confirmPassword,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error en la petición");
    }

    const responseText = await res.text();
    if (responseText) {
      return JSON.parse(responseText);
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (token: string) => {
  try {
    const res = await fetch(`${URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
    const data = await res.json();
    return data;
  } catch (error) {
  }
};

export const updateStatusUser = async (id: string, accessToken: string) => {
  try {
    const res = await fetch(`${URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error en la petición");
    }
    const responseText = await res.text();
    try {
      const responseData = JSON.parse(responseText);
      return responseData;
    } catch (error) {
      throw new Error("Respuesta del servidor no es un JSON válido");
    }
  } catch (error) {
    throw error;
  }
};

export const getFair = async () => {
  try {
    const res = await fetch(`${URL}/fairs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
    const data = await res.json();

    return data;
  } catch (error) {
  }
};

export const updateFairStatus = async (
  token: string,
  fairId: string | undefined
) => {
  try {
    const res = await fetch(`${URL}/fairs/close/${fairId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }

    return res;
  } catch (error) {
  }
};

export const postInscription = async (
  fairId: string | undefined,
  userId: string | undefined,
  categoryId: string | undefined,
  liquidation: string,
  token: string
) => {
  try {
    const res = await fetch(
      `${URL}/sellers/${userId}/register/${fairId}/${categoryId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ liquidation }),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Error en la petición: ${errorData.message || res.statusText}`
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
  }
};

export const postTicket = async (
  fairId: string | undefined,
  userId: string,
  token: string,
  dateSelect: string | null,
  timeSelect: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${URL}/users/${userId}/register/fair/${fairId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedHour: timeSelect,
          selectedDay: dateSelect,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      const jsonData = await response.json();
      return jsonData;
    } else if (contentType?.includes("text/plain")) {
      const textData = await response.text();
      return textData;
    } else if (contentType?.includes("text/html")) {
      const htmlData = await response.text();
      throw new Error(
        "El servidor devolvió una página HTML inesperada: " + htmlData
      );
    } else {
      throw new Error(
        `Tipo de respuesta inesperada: ${contentType || "desconocida"}`
      );
    }
  } catch (error: any) {
    alert(
      error.message || "Ocurrió un error desconocido al registrar el ticket"
    );
    return null;
  }
};

export const getUniqueData = async (): Promise<UniqueData> => {
  try {
    const res = await fetch(`${URL}/users/uniquedata`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error en unique data");
    }

    const data: UniqueData = await res.json();
    return data;
  } catch (error: any) {
    throw new Error(
      error.message.includes("unique")
        ? error.message
        : "Error en el registro. Por favor, inténtelo de nuevo."
    );
  }
};

export const checkIsGmailfirstTime = async () => {
  try {
    const res = await fetch(`${URL}/users/uniquedata`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error en la petición");
    }

    const data = await res.json();

    if (data.dni === "") {
      return "Por favor, completa tu DNI.";
    } else if (data.dni === "") {
      return "Por favor, completa tu DNI.";
    } else {
      return "Datos completos.";
    }
  } catch (error) {
    return "Ha ocurrido un error al verificar los datos.";
  }
};

export const getProducts = async (token: string) => {
  try {
    const res = await fetch(`${URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
    const data = await res.json();

    return data;
  } catch (error) {
  }
};

export const createProductRequest = async (
  token: string,
  sellerId: string,
  products: ProductProps[],
  fairId: string
) => {
  try {
    const res = await fetch(`${URL}/product-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        sellerId: sellerId,
        products: products,
        fairId: fairId,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Error ${res.status}: ${errorData.message || res.statusText}`
      );
    }
    const data = await res.json();

    return data;
  } catch (error) {
  }
};

export const updateProductStatus = async (
  productId: string,
  status: string,
  productReqId: string,
  token: string
) => {
  try {
    const res = await fetch(`${URL}/product-request/${productReqId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({ productId: productId, status: status }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Error ${res.status}: ${errorData.message || res.statusText}`
      );
    }
    const data = await res.json();

    return data;
  } catch (error) {
  }
};

export const putProductStatus = async (
  id: string,
  status: string,
  token: string
) => {
  try {
    const res = await fetch(`${URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ status: status }),
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
    const data = await res.json();

    return data;
  } catch (error) {
  }
};

export const checkedProductRequest = async (id: string, token: string) => {
  try {
    const res = await fetch(`${URL}/product-request/check/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
    const data = await res.json();

    return data;
  } catch (error) {
  }
};

export const getAllProductRequest = async (token: string) => {
  try {
    const res = await fetch(`${URL}/product-request`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
    const data = await res.json();

    return data;
  } catch (error) {
  }
};

export const getAllProducts = async (token: string) => {
  try {
    const res = await fetch(`${URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
    const data = await res.json();
    return data;
  } catch (error) {
  }
};

export const blockUser = async (token: string, id: string) => {
  try {
    const res = await fetch(`${URL}/users/block/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
  } catch (error) {
  }
};

export const unblockUser = async (token: string, id: string) => {
  try {
    const res = await fetch(`${URL}/users/unblock/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Error en la petición");
    }
  } catch (error) {
  }
};

export const getProductRequestById = async (
  productReqId: string,
  token: string
) => {
  try {
    const res = await fetch(`${URL}/product-request/${productReqId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Res was not found");
    }
    const data = await res.json();
    return data;
  } catch (error) {
  }
};

export const postCreateFair = async (fairData: FairDto, token: string) => {
  try {
    const res = await fetch(`${URL}/fairs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fairData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Error ${res.status}: ${errorData.message || res.statusText}`
      );
    }

    const responseData = await res.json();
    return responseData;
  } catch (error: any) {
    throw new Error("Error al crear la feria SERVICES");
  }
};

export const getProductsBySeller = async (
  sellerId: string | undefined,
  token: string
) => {
  try {
    const res = await fetch(`${URL}/products/seller/${sellerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Res was not found");
    }
    const data = await res.json();
    return data;
  } catch (error) {
  }
};
