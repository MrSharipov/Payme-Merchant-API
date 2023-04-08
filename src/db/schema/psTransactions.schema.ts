import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Transaction {
  @Prop({ required: true })
  isAllowed: boolean;
  @Prop({ required: true })
  transactionId: string;
  @Prop({ unique: true, required: true })
  externalId: string;
  @Prop({ required: true })
  externalTime: number;
  @Prop()
  amount?: string;
  @Prop({ type: String, required: true })
  orderId: string;
  @Prop({ type: Number, default: null })
  reason?: number;
  @Prop({ type: Number, required: true })
  state: number;
  @Prop({ type: Number, required: true, default: Date.now() })
  create_time: number;
  @Prop({ type: Number, required: true, default: 0 })
  perform_time: number;
  @Prop({ type: Number, required: true, default: 0 })
  cancel_time: number;
}
export const PsTransactionSchema = SchemaFactory.createForClass(Transaction);
