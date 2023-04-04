import { Document } from 'mongoose';
export interface IPsTransactions extends Document {
  readonly isAllowed: boolean;
  readonly transactionId: string;
  readonly externalId: string;
  readonly state: number;
  readonly reason: number;
  readonly amount: string;
  readonly create_time: number;
  readonly perform_time: number;
  readonly cancel_time: number;
}
