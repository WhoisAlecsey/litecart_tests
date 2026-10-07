import { config } from 'dotenv';

config({ quiet: true });

/** Environment-specific settings. The only place that reads `process.env`. */
export const env = {
  baseUrl: process.env.BASE_URL ?? 'http://litecart.stqa.ru',
  customerEmail: process.env.CUSTOMER_EMAIL,
  customerPassword: process.env.CUSTOMER_PASSWORD,
  rejectedEmail: process.env.REJECTED_EMAIL,
  rejectedPassword: process.env.REJECTED_PASSWORD,
} as const;
