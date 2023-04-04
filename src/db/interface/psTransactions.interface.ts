import { Document } from 'mongoose';
export interface IPsTransactions extends Document {
  readonly isAllowed: boolean;
  readonly transactionId: string;
  readonly externalId: string;
  readonly amount: string;
}
