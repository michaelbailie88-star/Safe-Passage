// Price IDs are not sensitive — safe to import in client components.
// Kept separate from server.ts so client bundles never accidentally pull
// in the Stripe SDK (which is initialized with the secret key there).
export const PREMIUM_MONTHLY_PRICE_ID = "price_1U0mZQQ0BdZodLRjY5OrlqZa";
export const PREMIUM_YEARLY_PRICE_ID = "price_1U0mZWQ0BdZodLRjem9FGG0c";
