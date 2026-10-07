import { env } from '../config/env';
import type { Credentials } from '../models/Credentials';

function credentials(email: string | undefined, password: string | undefined, variables: string): Credentials {
  if (!email || !password) {
    throw new Error(`${variables} are not set: copy .env.example to .env and fill them in`);
  }
  return { email, password };
}

/** A customer registered in the store. */
export function registeredCustomer(): Credentials {
  return credentials(env.customerEmail, env.customerPassword, 'CUSTOMER_EMAIL and CUSTOMER_PASSWORD');
}

/** An e-mail / password pair the store does not accept. */
export function rejectedCustomer(): Credentials {
  return credentials(env.rejectedEmail, env.rejectedPassword, 'REJECTED_EMAIL and REJECTED_PASSWORD');
}
