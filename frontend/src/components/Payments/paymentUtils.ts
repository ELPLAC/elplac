import { URL } from "../../../envs";

export const handlePayment = async (
  userId: string | undefined,
  fairId: string | undefined,
  categoryId: string | undefined
) => {
  try {
    const response = await fetch(`${URL}/payments/createPreferenceSeller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        fairId: fairId,
        categoryId: categoryId,
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!text) {
      throw new Error("Empty response");
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      throw new Error("Error parsing JSON: " + (parseError as Error).message);
    }
  } catch (error: any) {
    throw error;
  }
};
