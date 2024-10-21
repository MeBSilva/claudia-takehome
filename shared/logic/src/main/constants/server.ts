export const server = {
  environment: process.env.NODE_ENV ?? "development",
  // biome-ignore lint/style/noNonNullAssertion: handled by checkENV util
  openaiUrl: process.env.OPENAI_URL!,
  // biome-ignore lint/style/noNonNullAssertion: handled by checkENV util
  openaiApiKey: process.env.OPENAI_API_KEY!,
  // biome-ignore lint/style/noNonNullAssertion: handled by checkENV util
  claudiaUrl: process.env.CLAUDIA_URL!,
  // biome-ignore lint/style/noNonNullAssertion: handled by checkENV util
  claudiaApiKey: process.env.CLAUDIA_API_KEY!,
};
