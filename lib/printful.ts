import { env } from "./env";

export const createPrintfulOrder = async ({
  productId,
  recipientEmail,
}: {
  productId: string;
  recipientEmail: string;
}) => {
  const response = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.printfulApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: {
        email: recipientEmail,
      },
      items: [
        {
          sync_product_id: Number(productId),
          quantity: 1,
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Printful order creation failed: ${text}`);
  }

  const data = await response.json();
  return data.result?.id as string;
};
