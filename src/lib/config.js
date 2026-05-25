import "dotenv/config";

export const cfg = {
  PORT: process.env.PORT || "3000",
  CMB_WHATSAPP_WEBHOOK_SECRET: process.env.CMB_WHATSAPP_WEBHOOK_SECRET || "",
};
