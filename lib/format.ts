/** USD dollars (e.g. 44), as stored on `artworks.price`. */
export const formatCurrency = (amountInDollars: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInDollars);

/** USD cents (e.g. 4400), as stored on `orders.amount`. */
export const formatCurrencyFromCents = (amountInCents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
