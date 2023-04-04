import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Transaction {
  @Prop({ required: true })
  isAllowed: boolean;
  @Prop({ required: true })
  transactionId: string;
  @Prop()
  externalId?: string;
  @Prop()
  amount?: string;
}
export const PsTransactionSchema = SchemaFactory.createForClass(Transaction);
